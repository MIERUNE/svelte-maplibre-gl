<script lang="ts">
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css';
	import '$lib/assets/fonts/geist.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

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
