// Server-only so the Markdown and YAML parsers are never bundled into client code. Each tool is a
// Markdown file in tools/ with YAML frontmatter; the file name is the tool's slug.
import { marked } from 'marked';
import type { Tool } from '$lib/types';
import { parseToolFile } from './tool-file';

const files = import.meta.glob<string>('/tools/*.md', { query: '?raw', import: 'default', eager: true });

const pages: Tool[] = Object.entries(files)
	.map(([path, text]) => parseToolFile(path, text))
	.sort((a, b) => a.order - b.order)
	.map(({ slug, name, icon, tagline, repo, readme, markdown }) => ({
		slug,
		name,
		icon,
		tagline,
		repo,
		readme,
		body: marked.parse(markdown, { async: false })
	}));

/** All tools, in display order, without page content */
export const tools: Tool[] = pages.map(({ body: _, ...tool }) => tool);

export function toolPage(slug: string): Tool | undefined {
	return pages.find((t) => t.slug === slug);
}
