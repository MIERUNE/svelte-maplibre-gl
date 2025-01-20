<script lang="ts">
	import heroImage from '$lib/assets/hero.svg';
</script>

<div class="container mx-auto w-full px-4 py-10 md:py-12">
	<main class="prose mx-auto dark:prose-invert">
		<h1 class="mb-0">Svelte MapLibre GL</h1>
		<p>
			🗺 Build interactive web maps effortlessly with <a href="https://maplibre.org/maplibre-gl-js/docs/"
				>MapLibre GL JS</a
			>
			and
			<a href="https://svelte.dev/">Svelte 5</a>.
		</p>
		<p class="my-10">
			<a
				href="/examples/"
				class="rounded-full bg-[#2A5DAA] px-8 py-4 font-bold text-white no-underline transition-colors duration-300 hover:bg-red-500"
				>Explore Examples</a
			>
		</p>
		<p>
			<img src={heroImage} alt="hero" />
		</p>

		<h3 class="font-bold">Features:</h3>
		<ul>
			<li>The most declarative and reactive MapLibre GL JS experience, powered by Svelte 5</li>
			<li>
				A flexible, minimally opinionated API design that is suitable for both beginners and experienced MapLibre users
			</li>
			<li>Freedom preserved — Traditional imperative MapLibre GL JS usage remains fully supported</li>
		</ul>

		<h3 class="font-bold">Installation:</h3>
		<pre><code>npm install --save-dev svelte-maplibre-gl</code></pre>

		<h3 class="font-bold">Contents:</h3>
		<ul>
			<li><a href="/docs/quickstart">Quickstart</a></li>
			<li><a href="/examples">Examples</a></li>
			<li><a href="/docs/components">API Reference</a></li>
		</ul>
	</main>
</div>

<svelte:head>
	<title>Svelte MapLibre GL - Build interactive web maps effortlessly with MapLibre GL JS and Svelte</title>
	<meta name="description" content="Build interactive web maps effortlessly with MapLibre GL JS and Svelte" />
</svelte:head>
