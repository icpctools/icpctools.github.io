import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			// Serve colocated screenshots directly instead of falling through SvelteKit's 404 handler.
			allow: ['./tools']
		}
	}
});
