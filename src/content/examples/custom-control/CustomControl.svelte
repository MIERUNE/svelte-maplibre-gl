<script lang="ts">
	import { HillshadeLayer, MapLibre, RasterDEMTileSource, Terrain, CustomControl } from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import ArrowUpLeft from 'lucide-svelte/icons/arrow-up-left';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import ArrowDownLeft from 'lucide-svelte/icons/arrow-down-left';
	import ArrowDownRight from 'lucide-svelte/icons/arrow-down-right';
	import { MyControl } from './MyControl.js';

	let isHillshadeVisible = $state(true);
	let isTerrainVisible = $state(true);
	let isDarkMode = $state(false);
	const mapStyle = $derived(
		isDarkMode
			? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
			: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
	);
	let center = $state({ lng: 11.09085, lat: 47.3 });
	let controlPosition: maplibregl.ControlPosition = $state('top-left');

	const myControl = new MyControl({
		toggleHillshade: () => (isHillshadeVisible = !isHillshadeVisible),
		toggleTerrain: () => (isTerrainVisible = !isTerrainVisible)
	});
</script>

<MapLibre class="h-[55vh] min-h-[200px]" style={mapStyle} zoom={12} pitch={40} maxPitch={85} bind:center>
	<!-- inject IControl (useful for plugin) -->
	<CustomControl position="top-left" control={myControl} />

	<!-- Control / Group / Icon -->
	<CustomControl position="bottom-left">
		<button onclick={() => (isDarkMode = !isDarkMode)} class="flex! items-center justify-center text-gray-900">
			{#if isDarkMode}
				<Moon class="w-5" />
			{:else}
				<Sun class="w-5" />
			{/if}
		</button>
	</CustomControl>

	<!-- Group -->
	<CustomControl position={controlPosition} class="text-gray-900">
		<button class="flex! items-center justify-center" onclick={() => (controlPosition = 'top-left')}
			><ArrowUpLeft class="w-5" /></button
		>
		<button class="flex! items-center justify-center" onclick={() => (controlPosition = 'top-right')}
			><ArrowUpRight class="w-5" /></button
		>
		<button class="flex! items-center justify-center" onclick={() => (controlPosition = 'bottom-right')}
			><ArrowDownRight class="w-5" /></button
		>
		<button class="flex! items-center justify-center" onclick={() => (controlPosition = 'bottom-left')}
			><ArrowDownLeft class="w-5" /></button
		>
	</CustomControl>

	<!-- Control / Group / any svelte elements -->
	<CustomControl position="top-right">
		<div class="p-2 text-yellow-700">Arbitrary HTML</div>
		<div class="border-t border-t-[#ddd] p-2 text-center text-yellow-700">
			({center.lat.toFixed(4)}, {center.lng.toFixed(4)})
		</div>
	</CustomControl>

	<RasterDEMTileSource
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		{#if isTerrainVisible}
			<Terrain />
		{/if}
	</RasterDEMTileSource>
	<RasterDEMTileSource
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		{#if isHillshadeVisible}
			<HillshadeLayer />
		{/if}
	</RasterDEMTileSource>
</MapLibre>
