<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import '$lib/assets/fonts/geist.css';
	import Header from './Header.svelte';
	import ViewTransition from './ViewTransition.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<ViewTransition />

<header class="sticky top-0 z-50 border-b bg-background bg-opacity-85 backdrop-blur">
	<div class="mx-auto px-8 2xl:container">
		<Header />
	</div>
</header>
<div>
	{@render children()}
</div>

<svelte:head>
	<title>Svelte MapLibre GL</title>
</svelte:head>

<style>
	header {
		view-transition-name: header;
	}
</style>
