<script lang="ts">
	import type { Prop, Types } from 'svelte-docgen/doc';
	const { name, prop, types }: { name: string; prop: Prop; types: Types } = $props();
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatType } from './utils.js';
</script>

<Table.Row>
	<Table.Cell>
		<code class="font-bold">{name}</code>
		<div class="text-xs">
			{#if prop.isOptional}
				<span class="text-muted-foreground">optional</span>
			{:else}
				<span class="text-red-400">required</span>
			{/if}
		</div>
	</Table.Cell>
	<Table.Cell class="text-sm text-muted-foreground">
		{formatType(prop.type, types)}
	</Table.Cell>
	<Table.Cell class="text-sm text-muted-foreground">
		{#if prop.description}
			{prop.description}
		{:else}
			-
		{/if}
	</Table.Cell>
</Table.Row>
