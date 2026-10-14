#!/usr/bin/env node
// Fetches release data from GitHub at build time and writes it to src/lib/data/, so the site can be
// fully prerendered and served without a server.
//
//   node scripts/fetch-data.mjs              fetch everything
//   node scripts/fetch-data.mjs --if-missing only fetch if data doesn't exist yet (used by `dev`)
//
// Set GITHUB_TOKEN to avoid the 60 requests/hour unauthenticated rate limit.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = join(root, 'src/lib/data/releases.json');
const args = process.argv.slice(2);

const ICPCTOOLS_REPO = 'icpctools/icpctools';
const TEAM_VIEW_REPO = 'icpctools/team-view';

// Container images published on ghcr.io for each release, tagged by version, keyed by repo and then tool
const CONTAINER_IMAGES = {
	[ICPCTOOLS_REPO]: { 'wlp.CDS': 'icpctools/cds' },
	[TEAM_VIEW_REPO]: { 'team-view': 'icpctools/team-view' }
};

// npm packages published on npmjs.com for each release, by version, keyed by repo and then tool
const NPM_PACKAGES = {
	[TEAM_VIEW_REPO]: { 'team-view': ['@icpctools/contest-api', '@icpctools/contest-ui'] }
};

async function github(url) {
	const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'icpctools-website' };
	if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	const r = await fetch(url, { headers });
	if (!r.ok) throw new Error(`GET ${url} failed: ${r.status} ${await r.text()}`);
	return r;
}

async function allReleases(repo) {
	const result = [];
	let url = `https://api.github.com/repos/${repo}/releases?per_page=100`;
	while (url) {
		const r = await github(url);
		result.push(...(await r.json()));
		url = r.headers.get('link')?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
	}
	return result
		.filter((r) => !r.draft)
		.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

// Both repos publish assets named <tool>-<version>.zip with optional .sha256/.sha512 checksum files
const assetPattern = /^(?<tool>.*)-(?<version>\d+\.\d+\.\d+)\.zip\.?(?<check>.*)?$/;

async function containerTags(image) {
	const auth = await fetch(`https://ghcr.io/token?scope=repository:${image}:pull`);
	if (!auth.ok) throw new Error(`ghcr.io token for ${image} failed: ${auth.status}`);
	const headers = { Authorization: `Bearer ${(await auth.json()).token}` };
	const tags = [];
	let url = `https://ghcr.io/v2/${image}/tags/list?n=1000`;
	while (url) {
		const r = await fetch(url, { headers });
		if (!r.ok) throw new Error(`GET ${url} failed: ${r.status}`);
		tags.push(...((await r.json()).tags ?? []));
		const next = r.headers.get('link')?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
		url = next && new URL(next, 'https://ghcr.io').href;
	}
	return new Set(tags);
}

async function npmVersions(name) {
	const r = await fetch(`https://registry.npmjs.org/${name.replace('/', '%2F')}`, {
		headers: { Accept: 'application/vnd.npm.install-v1+json' }
	});
	if (!r.ok) throw new Error(`GET npm package ${name} failed: ${r.status}`);
	return new Set(Object.keys((await r.json()).versions));
}

function release(release, images, packages) {
	const downloads = {};
	for (const asset of release.assets) {
		const m = asset.name.match(assetPattern);
		if (!m) continue;
		const { tool, version, check } = m.groups;
		const d = (downloads[tool] ??= { version, file: '', size: 0, checks: [] });
		if (!check) {
			d.file = asset.name;
			d.size = Math.round((asset.size / 1024 / 1024) * 100) / 100;
		} else {
			d.checks.push(check);
		}
	}
	const version = release.tag_name.replace(/^v/, '');
	return {
		version,
		tag: release.tag_name,
		created: release.created_at,
		prerelease: release.prerelease,
		downloads,
		images: Object.fromEntries(
			images.filter((i) => i.tags.has(version)).map((i) => [i.tool, `ghcr.io/${i.image}:${version}`])
		),
		npm: Object.fromEntries(
			Object.entries(Object.groupBy(packages.filter((p) => p.versions.has(version)), (p) => p.tool)).map(
				([tool, ps]) => [tool, ps.map((p) => `${p.name}@${version}`)]
			)
		)
	};
}

async function repoReleases(repo) {
	const [releases, images, packages] = await Promise.all([
		allReleases(repo),
		Promise.all(
			Object.entries(CONTAINER_IMAGES[repo] ?? {}).map(async ([tool, image]) => ({
				tool,
				image,
				tags: await containerTags(image)
			}))
		),
		Promise.all(
			Object.entries(NPM_PACKAGES[repo] ?? {}).flatMap(([tool, names]) =>
				names.map(async (name) => ({ tool, name, versions: await npmVersions(name) }))
			)
		)
	]);
	return releases.map((r) => release(r, images, packages));
}

if (args.includes('--if-missing') && existsSync(dataFile)) {
	console.log('Release data already present, skipping fetch (run `pnpm fetch` to refresh)');
	process.exit(0);
}

try {
	mkdirSync(dirname(dataFile), { recursive: true });
	const [icpctools, teamView] = await Promise.all([
		repoReleases(ICPCTOOLS_REPO),
		repoReleases(TEAM_VIEW_REPO)
	]);

	writeFileSync(
		dataFile,
		JSON.stringify({ fetched: new Date().toISOString(), releases: { icpctools, 'team-view': teamView } })
	);
	console.log('Wrote src/lib/data/releases.json');
} catch (e) {
	// Keep building with previously fetched data if GitHub is unavailable (e.g. rate limited)
	if (existsSync(dataFile)) {
		console.warn(`Failed to refresh release data, using existing data: ${e.message}`);
	} else {
		console.error(e);
		process.exit(1);
	}
}
