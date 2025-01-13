<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	const { data } = $props();
</script>

<div class="grid gap-x-8 lg:grid-cols-[1fr_160px]">
	<div class="min-h-[calc(100vh-4rem)] w-full min-w-0 py-10">
		<Breadcrumb.Root class="mb-4">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/examples/">Examples</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{data.meta.title}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<h1 class="mb-1 text-4xl font-bold">{data.meta.title}</h1>
		<div class="mb-6">
			<p class="text-lg text-muted-foreground">
				{data.meta.description}
			</p>
			{#if data.meta.original}
				<p class="mt-1.5 text-xs text-muted-foreground">
					<strong>Based on:</strong>
					<a class="underline" target="_blank" href={data.meta.original}>{data.meta.original}</a>
				</p>
			{/if}
		</div>

		<div class="prose max-w-none dark:prose-invert">
			<data.Content shiki={data.shiki} />
		</div>
	</div>
	<aside class="sticky top-28 hidden h-[calc(100vh-7rem)] lg:block">
		<div class="font-medium">On This Page</div>
	</aside>
</div>

<svelte:head>
	<title>{data.meta.title} - Svelte MapLibre GL</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>
