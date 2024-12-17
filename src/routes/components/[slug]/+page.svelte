<script lang="ts">
	const { data } = $props();

	// import doc from '$lib/maplibre/markers/Marker.svelte?docgen';
	import doc from './Hoge.svelte?docgen';
	import Hoge from './Hoge.svelte';

	let foo: undefined | string = $state('foo');
</script>

<div class="grid gap-x-8 lg:grid-cols-[1fr_160px]">
	<div class="min-h-[calc(100vh-4rem)] w-full min-w-0 py-8">
		<h1 class="mb-2 text-3xl font-bold">{data.meta.title}</h1>

		<p class="mb-6 text-muted-foreground">
			{data.meta.description}
		</p>

		{#each doc.props as [name, prop]}
			<div class="mb-8">
				<h3 class="text-xl font-semibold">
					{name}
					{#if !prop.isOptional}
						[required]
					{/if}
				</h3>
				<p class="text-muted-foreground">{prop.description}</p>
				<div class="mt-4">
					{#if prop.type}
						<div class="flex items-center space-x-2">
							<span class="text-sm font-semibold">Type:</span>
							<span>{prop.type}</span>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<aside class="sticky top-24 hidden h-[calc(100vh-6rem)] lg:block">
		<div class="font-medium">On This Page</div>
	</aside>
</div>

<svelte:head>
	<title>{data.meta.title} - Svelte MapLibre GL</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>
