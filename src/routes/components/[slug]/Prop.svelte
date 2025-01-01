<script lang="ts">
	import type { Prop, Types } from 'svelte-docgen/doc';
	const { name, prop, types }: { name: string; prop: Prop; types: Types } = $props();
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatType } from './utils.js';
</script>

<Table.Row>
	<Table.Cell>
		<code class="break-all font-bold">{name}</code>
		<div class="mt-0.5 text-xs font-semibold">
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
		{@html formatType(prop.type, types)}
	</Table.Cell>
	<Table.Cell>
		<div class="text-sm text-muted-foreground">
			{#if prop.description}
				{prop.description}
			{:else}
				-
			{/if}
		</div>
		{#if !prop.isBindable && prop.default && typeof prop.default !== 'string' && prop.default.kind !== 'undefined'}
			<div class="mt-1 text-xs">
				<span class="font-semibold">default:</span>
				{@html formatType(prop.default, types)}
			</div>
		{/if}
	</Table.Cell>
</Table.Row>
