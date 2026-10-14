import { buildsPage } from '$lib/server/builds';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => buildsPage('icpctools', 1);
