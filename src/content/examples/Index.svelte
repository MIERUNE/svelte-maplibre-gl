<script lang="ts">
	import { page } from '$app/stores';

	const items = {
		'/examples/plain': 'Plain Map',
		'/examples/complex': 'Complex',
		'/examples/basestyle': 'Change Base Style',
		'/examples/side-by-side': 'Side by Side',
		'/examples/terrain': '3D Terrain',
		'/examples/hover-styles': 'Hover Styles',
		'/examples/clusters': 'Clusters',
		'/examples/limit-interaction': 'Limit Map Interactions',
		'/examples/dynamic-image': 'Dynamic Image',
		'/examples/animate-images': 'Animate a Series of Images',
		'/examples/video-on-a-map': 'Video on a Map',
		'/examples/canvas-source': 'Canvas Source',
		'/examples/fullscreen': 'Fullscreen',
		'/examples/geolocate': 'Locate the User',
		'/examples/image-loader': 'Loading Images',
		'/examples/custom-control': 'Custom Control',
		'/examples/custom-protocol': 'Custom Protocols',
		'/examples/deckgl-overlay': 'deck.gl Overlay',
		'/examples/contour': 'Contour Lines'
	};
</script>

<nav>
	<h2 class="mb-4 text-lg font-bold">Examples</h2>
	<ul class="flex flex-col gap-y-2">
		{#each Object.entries(items) as [path, title]}
			<li>
				<a class="data-[active=true]:font-medium" data-active={$page.url.pathname === path} href={path}>{title}</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		view-transition-name: toc;
	}
</style>
