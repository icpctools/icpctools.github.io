<script lang="ts">
	import { base } from '$app/paths';
	import { BUILD_TOOLS, downloadUrl, formatDate, formatTime, npmUrl, releaseUrl } from '$lib/releases';
	import type { Release, Repo } from '$lib/types';

	let {
		repo,
		builds,
		page,
		pageCount,
		total
	}: { repo: Repo; builds: Release[]; page: number; pageCount: number; total: number } = $props();

	let root = $derived(repo === 'icpctools' ? `${base}/all-builds` : `${base}/all-builds/${repo}`);
	const href = (p: number) => (p === 1 ? root : `${root}/${p}`);

	// First, last, and a window around the current page, with gaps marked by null
	let pages = $derived.by(() => {
		const result: (number | null)[] = [];
		for (let p = 1; p <= pageCount; p++) {
			if (p === 1 || p === pageCount || Math.abs(p - page) <= 2) result.push(p);
			else if (result.at(-1) !== null) result.push(null);
		}
		return result;
	});
</script>

{#snippet pagination()}
	{#if pageCount > 1}
	<nav class="my-4 flex flex-wrap items-center gap-1 text-sm" aria-label="Pagination">
		{#each pages as p, i (p ?? `gap${i}`)}
			{#if p === null}
				<span class="px-2 text-gray-400">&hellip;</span>
			{:else}
				<a
					href={href(p)}
					aria-current={p === page ? 'page' : undefined}
					class="min-w-9 rounded border px-2 py-1 text-center hover:no-underline {p === page
						? 'border-sky-700 bg-sky-700 !text-white'
						: 'border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'}"
				>
					{p}
				</a>
			{/if}
		{/each}
	</nav>
	{/if}
{/snippet}

{@render pagination()}

<div class="space-y-6">
	{#each builds as build (build.tag)}
		<section
			class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<header
				class="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-gray-200 bg-gray-100 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-700"
			>
				<span class="text-base font-medium">
					v{build.version}
					{#if build.prerelease}
						<span
							class="ml-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-normal text-amber-800 dark:bg-amber-900 dark:text-amber-200"
							>Latest build</span
						>
					{:else}
						<span
							class="ml-1 rounded bg-green-100 px-2 py-0.5 text-xs font-normal text-green-800 dark:bg-green-900 dark:text-green-200"
							>Release</span
						>
					{/if}
				</span>
				<span>{formatDate(build.created)} at {formatTime(build.created)}</span>
				<a href={releaseUrl(repo, build)} class="ml-auto">GitHub release</a>
			</header>
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<tbody>
						{#each BUILD_TOOLS[repo].filter((t) => build.downloads[t.tool]?.file) as { tool, name } (tool)}
							{@const d = build.downloads[tool]}
							<tr class="border-t border-gray-100 first:border-t-0 dark:border-gray-700">
								<th class="w-52 px-4 py-1.5 font-medium">{name}</th>
								<td class="w-28 px-4 py-1.5 text-right whitespace-nowrap tabular-nums">{d.size} MB</td>
								<td class="px-4 py-1.5">
									<a href={downloadUrl(repo, build, d.file)}>{d.file}</a>
									{#if d.checks.length}
										<span class="text-gray-500">
											({#each d.checks as check, i (check)}{i > 0 ? ', ' : ''}<a
													href={downloadUrl(repo, build, `${d.file}.${check}`)}>{check}</a
												>{/each})
										</span>
									{/if}
								</td>
							</tr>
						{/each}
						{#each Object.values(build.images) as image (image)}
							<tr class="border-t border-gray-100 first:border-t-0 dark:border-gray-700">
								<th class="w-52 px-4 py-1.5 font-medium">Container image</th>
								<td class="w-28 px-4 py-1.5"></td>
								<td class="px-4 py-1.5"><code>{image}</code></td>
							</tr>
						{/each}
						{#each Object.values(build.npm).flat() as pkg (pkg)}
							<tr class="border-t border-gray-100 first:border-t-0 dark:border-gray-700">
								<th class="w-52 px-4 py-1.5 font-medium">npm package</th>
								<td class="w-28 px-4 py-1.5"></td>
								<td class="px-4 py-1.5"><a href={npmUrl(pkg)}><code>{pkg}</code></a></td>
							</tr>
						{/each}
						{#if !BUILD_TOOLS[repo].some((t) => build.downloads[t.tool]?.file) && !Object.keys(build.images).length && !Object.keys(build.npm).length}
							<tr><td class="px-4 py-1.5 text-gray-500">No downloads attached to this release</td></tr>
						{/if}
					</tbody>
				</table>
			</div>
		</section>
	{/each}
</div>

{@render pagination()}
