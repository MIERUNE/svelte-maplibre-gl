<script lang="ts">
	import Index from '$lib/components/Index.svelte';
	import { toc } from '$content/examples/toc';

	let { children } = $props();
</script>

<div class="mx-auto grid gap-4 px-4 md:grid-cols-[210px_minmax(0,1fr)] md:px-8 xl:container">
	<aside class="sticky top-[4.5rem] bottom-0 hidden h-[calc(100vh-4rem)] overflow-scroll py-10 md:block">
		<Index name="Examples" {toc} />
	</aside>
	<main class="grid-cols-[1fr_210px]">
		{@render children()}
	</main>
</div>
