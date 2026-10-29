import { error } from '@sveltejs/kit';
import { releases } from '#lib/server/data.js';
import { toolPage, tools } from '#lib/server/tools.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => tools.map((t) => ({ tool: t.slug }));

export const load: PageServerLoad = ({ params }) => {
	const tool = toolPage(params.tool);
	if (!tool) error(404, 'Not found');
	return { tool, builds: releases(tool.slug) };
};
