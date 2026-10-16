// Server-only so the full release history is never bundled into client code. Since every page is
// prerendered, this only runs at build time and pages pick out just the data they need.
import data from '$lib/data/releases.json';
import type { Latest, Release } from '$lib/types';

const releasesByTool = data.tools as Record<string, Release[]>;
/** When the release data was last fetched */
export const fetched = data.fetched;

/** A tool's releases, newest first */
export function releases(slug: string): Release[] {
	return releasesByTool[slug] ?? [];
}

export function latest(slug: string): Latest {
	return {
		release: releases(slug).find((r) => !r.prerelease),
		prerelease: releases(slug).find((r) => r.prerelease)
	};
}
