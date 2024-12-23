<script lang="ts">
	import Index from '$lib/components/Index.svelte';

	import { toc } from '$content/docs/toc.js';
</script>

<div id="toc" class="m-auto p-8 xl:container">
	<Index name="Docs" {toc} />
</div>

<style>
	#toc {
		view-transition-name: toc;
	}
</style>
