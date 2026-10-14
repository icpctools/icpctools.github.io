import { error } from '@sveltejs/kit';
import { tools, toolBySlug } from '$lib/tools';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => tools.map((t) => ({ tool: t.slug }));

export const load: PageLoad = ({ params }) => {
	const tool = toolBySlug(params.tool);
	if (!tool) error(404, 'Not found');
	return { tool };
};
