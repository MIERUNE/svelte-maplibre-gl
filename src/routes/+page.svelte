<script lang="ts">
	import heroImage from '$lib/assets/hero.svg';
</script>

<div class="mx-auto w-full px-4 py-8 xl:container md:p-8 md:py-16">
	<main class="prose max-w-none dark:prose-invert">
		<h1>Svelte MapLibre GL</h1>
		<p>Simplify MapLibre GL JS with the full potential of Svelte's reactivity.</p>
		<p>
			<a href="/examples/">Explore Examples</a>
		</p>
		<pre><code>npm install --dev svelte-maplibre-gl</code></pre>
		<p>User documentation will be made available soon.</p>

		<p>
			<img src={heroImage} alt="hero" />
		</p>
	</main>
	<footer class="font-zinc-500 mt-8 border-t pt-6 text-sm">
		<p>&copy; 2024 Svelte Maplibre GL contributors</p>
	</footer>
</div>

<svelte:head>
	<title>Svelte MapLibre GL</title>
	<meta name="description" content="Svelte library for using MapLibre GL JS as reactive components" />
</svelte:head>
