<script lang="ts">
	import Index from '$content/components/Index.svelte';

	let { children } = $props();
</script>

<div class="mx-auto grid grid-cols-[200px_minmax(0,1fr)] gap-10 px-8 2xl:container">
	<aside class="sticky bottom-0 top-16 h-[calc(100vh-4rem)] overflow-scroll py-8">
		<Index />
	</aside>
	<main class="grid-cols-[1fr_200px]">
		{@render children()}
	</main>
</div>
