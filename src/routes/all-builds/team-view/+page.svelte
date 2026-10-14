<script lang="ts">
	import BuildList from '$lib/components/BuildList.svelte';

	let { data } = $props();
</script>

<BuildList {...data} />
