<script lang="ts">
	import type { Prop } from 'svelte-docgen/doc';
	const { name, prop }: { name: string; prop: Prop } = $props();
	import SuperJSON from 'superjson';
</script>

<div class="mb-8">
	<h3 class="text-lg font-semibold">
		{name}
		{#if prop.isOptional}
			<sup class="text-muted-foreground">optional</sup>
		{:else}
			<sup class="text-red-400">required</sup>
		{/if}
	</h3>
	<p class="text-sm text-muted-foreground">{prop.description}</p>
	<div class="mt-2">
		{#if prop.type}
			<div class="flex items-center space-x-2">
				<span class="text-sm font-semibold">Type:</span>
				<pre class="text-xs">{SuperJSON.stringify(prop.type)}</pre>
			</div>
		{/if}
	</div>
</div>
