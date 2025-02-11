<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import '$lib/assets/fonts/geist.css';
	import Header from './Header.svelte';
	import GlobalToc from './GlobalToc.svelte';
	import ViewTransition from './ViewTransition.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	let globalTocOpen = $state(false);

	let canonicalUrl = $derived.by(() => {
		const url = page.url;
		url.protocol = 'https:';
		url.hostname = 'svelte-maplibre-gl.mierune.dev';
		url.port = '';
		return url.toString();
	});

	let currentYear = new Date().getFullYear();
</script>

<ModeWatcher />
<ViewTransition />

<header class="bg-opacity-85 sticky top-0 z-40 border-b bg-background backdrop-blur-sm">
	<div class="mx-auto px-4 md:px-8 xl:container">
		<Header bind:globalTocOpen />
	</div>
</header>
<div id="content">
	{@render children()}
</div>

<footer class="font-zinc-500 border-t p-6 px-4 text-sm">
	<div class="xl:container">
		<p>&copy; {currentYear} Svelte Maplibre GL contributors</p>
	</div>
</footer>

<GlobalToc bind:open={globalTocOpen} />

<svelte:head>
	<title>Svelte MapLibre GL</title>
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>
