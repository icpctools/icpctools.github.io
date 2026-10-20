import { fetched, latest } from '$lib/server/data';
import { tools } from '$lib/server/tools';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({
	latest: Object.fromEntries(tools.map((t) => [t.slug, latest(t.slug)])),
	fetched,
	tools
});
