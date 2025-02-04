<script lang="ts">
	import {
		HillshadeLayer,
		MapLibre,
		RasterDEMTileSource,
		Sky,
		Terrain,
		TerrainControl,
		GlobeControl,
		Light
	} from 'svelte-maplibre-gl';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let mode: 'terrain' | 'sky' = $state('terrain');
	// Terrain
	let exaggeration = $state(1.0);
	let hillshade = $state(0.7);
	let shadowColor = $state('#004050');
	let accentColor = $state('#aaff00');
	let highlightColor = $state('#ffffff');
	let direction = $state(0.0);
	// Sky
	let skyEnabled = $state(true);
	let skyColor = $state('#001560');
	let horizonColor = $state('#0090c0');
	let fogColor = $state('#ffffff');
	let skyHorizonBlend = $state(0.5);
	let horizonFogBlend = $state(0.7);
	let fogGroundBlend = $state(0.5);
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={12}
	pitch={72}
	maxPitch={85}
	center={{ lng: 11.39085, lat: 47.3 }}
>
	<GlobeControl />
	<Light anchor="map" />
	{#if skyEnabled}
		<Sky
			sky-color={skyColor}
			horizon-color={horizonColor}
			fog-color={fogColor}
			sky-horizon-blend={skyHorizonBlend}
			horizon-fog-blend={horizonFogBlend}
			fog-ground-blend={fogGroundBlend}
			atmosphere-blend={0.5}
		/>
	{/if}
	<!-- Terrain -->
	<RasterDEMTileSource
		id="terrain"
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		<TerrainControl position="top-right" />
		<Terrain {exaggeration} />
	</RasterDEMTileSource>
	<!-- Hillshade -->
	<RasterDEMTileSource
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		<HillshadeLayer
			paint={{
				'hillshade-exaggeration': hillshade,
				'hillshade-shadow-color': shadowColor,
				'hillshade-accent-color': accentColor,
				'hillshade-highlight-color': highlightColor,
				'hillshade-illumination-anchor': 'map',
				'hillshade-illumination-direction': direction
			}}
		/>
	</RasterDEMTileSource>

	<div
		class="absolute top-3 left-3 z-10 flex min-w-[200px] flex-col items-stretch gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
		<Tabs.Root bind:value={mode} class="flex h-full flex-col">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="terrain">Terrain</Tabs.Trigger>
				<Tabs.Trigger value="sky">Sky</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="terrain" class="min-h-0 shrink overflow-scroll pt-1">
				<div class="mb-4 flex flex-col items-center space-y-2 px-2">
					<Label for="pitch" class="leading-none">Exaggeration ({exaggeration.toFixed(2)})</Label>
					<Slider type="single" id="pitch" bind:value={exaggeration} min={0} max={2} step={0.01} />
				</div>
				<div class="mb-3 flex flex-col items-center space-y-2 px-2">
					<Label for="hillshade" class="leading-none">Hillshade ({hillshade.toFixed(2)})</Label>
					<Slider type="single" id="hillshade" bind:value={hillshade} min={0} max={1} step={0.01} />
				</div>
				<div class="mb-1 flex items-center justify-between space-x-2">
					<Label for="shadow-sm" class="leading-none">Shadow</Label>
					<input type="color" id="shadow-sm" bind:value={shadowColor} />
				</div>
				<div class="mb-1 flex items-center justify-between space-x-2">
					<Label for="accent" class="leading-none">Accent</Label>
					<input type="color" id="accent" bind:value={accentColor} />
				</div>
				<div class="mb-2 flex items-center justify-between space-x-2">
					<Label for="highlight" class="leading-none">Highlight</Label>
					<input type="color" id="highlight" bind:value={highlightColor} />
				</div>
				<div class="mb-3 flex flex-col items-center space-y-2 px-2">
					<Label for="direction" class="leading-none">Direction ({direction})</Label>
					<Slider type="single" id="direction" bind:value={direction} min={0} max={360} />
				</div>
			</Tabs.Content>
			<Tabs.Content value="sky" class="min-h-0 shrink overflow-scroll pt-1">
				<div class="mb-2 flex items-center space-x-2 self-center justify-self-center">
					<Checkbox id="skyEnabled" bind:checked={skyEnabled} />
					<Label for="skyEnabled" class="leading-none">Enable Sky</Label>
				</div>
				<div class="mb-1 flex items-center justify-between space-x-2">
					<Label for="skyColor" class="leading-none">Sky color</Label>
					<input type="color" id="skyColor" bind:value={skyColor} />
				</div>
				<div class="mb-3 flex flex-col items-center space-y-2 px-2">
					<Label for="skyHorizonBlend" class="leading-none">sky-horizon-blend ({skyHorizonBlend})</Label>
					<Slider type="single" id="skyHorizonBlend" bind:value={skyHorizonBlend} min={0} max={1} step={0.01} />
				</div>
				<div class="mb-1 flex items-center justify-between space-x-2">
					<Label for="horizonColor" class="leading-none">Horizon color</Label>
					<input type="color" id="horizonColor" bind:value={horizonColor} />
				</div>
				<div class="mb-3 flex flex-col items-center space-y-2 px-2">
					<Label for="horizonFogBlend" class="leading-none">horizon-fog-blend ({horizonFogBlend})</Label>
					<Slider type="single" id="horizonFogBlend" bind:value={horizonFogBlend} min={0} max={1} step={0.01} />
				</div>
				<div class="mb-1 flex items-center justify-between space-x-2">
					<Label for="fogColor" class="leading-none">Fog color</Label>
					<input type="color" id="fogColor" bind:value={fogColor} />
				</div>
				<div class="mb-3 flex flex-col items-center space-y-2 px-2">
					<Label for="fogGroundBlend" class="leading-none">fog-ground-blend ({fogGroundBlend})</Label>
					<Slider type="single" id="fogGroundBlend" bind:value={fogGroundBlend} min={0} max={1} step={0.01} />
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</MapLibre>
