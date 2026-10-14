import { error } from '@sveltejs/kit';
import { buildsPage, pageCount } from '$lib/server/builds';
import type { EntryGenerator, PageServerLoad } from './$types';

// Page 1 is served from /all-builds
export const entries: EntryGenerator = () =>
	Array.from({ length: pageCount('icpctools') - 1 }, (_, i) => ({ page: String(i + 2) }));

export const load: PageServerLoad = ({ params }) => {
	const page = Number(params.page);
	if (page < 2 || page > pageCount('icpctools')) error(404, 'Not found');
	return buildsPage('icpctools', page);
};
