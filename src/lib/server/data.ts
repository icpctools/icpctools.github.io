// Server-only so the full release history is never bundled into client code. Since every page is
// prerendered, this only runs at build time and pages pick out just the data they need.
import data from '$lib/data/releases.json';
import type { Latest, Release, Repo } from '$lib/types';

export const releases = data.releases as Record<Repo, Release[]>;
/** When the release data was last fetched */
export const fetched = data.fetched;

export function latest(repo: Repo): Latest {
	return {
		release: releases[repo].find((r) => !r.prerelease),
		prerelease: releases[repo].find((r) => r.prerelease)
	};
}
