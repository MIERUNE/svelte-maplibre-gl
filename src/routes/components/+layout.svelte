<script lang="ts">
	import Index from '$lib/components/Index.svelte';
	import { toc } from '$content/components/toc';

	let { children } = $props();
</script>

<div class="mx-auto grid grid-cols-[210px_minmax(0,1fr)] gap-4 px-8 xl:container">
	<aside class="sticky bottom-0 top-16 h-[calc(100vh-4rem)] overflow-scroll py-8">
		<Index name="Components" {toc} />
	</aside>
	<main class="grid-cols-[1fr_210px]">
		{@render children()}
	</main>
</div>
