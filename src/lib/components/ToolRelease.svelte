<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CopyCommand from '$lib/components/CopyCommand.svelte';
	import { downloadUrl, formatDate, formatTime, npmUrl, pkgName, releaseUrl } from '$lib/releases';
	import type { Release, Repo } from '$lib/types';

	let {
		repo,
		toolname,
		name,
		release,
		prerelease = false
	}: { repo: Repo; toolname: string; name: string; release: Release; prerelease?: boolean } =
		$props();

	let download = $derived(release.downloads[toolname]);
	let images = $derived(release.images[toolname]);
	let npm = $derived(release.npm[toolname] ?? []);
	let version = $derived(download?.version ?? release.version);
</script>

<p class="not-prose">
	{#if download?.file}
		<Button
			href={downloadUrl(repo, release, download.file)}
			icon="fas fa-download"
			variant={prerelease ? 'danger' : 'primary'}
		>
			Download {prerelease ? 'latest build' : 'release'} v{version}
		</Button> {formatDate(release.created)} at {formatTime(release.created)}
	{:else}
		<!-- Release has no download for this tool -->
		<Button
			href={releaseUrl(repo, release)}
			icon="fab fa-github"
			variant={prerelease ? 'danger' : 'primary'}
		>
			View {prerelease ? 'latest build' : 'release'} v{version}
		</Button> {formatDate(release.created)} at {formatTime(release.created)}
	{/if}
</p>
{#if images}
	<p>{download?.file ? 'Or pull' : 'Pull'} the container image:</p>
	<div class="not-prose mb-4"><CopyCommand command="podman/docker pull {images}" /></div>
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
