<script lang="ts">
	import BuildList from '$lib/components/BuildList.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import ToolRelease from '$lib/components/ToolRelease.svelte';
	import { issuesUrl, readmeUrl } from '$lib/releases';

	let { data } = $props();

	let tool = $derived(data.tool);
	let latest = $derived(data.latest[tool.slug]);
</script>

<PageTitle title={tool.name} description={tool.description} issues={issuesUrl(tool.repo)} />

<div class="prose max-w-none dark:prose-invert">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static content from tools.ts -->
	{@html tool.body}

	<h2>Download</h2>
	{#if latest.release}
		<ToolRelease {tool} release={latest.release} />
	{/if}
	{#if latest.prerelease}
		<ToolRelease {tool} release={latest.prerelease} />
	{/if}

	{#if !latest.release && !latest.prerelease}
		<p>Documentation: <a href={readmeUrl(tool)}>README</a></p>
	{/if}

	<h2 id="builds">All builds</h2>
</div>

<BuildList {tool} builds={data.builds} />
