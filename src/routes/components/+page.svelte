<script lang="ts">
	import Index from '$lib/components/Index.svelte';

	import { toc } from '$content/components/toc.js';
</script>

<div id="toc" class="m-auto p-8 xl:container">
	<Index name="Components" {toc} />
</div>

<style>
	#toc {
		view-transition-name: toc;
	}
</style>
