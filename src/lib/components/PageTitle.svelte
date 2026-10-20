<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let { title, tagline, issues }: { title: string; tagline?: string; issues?: string } =
		$props();
</script>

<svelte:head>
	<title>{title === 'Home' ? 'The ICPC Tools' : `${title} | The ICPC Tools`}</title>
	{#if tagline}<meta name="description" content={tagline} />{/if}
</svelte:head>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<h1 class="text-3xl font-light">{title}</h1>
	{#if issues}
		<Button href={issues} icon="fab fa-github" variant="secondary">Issues</Button>
	{/if}
</div>
