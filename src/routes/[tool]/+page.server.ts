import { error } from '@sveltejs/kit';
import { releases } from '$lib/server/data';
import { tools, toolBySlug } from '$lib/tools';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => tools.map((t) => ({ tool: t.slug }));

export const load: PageServerLoad = ({ params }) => {
	const tool = toolBySlug(params.tool);
	if (!tool) error(404, 'Not found');
	return { tool, builds: releases(tool.slug) };
};
