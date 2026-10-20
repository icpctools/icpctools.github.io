#!/usr/bin/env node
// Fetches release data from GitHub at build time and writes it to src/lib/data/, so the site can be
// fully prerendered and served without a server.
//
//   node scripts/fetch-data.mjs              fetch everything
//   node scripts/fetch-data.mjs --if-missing only fetch if data doesn't exist yet (used by `dev`)
//
// Set GITHUB_TOKEN to avoid the 60 requests/hour unauthenticated rate limit.

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseToolFile } from '../src/lib/server/tool-file.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = join(root, 'src/lib/data/releases.json');
const args = process.argv.slice(2);

// Tools shown on the site, keyed by slug, from tools/*.md. The frontmatter of each lists the release
// artifacts that belong to the tool: release assets (zips) by prefix (the first is the main download; give them
// labels when there are several), a container image on ghcr.io tagged by version, and npm packages
// published by version
const toolsDir = join(root, 'tools');
const TOOLS = Object.fromEntries(
	readdirSync(toolsDir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => parseToolFile(f, readFileSync(join(toolsDir, f), 'utf8')))
		.map(({ slug, repo, assets = [], image, packages }) => [slug, { repo: `icpctools/${repo}`, assets, image, packages }])
);

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

/** A GitHub release, with its zip assets grouped by prefix */
function repoRelease(release) {
	const zips = {};
	for (const asset of release.assets) {
		const m = asset.name.match(assetPattern);
		if (!m) continue;
		const { tool, version, check } = m.groups;
		const z = (zips[tool] ??= { version, file: '', size: 0, checks: [] });
		if (!check) {
			z.file = asset.name;
			z.size = Math.round((asset.size / 1024 / 1024) * 100) / 100;
		} else {
			z.checks.push(check);
		}
	}
	return {
		version: release.tag_name.replace(/^v/, ''),
		tag: release.tag_name,
		created: release.created_at,
		prerelease: release.prerelease,
		zips
	};
}

/** A tool's releases: the repo releases that contain any of its artifacts */
async function toolReleases({ assets, image, packages = [] }, repoReleases) {
	const [tags, npmPackages] = await Promise.all([
		image && containerTags(image),
		Promise.all(packages.map(async (name) => ({ name, versions: await npmVersions(name) })))
	]);
	const prefixes = Array.isArray(assets) ? assets.map((a) => [a]) : Object.entries(assets);
	return repoReleases.flatMap((r) => {
		const downloads = prefixes.flatMap(([prefix, name]) => {
			const z = r.zips[prefix];
			return z?.file ? [{ ...(name && { name }), ...z }] : [];
		});
		const release = {
			// Zips may be versioned differently from the release tag
			version: downloads[0]?.version ?? r.version,
			tag: r.tag,
			created: r.created,
			prerelease: r.prerelease,
			downloads: downloads.map(({ version, ...d }) => d),
			...(tags?.has(r.version) && { image: `ghcr.io/${image}:${r.version}` }),
			npm: npmPackages.filter((p) => p.versions.has(r.version)).map((p) => `${p.name}@${r.version}`)
		};
		return downloads.length || release.image || release.npm.length ? [release] : [];
	});
}

function hasCurrentData() {
	try {
		return 'tools' in JSON.parse(readFileSync(dataFile, 'utf8'));
	} catch {
		return false;
	}
}

if (args.includes('--if-missing') && hasCurrentData()) {
	console.log('Release data already present, skipping fetch (run `pnpm run fetch` to refresh)');
	process.exit(0);
}

try {
	mkdirSync(dirname(dataFile), { recursive: true });
	const repos = [...new Set(Object.values(TOOLS).map((t) => t.repo))];
	const releases = Object.fromEntries(
		await Promise.all(repos.map(async (repo) => [repo, (await allReleases(repo)).map(repoRelease)]))
	);
	const tools = Object.fromEntries(
		await Promise.all(
			Object.entries(TOOLS).map(async ([slug, tool]) => [slug, await toolReleases(tool, releases[tool.repo])])
		)
	);

	writeFileSync(dataFile, JSON.stringify({ fetched: new Date().toISOString(), tools }));
	console.log('Wrote src/lib/data/releases.json');
} catch (e) {
	// Keep building with previously fetched data if GitHub is unavailable (e.g. rate limited)
	if (hasCurrentData()) {
		console.warn(`Failed to refresh release data, using existing data: ${e.message}`);
	} else {
		console.error(e);
		process.exit(1);
	}
}
