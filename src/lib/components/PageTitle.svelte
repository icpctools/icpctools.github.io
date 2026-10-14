<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<svelte:head>
	<title>{title === 'Home' ? 'The ICPC Tools' : `${title} | The ICPC Tools`}</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<h1 class="mb-4 text-3xl font-light">{title}</h1>
