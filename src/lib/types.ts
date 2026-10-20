export interface Tool {
	/** URL path, from the tool's file name in tools/ */
	slug: string;
	name: string;
	icon: string;
	/** One-line description */
	tagline: string;
	/** GitHub repo (in the icpctools org) the tool is released from */
	repo: string;
	/** Path to the tool's README.md within its repo */
	readme: string;
	/** Page content, as HTML */
	body?: string;
}

export interface Download {
	/** Label to tell the downloads apart, when a tool has several */
	name?: string;
	file: string;
	size: number;
	checks: string[];
}

/** A release of a single tool, from a GitHub release of the tool's repo */
export interface Release {
	version: string;
	tag: string;
	created: string;
	prerelease: boolean;
	/** Zip downloads, the main download first */
	downloads: Download[];
	/** Container image reference */
	image?: string;
	/** npm package references (name@version) */
	npm: string[];
}

export interface Latest {
	release?: Release;
	prerelease?: Release;
}
