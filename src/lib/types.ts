export type Repo = 'icpctools' | 'team-view';

export interface ToolDownload {
	version: string;
	file: string;
	size: number;
	checks: string[];
}

export interface Release {
	version: string;
	tag: string;
	created: string;
	prerelease: boolean;
	downloads: Record<string, ToolDownload>;
	/** Container image references published for this release, keyed by tool */
	images: Record<string, string>;
	/** npm package references (name@version) published for this release, keyed by tool */
	npm: Record<string, string[]>;
}

export interface Latest {
	release?: Release;
	prerelease?: Release;
}
