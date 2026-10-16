<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CopyCommand from '$lib/components/CopyCommand.svelte';
	import { downloadUrl, formatDate, npmUrl, pkgName, readmeUrl, releaseUrl } from '$lib/releases';
	import type { Tool } from '$lib/tools';
	import type { Release } from '$lib/types';

	let { tool, release }: { tool: Tool; release: Release } = $props();

	let repo = $derived(tool.repo);

	let download = $derived(release.downloads[0]);
	let npm = $derived(release.npm);
</script>

<p class="not-prose">
	{#if download}
		<Button
			href={downloadUrl(repo, release, download.file)}
			icon="fas fa-download"
			variant={release.prerelease ? 'danger' : 'primary'}
		>
			Download {release.prerelease ? 'pre-release' : 'release'} v{release.version}
		</Button> {formatDate(release.created)}
	{:else}
		<!-- Release has no download for this tool -->
		<Button
			href={releaseUrl(repo, release)}
			icon="fab fa-github"
			variant={release.prerelease ? 'danger' : 'primary'}
		>
			View {release.prerelease ? 'pre-release' : 'release'} v{release.version}
		</Button> {formatDate(release.created)}
	{/if}
	&middot; <a href={readmeUrl(tool, release)}>README</a>
</p>
{#if release.image}
	<p>{download ? 'Or pull' : 'Pull'} the container image:</p>
	<div class="not-prose mb-4"><CopyCommand command="podman/docker pull {release.image}" /></div>
{/if}
{#if npm.length}
	<p>
		Install via npm
		{#each npm as pkg, i (pkg)}{i > 0 ? (i === npm.length - 1 ? ' and ' : ', ') : ''}<a
				href={npmUrl(pkg)}>{pkgName(pkg)}</a
			>{/each}:
	</p>
	<div class="not-prose mb-4 space-y-2">
		{#each npm as pkg (pkg)}
			<CopyCommand command="npm install {pkg}" />
		{/each}
	</div>
{/if}
