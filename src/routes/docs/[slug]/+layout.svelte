<script lang="ts">
	import Index from '$lib/components/Index.svelte';
	import { toc } from '$content/docs/toc';

	let { children } = $props();
</script>

<div class="mx-auto grid gap-4 px-4 xl:container md:grid-cols-[210px_minmax(0,1fr)] md:px-8">
	<aside class="sticky bottom-0 top-16 hidden h-[calc(100vh-4rem)] overflow-scroll py-8 md:block">
		<Index name="Docs" {toc} />
	</aside>
	<main class="grid-cols-[1fr_210px]">
		{@render children()}
	</main>
</div>
