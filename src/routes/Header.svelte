<script lang="ts">
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import MapPinned from '@lucide/svelte/icons/map-pinned';
	import Menu from '@lucide/svelte/icons/menu';
	import GitHub from '$lib/assets/icons/GitHub.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import DarkModeSelector from './DarkModeSelector.svelte';

	import { default as docsearch } from '@docsearch/js';
	import '@docsearch/css/dist/button.css';
	import '@docsearch/css/dist/modal.css';

	let { globalTocOpen = $bindable() } = $props();

	if (browser) {
		try {
			docsearch({
				container: '#docsearch',
				appId: '78TOQ3W600',
				indexName: 'svelte-maplibre-gl',
				apiKey: '096ebe16a7ae7b573fc996e9a08edbc0',
				navigator: {
					navigate({ itemUrl }) {
						const url = new URL(itemUrl);

						// eslint-disable-next-line svelte/no-navigation-without-resolve
						goto(url.pathname + url.search + url.hash);
					}
				}
			});
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div class="flex h-[72px] w-full shrink-0 items-center justify-between leading-none">
	<div class="flex h-full w-full items-center">
		<div class="mr-3 md:hidden">
			<Button
				variant="outline"
				size="icon"
				title="Toggle Menu"
				aria-haspopup="dialog"
				aria-expanded={globalTocOpen}
				aria-label="Toggle Menu"
				onclick={() => (globalTocOpen = !globalTocOpen)}
			>
				<Menu class="size-6!" />
			</Button>
		</div>
		<h1 class="text-lg font-bold md:text-xl">
			<a href={resolve('/')} class="">
				<MapPinned class="mr-1.5 hidden size-6! pb-1 md:inline-block" /><span>Svelte MapLibre GL</span>
			</a>
		</h1>
		<nav class="ml-12 hidden gap-x-6 font-medium min-[640px]:flex">
			<a
				href={resolve('/docs/quickstart')}
				data-active={page.url.pathname.startsWith('/docs') && !page.url.pathname.startsWith('/docs/components')}
				class="text-sm text-foreground/70 transition-colors hover:text-foreground data-[active=true]:font-semibold"
				>Docs
			</a>
			<a
				href={resolve('/examples/plain')}
				data-active={page.url.pathname.startsWith('/examples')}
				class="text-sm text-foreground/70 transition-colors hover:text-foreground data-[active=true]:font-semibold"
				>Examples</a
			>
			<!--
			<a
				href="/docs/components/MapLibre"
				data-active={page.url.pathname.startsWith('/docs/components')}
				class="text-sm text-foreground/70 transition-colors hover:text-foreground data-[active=true]:font-semibold"
				>API Reference</a
			>
			-->
		</nav>
	</div>
	<div class="flex items-center text-xs leading-none">
		<div class="md:mr-2">
			<div id="docsearch"></div>
		</div>
		<Button
			class="-ml-0.5"
			variant="ghost"
			size="icon"
			href="https://github.com/ciscorn/svelte-maplibre-gl"
			target="_blank"
			title="GitHub repository"
		>
			<GitHub class="size-5! md:size-6!" />
		</Button>
		<div class="-mr-1 -ml-1 md:ml-1">
			<DarkModeSelector />
		</div>
	</div>
</div>

<style lang="postcss">
	:global(.DocSearch-Button) {
		margin-left: 0;
	}
	:global(.DocSearch-Form) {
		border-radius: 20px;
	}
</style>
