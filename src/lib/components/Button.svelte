<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		icon,
		variant = 'primary',
		children
	}: {
		href: string;
		icon?: string;
		variant?: 'primary' | 'danger' | 'secondary';
		children: Snippet;
	} = $props();

	const colors = {
		primary: 'bg-sky-700 hover:bg-sky-800',
		danger: 'bg-red-700 hover:bg-red-800',
		secondary: 'bg-gray-600 hover:bg-gray-700'
	};
</script>

<a
	{href}
	class="inline-flex items-center gap-2 rounded px-4 py-2 font-medium !text-white !no-underline shadow-sm {colors[
		variant
	]}"
>
	{#if icon}<i class={icon}></i>{/if}
	{@render children()}
</a>
