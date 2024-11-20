<script lang="ts">
	import Index from '$content/examples/Index.svelte';

	let { children } = $props();
</script>

<div class="mx-auto grid grid-cols-[220px_minmax(0,1fr)] gap-10 px-8 2xl:container">
	<aside class="sticky bottom-0 top-16 h-[calc(100vh-4rem)] py-8">
		<nav>
			<Index />
		</nav>
	</aside>
	<main class="grid-cols-[1fr_220px]">
		{@render children()}
	</main>
</div>
