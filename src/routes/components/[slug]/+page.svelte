<script lang="ts">
	import { decode } from 'svelte-docgen';
	const { data } = $props();

	const doc = $derived(decode(data.encodedDoc));
</script>

<div class="grid gap-x-8 lg:grid-cols-[1fr_160px]">
	<div class="min-h-[calc(100vh-4rem)] w-full min-w-0 py-8">
		<h1 class="mb-2 text-3xl font-bold">{data.title}</h1>

		<p class="mb-6 text-muted-foreground">
			{data.description}
		</p>

<<<<<<< Updated upstream
		<pre>{data.doc}</pre>

		{#each data.doc.props as [name, prop]}
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
||||||| Stash base
		<div class="prose max-w-none dark:prose-invert">
			<data.Content shiki={data.shiki} />
		</div>
=======
<<<<<<< Updated upstream
		<div class="prose max-w-none dark:prose-invert">
			<data.Content shiki={data.shiki} />
		</div>
||||||| Stash base
		<pre>{data.doc}</pre>

		{#each data.doc.props as [name, prop]}
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
=======
		{#each doc.props as [name, prop]}
			<div class="mb-8">
				<h3 class="text-xl font-semibold">
					{name}
					{#if !prop.isOptional}
						<sup>[required]</sup>
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
	</div>
	<aside class="sticky top-24 hidden h-[calc(100vh-6rem)] lg:block">
		<div class="font-medium">On This Page</div>
	</aside>
</div>

<svelte:head>
	<title>{data.title} - Svelte MapLibre GL</title>
	<meta name="description" content={data.description} />
</svelte:head>
