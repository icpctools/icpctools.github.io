<script lang="ts">
	import { base } from '$app/paths';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { downloadUrl, readmeUrl, releaseUrl } from '$lib/releases';
	import type { Release } from '$lib/types';

	let { data } = $props();
</script>

{#snippet version(repo: string, release?: Release)}
	{#if release}
		{@const d = release.downloads[0]}
		<dt class="text-gray-500">{release.prerelease ? 'Pre-release' : 'Release'}</dt>
		<dd>
			<a href={d ? downloadUrl(repo, release, d.file) : releaseUrl(repo, release)}
				>v{release.version}</a
			>
		</dd>
	{/if}
{/snippet}

<PageTitle
	title="Home"
	tagline="The ICPC Tools for use at the ICPC World Finals and other programming contests"
/>

<div class="prose max-w-none dark:prose-invert">
	<img src="{base}/img/logo-full.png" alt="ICPC Tools logo" class="float-right ml-4 hidden w-64 sm:block" />

	<p>
		Welcome to the ICPC Tools! This page contains tools from the
		International Collegiate Programming Contest (ICPC) Tools Group, most of which were originally
		developed for use at the ICPC World Finals and associated local and regional contests.
		These tools have been used to support a wide variety of programming contests including
		local contests at Universities world-wide, multiple ICPC Regional Contests around the world, and
		many ICPC World Finals.
	</p>
	<p>
		All of the ICPC tools are designed to work together, and where applicable they are based on
		published ICPC standards. Most of the tools use the Contest API
		published by the <em>Competitive Learning Initiative</em> at
		the <a href="https://ccs-specs.icpc.io/">CLI Specification Website</a>.
	</p>

	<h2>The Tools</h2>
	<p>
		Follow the links below to download any of the tools.
	</p>
</div>

<div class="my-6 grid gap-4 md:grid-cols-2">
	{#each data.tools as tool (tool.slug)}
		<div
			class="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<h3 class="mb-2 flex items-center gap-2 text-xl font-medium">
				<i class="{tool.icon} text-sky-700 dark:text-sky-400"></i>
				{tool.name}
			</h3>
			<p class="mb-3 text-gray-600 dark:text-gray-400">{tool.tagline}</p>
			<dl class="mb-3 grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1 text-sm">
				{@render version(tool.repo, data.latest[tool.slug].release)} <a href={readmeUrl(tool, data.latest[tool.slug].release)}
						>README</a
					>
				{@render version(tool.repo, data.latest[tool.slug].prerelease)} <a href={readmeUrl(tool, data.latest[tool.slug].prerelease)}
						>README</a
					>
			</dl>
			<a href="{base}/{tool.slug}" class="mt-auto">More information &rarr;</a>
		</div>
	{/each}
</div>

<div class="prose max-w-none dark:prose-invert">
	<h2>Disclaimer</h2>
	<p>
		The tools on this page are provided free and "as is", with the usual disclaimers: lack of
		guarantee of suitability for any particular purpose, no stated or implied responsibility for the
		results of their use, etc.
	</p>
	<p>
		In other words, we find these tools to be very useful in supporting a variety of common
		programming contest operations, and we think you will too; but we do not guarantee that they will
		do exactly what you want for <em>your</em> programming contest. All of the code has been written by
		and is directly under the control of the ICPC Systems Group, including that we take particular care
		to insure that there are no intentional bad things (malware) in them; however, neither ICPC nor its
		affiliates or volunteers make any guarantees at all regarding the code.
	</p>

	<h2>Contributing</h2>
	<p>
		The ICPC Tools are developed, tested, and maintained by a group of ICPC volunteers on
		<a href="https://github.com/icpctools">GitHub</a>. Bug reports, feature requests, and even just
		knowing what worked or didn't for your contest are always appreciated. Pull requests are also
		welcome, but if you want to implement a big feature it might be best to first create an issue to
		discuss it.
	</p>
	<p>
		To become a committer you must have a history of high quality bug reports, PRs, and be approved by
		the ICPC Tools team.
	</p>

	<h2>Community</h2>
	<p>
		We have a slack workspace to discuss anything and everything ICPC Tools related:
		<a href="https://icpctools.slack.com/">https://icpctools.slack.com/</a>. To join, sign up
		<a href="https://join.slack.com/t/icpctools/shared_invite/zt-wti6k1r6-t25~VYEcyKbVn4Vj_ecBLA"
			>here</a
		>!
	</p>

	<h2>License</h2>
	<p>
		All of the tools are provided under the
		<a href="https://github.com/icpctools/icpctools/blob/main/LICENSE">ICPC Software License</a> license
		(Team View is provided under the <a href="https://github.com/icpctools/team-view/blob/main/LICENSE"
			>MIT license</a
		>) and are "Free as in Beer". We welcome you to use and enjoy them, but if you ever run into anyone who
		has contributed to them - Tim, John, Nicky, Sam, Troy, etc. we would greatly appreciate it if you'd
		buy us a beer, a stroopwafel, or some other suitable token!
	</p>
</div>
