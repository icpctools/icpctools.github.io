import type { Tool } from './tools';
import type { Release } from './types';

/** GitHub page for a repo in the icpctools org */
export function repoUrl(repo: string): string {
	return `https://github.com/icpctools/${repo}`;
}

export function downloadUrl(repo: string, release: Pick<Release, 'tag'>, file: string): string {
	return `${repoUrl(repo)}/releases/download/${release.tag}/${file}`;
}

/** GitHub page for a file at a git ref (branch, tag, or commit) */
export function fileUrl(repo: string, ref: string, path: string): string {
	return `${repoUrl(repo)}/blob/${ref}/${path}`;
}

/** A tool's README as of a release, or on the main branch */
export function readmeUrl(tool: Pick<Tool, 'repo' | 'readme'>, release?: Pick<Release, 'tag'>): string {
	return fileUrl(tool.repo, release?.tag ?? 'main', tool.readme);
}

export function issuesUrl(repo: string): string {
	return `${repoUrl(repo)}/issues`;
}

export function releaseUrl(repo: string, release: Pick<Release, 'tag'>): string {
	return `${repoUrl(repo)}/releases/tag/${release.tag}`;
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
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC'
	});
}

export function formatTime(iso: string): string {
	return iso.slice(11, 19);
}
