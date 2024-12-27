<script lang="ts">
	import Index from '$lib/components/Index.svelte';

	import { toc } from '$content/examples/toc.js';
</script>

<div id="toc" class="m-auto p-8 xl:container">
	<Index name="Examples" {toc} />
</div>
