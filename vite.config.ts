import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const pages = 'build';
const staticAdapter = adapter({ pages, fallback: '404.html' });

// Pages are written as e.g. cds.html and served at /cds. GitHub Pages looks for cds/index.html for
// /cds/ (the URLs the old site used), so write a stub there that redirects to the canonical URL.
function redirectStub(target) {
	const url = JSON.stringify(target);

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href=${url}>
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${url} + location.search + location.hash)</script>
</head>
<body><a href=${url}>${target}</a></body>
</html>
`;
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			// Fully static output - every page is prerendered at build time, no server required
			adapter: {
				...staticAdapter,
				async adapt(builder) {
					await staticAdapter.adapt(builder);

					const base = builder.config.paths.base;

					const targets = [
						...[...builder.prerendered.pages.keys()].map((path) => [path, path]),
						...[...builder.prerendered.redirects].map(([path, { location }]) => [path, location])
					];

					for (const [path, target] of targets) {
						const page = path.slice(base.length);

						if (page === '' || page === '/') continue;

						const dir = join(pages, page);

						mkdirSync(dir, { recursive: true });
						writeFileSync(join(dir, 'index.html'), redirectStub(target));
					}
				}
			},
			// Absolute paths, so `base` can be compared against the current URL when prerendering
			paths: { base: process.env.BASE_PATH ?? '', relative: false }
		})
	],
	server: {
		fs: {
			// Serve colocated screenshots directly instead of falling through SvelteKit's 404 handler.
			allow: ['./tools']
		}
	}
});
