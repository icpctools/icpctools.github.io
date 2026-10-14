import type { Release, Repo } from './types';

export const REPOS: Record<Repo, string> = {
	icpctools: 'https://github.com/icpctools/icpctools',
	'team-view': 'https://github.com/icpctools/team-view'
};

export function downloadUrl(repo: Repo, release: Pick<Release, 'tag'>, file: string): string {
	return `${REPOS[repo]}/releases/download/${release.tag}/${file}`;
}

/** GitHub page for a file on the repo's main branch */
export function fileUrl(repo: Repo, path: string): string {
	return `${REPOS[repo]}/blob/main/${path}`;
}

export function releaseUrl(repo: Repo, release: Pick<Release, 'tag'>): string {
	return `${REPOS[repo]}/releases/tag/${release.tag}`;
}

/** Package name from an npm package reference (name@version) */
export function pkgName(pkg: string): string {
	return pkg.slice(0, pkg.lastIndexOf('@'));
}

/** npmjs.com page for an npm package reference (name@version) */
export function npmUrl(pkg: string): string {
	return `https://www.npmjs.com/package/${pkgName(pkg)}/v/${pkg.slice(pkg.lastIndexOf('@') + 1)}`;
}

export function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
}

export function formatTime(iso: string): string {
	return iso.slice(11, 19);
}

// Tools to show on the all-builds pages, keyed by zip prefix (from tools.yaml)
export const BUILD_TOOLS: Record<Repo, { tool: string; name: string }[]> = {
	icpctools: [
		{ tool: 'wlp.CDS', name: 'CDS (Open Liberty)' },
		{ tool: 'CDS', name: 'CDS (WAR only)' },
		{ tool: 'resolver', name: 'Resolver' },
		{ tool: 'presentationAdmin', name: 'Presentation Admin' },
		{ tool: 'presentations', name: 'Presentation Client' },
		{ tool: 'balloonUtil', name: 'Balloon Utility' },
		{ tool: 'coachview', name: 'Coach View' },
		{ tool: 'contestUtil', name: 'Contest Utilities' }
	],
	'team-view': [{ tool: 'team-view', name: 'Team View' }]
};
