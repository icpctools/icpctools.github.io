import { fetched, latest } from '$lib/server/data';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({
	latest: { icpctools: latest('icpctools'), 'team-view': latest('team-view') },
	fetched
});
