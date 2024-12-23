<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import '$lib/assets/fonts/geist.css';
	import Header from './Header.svelte';
	import GlobalToc from './GlobalToc.svelte';
	import ViewTransition from './ViewTransition.svelte';

	let { children } = $props();

	let globalTocOpen = $state(false);
</script>

<ModeWatcher />
<ViewTransition />

<header class="sticky top-0 z-40 border-b bg-background bg-opacity-85 backdrop-blur">
	<div class="mx-auto px-4 xl:container md:px-8">
		<Header bind:globalTocOpen />
	</div>
</header>
<div id="content">
	{@render children()}
</div>

<footer class="font-zinc-500 border-t p-6 px-4 text-sm">
	<div class="xl:container">
		<p>&copy; 2024 Svelte Maplibre GL contributors</p>
	</div>
</footer>

<GlobalToc bind:open={globalTocOpen} />

<svelte:head>
	<title>Svelte MapLibre GL</title>
</svelte:head>

<style>
	header {
		view-transition-name: header;
	}

	#content {
		view-transition-name: content;
	}
</style>
