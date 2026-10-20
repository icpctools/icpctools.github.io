// Parses a tool's Markdown file (tools/<slug>.md). Plain JavaScript so scripts/fetch-data.mjs can use
// it too.
import { parse } from 'yaml';

const REQUIRED = ['name', 'icon', 'tagline', 'repo', 'readme', 'order'];

/**
 * @param {string} path file path, whose name is the tool's slug
 * @param {string} text file contents: YAML frontmatter between --- lines, then the Markdown body
 */
export function parseToolFile(path, text) {
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) throw new Error(`${path}: missing --- frontmatter ---`);
	const meta = parse(match[1]);
	const missing = REQUIRED.filter((f) => meta?.[f] == null);
	if (missing.length) throw new Error(`${path}: missing ${missing.join(', ')}`);
	const slug = path.slice(path.lastIndexOf('/') + 1, -'.md'.length);
	return { ...meta, slug, markdown: match[2] };
}
