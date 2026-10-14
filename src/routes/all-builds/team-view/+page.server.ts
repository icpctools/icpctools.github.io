import { releases } from '$lib/server/data';
import type { PageServerLoad } from './$types';

// Team view has few enough releases to show them all on one page
export const load: PageServerLoad = () => ({
	repo: 'team-view' as const,
	builds: releases['team-view'],
	page: 1,
	pageCount: 1,
	total: releases['team-view'].length
});
