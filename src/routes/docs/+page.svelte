<script lang="ts">
	import Index from '$lib/components/Index.svelte';

	import { toc } from '$content/docs/toc.js';
</script>

<div id="toc" class="m-auto p-8 py-10 xl:container">
	<Index name="Docs" {toc} />
</div>
