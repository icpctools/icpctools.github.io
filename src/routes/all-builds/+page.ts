import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { PageLoad } from './$types';

// Builds are now listed on each tool's page
export const load: PageLoad = () => redirect(307, `${base}/`);
