<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import PageTitle from '$lib/components/PageTitle.svelte';

	let { children } = $props();

	let teamView = $derived(page.url.pathname.startsWith(`${base}/all-builds/team-view`));
	const tab = 'border-b-2 px-4 py-2 font-medium hover:no-underline';
	const activeTab = 'border-sky-700 text-sky-700 dark:border-sky-400 dark:text-sky-400';
	const inactiveTab = 'border-transparent !text-gray-500 hover:!text-gray-800 dark:hover:!text-gray-200';
</script>

<PageTitle title="All builds" description="Download any ICPC Tools build" />

<nav class="mb-6 flex border-b border-gray-200 dark:border-gray-700">
	<a href="{base}/all-builds" class="{tab} {teamView ? inactiveTab : activeTab}">ICPC Tools</a>
	<a href="{base}/all-builds/team-view" class="{tab} {teamView ? activeTab : inactiveTab}">Team View</a>
</nav>

{@render children()}
