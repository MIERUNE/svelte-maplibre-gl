<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import Prop from './Prop.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	const { data } = $props();

	const requiredProps = $derived(new Map(data.doc.props.entries().filter(([, prop]) => !prop.isOptional)));
	const optionalProps = $derived(new Map(data.doc.props.entries().filter(([, prop]) => prop.isOptional)));
</script>

<div class="grid gap-x-8 lg:grid-cols-[1fr_160px]">
	<div class="min-h-[calc(100vh-4rem)] w-full min-w-0 py-10">
		<Breadcrumb.Root class="mb-4">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/docs/components/">API Reference</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{data.title}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<h1 class="mb-2 text-4xl font-bold">{data.title}</h1>

		<p class="mb-6 text-muted-foreground">API Reference (beta) for <code>{`<${data.targetComponent} />`}</code></p>

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="min-w-[120px] max-w-[25%]">Property</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Description</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each requiredProps as [name, prop]}
					{#if !prop.isOptional}
						<Prop {name} {prop} types={data.doc.types} />
					{/if}
				{/each}

				{#each optionalProps as [name, prop]}
					{#if prop.isOptional}
						<Prop {name} {prop} types={data.doc.types} />
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<aside class="sticky top-28 hidden h-[calc(100vh-7rem)] lg:block">
		<div class="font-medium">On This Page</div>
	</aside>
</div>

<svelte:head>
	<title>{data.title} - Svelte MapLibre GL</title>
	<meta name="description" content={`API Reference (beta) for ${data.targetComponent} component`} />
</svelte:head>
