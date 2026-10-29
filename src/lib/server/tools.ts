// Server-only so the Markdown and YAML parsers are never bundled into client code. Each tool is a
// Markdown file in tools/ with YAML frontmatter; the file name is the tool's slug. Screenshots sit
// alongside them in tools/ so they are bundled (and fingerprinted) like any other asset.
import { marked } from 'marked';
import type { Tool } from '#lib/types.js';
import { parseToolFile } from './tool-file';

const files = import.meta.glob<string>('/tools/*.md', { query: '?raw', import: 'default', eager: true });
const images = import.meta.glob<string>('/tools/*.{png,jpg,webp}', { query: '?url', import: 'default', eager: true });

function screenshotUrl(path: string, screenshot?: string): string | undefined {
	if (!screenshot) return undefined;
	const url = images[`/tools/${screenshot}`];
	if (!url) throw new Error(`${path}: screenshot tools/${screenshot} not found`);
	return url;
}

const pages: Tool[] = Object.entries(files)
	.map(([path, text]) => ({ ...parseToolFile(path, text), path }))
	.sort((a, b) => a.order - b.order)
	.map(({ path, slug, name, icon, tagline, repo, readme, screenshot, markdown }) => ({
		slug,
		name,
		icon,
		tagline,
		repo,
		readme,
		body: marked.parse(markdown, { async: false }),
		screenshot: screenshotUrl(path, screenshot)
	}));

/** All tools, in display order, without page content */
export const tools: Tool[] = pages.map(({ body: _, screenshot: __, ...tool }) => tool);

export function toolPage(slug: string): Tool | undefined {
	return pages.find((t) => t.slug === slug);
}
