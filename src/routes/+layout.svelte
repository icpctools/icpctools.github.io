<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { formatDate, formatTime } from '$lib/releases';
	import { tools } from '$lib/tools';

	let { data, children } = $props();

	const nav = [
		{ href: '/', name: 'Home', icon: 'fas fa-home' },
		...tools.map((t) => ({ href: `/${t.slug}`, name: t.name, icon: t.icon }))
	];

	let menuOpen = $state(false);
	let dark = $state(false);

	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch {
			// storage unavailable - the choice just won't persist
		}
	}

	function active(href: string) {
		const path = page.url.pathname.slice(base.length) || '/';
		return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
	}
</script>

<div class="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
	<aside
		class="fixed inset-y-0 left-0 z-30 w-64 -translate-x-full overflow-y-auto bg-slate-800 text-slate-300 transition-transform lg:translate-x-0"
		class:translate-x-0={menuOpen}
	>
		<a
			href="{base}/"
			class="flex items-center gap-3 border-b border-slate-700 px-4 py-3 text-lg font-light text-white hover:no-underline"
		>
			<img src="{base}/img/logo.png" alt="" class="h-8 w-8" />
			The ICPC Tools
		</a>
		<nav class="p-2">
			{#each nav as item (item.href)}
				<a
					href="{base}{item.href}"
					onclick={() => (menuOpen = false)}
					class="flex items-center gap-3 rounded px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white hover:no-underline dark:text-slate-300"
					class:!bg-sky-700={active(item.href)}
					class:!text-white={active(item.href)}
				>
					<i class="{item.icon} w-5 text-center"></i>
					{item.name}
				</a>
			{/each}
		</nav>
	</aside>

	{#if menuOpen}
		<button
			class="fixed inset-0 z-20 bg-black/40 lg:hidden"
			aria-label="Close menu"
			onclick={() => (menuOpen = false)}
		></button>
	{/if}

	<div class="flex min-h-screen flex-col lg:ml-64">
		<header
			class="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
		>
			<button
				class="rounded p-2 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-700"
				aria-label="Open menu"
				onclick={() => (menuOpen = true)}
			>
				<i class="fas fa-bars"></i>
			</button>
			<div class="flex-1"></div>
			<a
				href="https://join.slack.com/t/icpctools/shared_invite/zt-wti6k1r6-t25~VYEcyKbVn4Vj_ecBLA"
				class="rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
				aria-label="Slack"
				title="Join us on Slack"
			>
				<i class="fab fa-slack"></i>
			</a>
			<button
				class="rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
				aria-label="Toggle dark mode"
				onclick={toggleTheme}
			>
				<i class={dark ? 'fas fa-sun' : 'fas fa-moon'}></i>
			</button>
		</header>

		<main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
			{@render children()}
		</main>

		<footer
			class="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-gray-200 bg-white px-6 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
		>
			<span>All ICPC Tools are Copyright &copy; by the ICPC.</span>
			<span>
				Data updated {formatDate(data.fetched)} at {formatTime(data.fetched)} UTC.
			</span>
		</footer>
	</div>
</div>
