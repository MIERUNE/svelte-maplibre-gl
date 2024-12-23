<script lang="ts">
	import heroImage from '$lib/assets/hero.svg';
</script>

<div class="container mx-auto w-full px-4 py-8 md:py-12">
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
		<p class="font-bold">Features:</p>
		<ul>
			<li>The most declarative and reactive MapLibre GL JS experience with Svelte 5</li>
			<li>A flexible, less opinionated API design for both beginners and experienced MapLibre users</li>
			<li>No restrictions — You can also control maps imperatively whenever needed</li>
		</ul>
		<p class="font-bold">Installation:</p>
		<pre><code>npm install --dev svelte-maplibre-gl</code></pre>
		<p>User documentation will be made available soon.</p>
	</main>
</div>

<svelte:head>
	<title>Svelte MapLibre GL</title>
	<meta name="description" content="Svelte library for using MapLibre GL JS as reactive components" />
</svelte:head>
