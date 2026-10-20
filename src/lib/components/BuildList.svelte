<script lang="ts">
	import { downloadUrl, formatDate, npmUrl, readmeUrl, releaseUrl } from '$lib/releases';
	import type { Tool, Release } from '$lib/types';

	let { tool, builds }: { tool: Tool; builds: Release[] } = $props();

	let repo = $derived(tool.repo);
</script>

{#if builds.length}
	<div
		class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
				<tr>
					<th class="px-4 py-2 font-medium">Version</th>
					<th class="px-4 py-2 font-medium">Date</th>
					<th class="px-4 py-2 font-medium">Downloads</th>
					<th class="px-4 py-2"></th>
				</tr>
			</thead>
			<tbody>
				{#each builds as build (build.tag)}
					<tr class="border-t border-gray-100 align-top first:border-t-0 dark:border-gray-700">
						<td class="px-4 py-1.5 whitespace-nowrap">
							<span class="font-medium">v{build.version}</span>
							{#if build.prerelease}
								<span
									class="ml-1 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200"
									>Pre-release</span
								>
							{:else}
								<span
									class="ml-1 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
									>Release</span
								>
							{/if}
						</td>
						<td class="px-4 py-1.5 whitespace-nowrap">
							{formatDate(build.created)}
						</td>
						<td class="px-4 py-1.5">
							{#each build.downloads as d (d.file)}
								<div>
									{#if d.name}<span class="text-gray-500">{d.name}:</span>{/if}
									<a href={downloadUrl(repo, build, d.file)}>{d.file}</a>
									<span class="text-gray-500">
										{d.size} MB{#each d.checks as check (check)}, <a
												href={downloadUrl(repo, build, `${d.file}.${check}`)}>{check}</a
											>{/each}
									</span>
								</div>
							{/each}
							{#if build.image}
								<div><span class="text-gray-500">Container image:</span> <code>{build.image}</code></div>
							{/if}
							{#each build.npm as pkg (pkg)}
								<div>
									<span class="text-gray-500">npm package:</span>
									<a href={npmUrl(pkg)}><code>{pkg}</code></a>
								</div>
							{/each}
						</td>
						<td class="px-4 py-1.5 text-right whitespace-nowrap">
							<a href={readmeUrl(tool, build)}>README</a> &middot;
							<a href={releaseUrl(repo, build)}>GitHub release</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="text-gray-500">No builds available.</p>
{/if}
