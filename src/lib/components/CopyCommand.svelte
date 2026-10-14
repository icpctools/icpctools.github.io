<script lang="ts">
	let { command }: { command: string } = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div
	class="flex items-center gap-2 rounded bg-gray-900 py-1 pr-1 pl-3 font-mono text-sm text-gray-100 dark:bg-black"
>
	<code class="flex-1 overflow-x-auto whitespace-nowrap">{command}</code>
	<button
		class="rounded px-2 py-1 text-gray-400 hover:bg-gray-700 hover:text-white"
		aria-label="Copy command"
		onclick={copy}
	>
		<i class={copied ? 'fas fa-check' : 'far fa-copy'}></i>
	</button>
</div>
