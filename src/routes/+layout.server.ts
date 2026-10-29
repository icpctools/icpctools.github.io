import { fetched, latest } from '#lib/server/data.js';
import { tools } from '#lib/server/tools.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({
	latest: Object.fromEntries(tools.map((t) => [t.slug, latest(t.slug)])),
	fetched,
	tools
});
