import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Fully static output - every page is prerendered at build time, no server required
		adapter: adapter({ fallback: '404.html' }),
		// Absolute paths, so `base` can be compared against the current URL when prerendering
		paths: { base: process.env.BASE_PATH ?? '', relative: false }
	}
};

export default config;
