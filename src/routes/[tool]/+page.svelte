<script lang="ts">
	import { base } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import ToolRelease from '$lib/components/ToolRelease.svelte';
	import { fileUrl } from '$lib/releases';

	let { data } = $props();

	let tool = $derived(data.tool);
	let latest = $derived(data.latest[tool.repo]);
	let buildsHref = $derived(
		tool.repo === 'icpctools' ? `${base}/all-builds` : `${base}/all-builds/${tool.repo}`
	);
</script>

<PageTitle title={tool.name} description={tool.description} />

<div class="prose max-w-none dark:prose-invert">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static content from tools.ts -->
	{@html tool.body}

	<h2>Download</h2>
	{#if latest.stable}
		<ToolRelease repo={tool.repo} toolname={tool.toolname} name={tool.name} release={latest.stable} />
	{/if}
	{#if latest.prerelease}
		<ToolRelease
			repo={tool.repo}
			toolname={tool.toolname}
			name={tool.name}
			release={latest.prerelease}
			prerelease
		/>
	{/if}

	<p>Documentation: <a href={fileUrl(tool.repo, tool.readme)}>README</a></p>

	<p>Older versions are available on the <a href={buildsHref}>all builds</a> page.</p>
</div>
