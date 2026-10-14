import type { Repo } from '$lib/types';
import { releases } from './data';

const PAGE_SIZE = 20;

export function pageCount(repo: Repo) {
	return Math.max(1, Math.ceil(releases[repo].length / PAGE_SIZE));
}

export function buildsPage(repo: Repo, page: number) {
	return {
		repo,
		builds: releases[repo].slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
		page,
		pageCount: pageCount(repo),
		total: releases[repo].length
	};
}
