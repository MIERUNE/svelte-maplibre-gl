<script lang="ts">
	import { MapLibre, GlobeControl } from 'svelte-maplibre-gl';
	import { TerraDraw } from 'svelte-maplibre-gl/terradraw';
	import type { TerraDraw as Draw } from 'terra-draw';
	import {
		TerraDrawCircleMode,
		TerraDrawRectangleMode,
		TerraDrawFreehandMode,
		TerraDrawAngledRectangleMode,
		TerraDrawLineStringMode,
		TerraDrawPolygonMode,
		TerraDrawPointMode,
		TerraDrawSectorMode,
		TerraDrawSelectMode,
		TerraDrawSensorMode
	} from 'terra-draw';

	const defaultSelectFlags = {
		feature: {
			draggable: true,
			coordinates: {
				deletable: true,
				midpoints: true,
				draggable: true
			}
		}
	};
	const modes = [
		new TerraDrawSelectMode({
			flags: {
				point: defaultSelectFlags,
				linestring: defaultSelectFlags,
				polygon: defaultSelectFlags,
				freehand: defaultSelectFlags,
				circle: defaultSelectFlags,
				rectangle: defaultSelectFlags,
				sector: defaultSelectFlags,
				sensor: defaultSelectFlags,
				'angled-rectangle': defaultSelectFlags
			}
		}),
		new TerraDrawPointMode(),
		new TerraDrawLineStringMode(),
		new TerraDrawPolygonMode(),
		new TerraDrawCircleMode(),
		new TerraDrawSectorMode(),
		new TerraDrawSensorMode(),
		new TerraDrawRectangleMode(),
		new TerraDrawFreehandMode(),
		new TerraDrawAngledRectangleMode()
	];
	const modeNames = modes.map((mode) => mode.mode);
	let mode = $state('select');
	let selected: string | number | null = $state(null);
	let draw: Draw | undefined = $state.raw();
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={2}
	center={{ lng: 60, lat: 20 }}
>
	<!-- Terra Draw -->
	<TerraDraw
		{mode}
		{modes}
		bind:draw
		onselect={(featureId) => (selected = featureId)}
		ondeselect={() => (selected = null)}
		onfinish={() => (mode = 'select')}
	/>

	<!-- Draw controls -->
	<div
		class="absolute top-3 left-3 z-10 flex flex-col items-stretch gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
		{#each modeNames as modeName}
			<label><input type="radio" bind:group={mode} value={modeName} class="mr-1" /> {modeName}</label>
		{/each}
		{#if selected}
			<button
				class="mt-1 rounded border px-1"
				onclick={() => {
					if (!selected) return;
					draw?.removeFeatures([selected]);
					draw?.deselectFeature(selected);
				}}>Remove</button
			>
		{/if}
	</div>
	<GlobeControl />
</MapLibre>
