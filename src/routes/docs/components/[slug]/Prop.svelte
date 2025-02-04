<script lang="ts">
	import type { Prop, Types } from 'svelte-docgen/doc';
	const { name, prop, types }: { name: string; prop: Prop; types: Types } = $props();
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatType, formatDescription } from './utils.js';
</script>

<Table.Row>
	<Table.Cell class="">
		<code class="font-bold break-all">{name}</code>
		<div class="text-xs font-semibold">
			{#if prop.isOptional}
				<span class="text-muted-foreground">optional</span>
			{:else}
				<span class="text-red-400">required</span>
			{/if}
			{#if prop.isBindable}
				<span class="text-[#246bd5]">bindable</span>
			{/if}
		</div>
	</Table.Cell>
	<Table.Cell class="text-sm">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<pre class="whitespace-pre-wrap">{@html formatType(prop.type, types)}</pre>
	</Table.Cell>
	<Table.Cell>
		<div class="text-sm text-muted-foreground">
			{#if prop.description}
				{formatDescription(prop.description)}
			{:else}
				-
			{/if}
		</div>
		{#if !prop.isBindable && prop.default && typeof prop.default !== 'string' && prop.default.kind !== 'undefined'}
			<div class="mt-1 text-xs">
				<span class="font-semibold">default:</span>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html formatType(prop.default, types)}
			</div>
		{/if}
	</Table.Cell>
</Table.Row>

<style>
	pre :global(a) {
		text-decoration: underline !important;
	}
</style>
