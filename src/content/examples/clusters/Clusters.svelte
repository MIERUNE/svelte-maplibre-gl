<script lang="ts">
	import { CircleLayer, MapLibre, GeoJSONSource, SymbolLayer, GlobeControl } from 'svelte-maplibre-gl';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let cluster = $state(true);
	let clusterMaxZoom = $state(11);
	let clusterRadius = $state(50);
</script>

<div class="mb-4 flex items-center justify-between gap-x-10">
	<div class="flex items-center space-x-2">
		<Checkbox id="cluster" bind:checked={cluster} />
		<Label
			for="cluster"
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cluster</Label
		>
	</div>
	<div class="flex flex-1 grow flex-col gap-y-4">
		<Label for="clusterMaxZoom">clusterMaxZoom: {clusterMaxZoom.toFixed(2)}</Label>
		<Slider type="single" id="clusterMaxZoom" bind:value={clusterMaxZoom} min={0} max={22} step={1} />
	</div>
	<div class="flex flex-1 grow flex-col gap-y-4">
		<Label for="clusterRadius">clusterRadius: {clusterRadius.toFixed(2)}</Label>
		<Slider type="single" id="clusterRadius" bind:value={clusterRadius} min={0} max={100} step={1} />
	</div>
</div>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
	zoom={2}
	center={{ lng: 180, lat: 35 }}
>
	<GlobeControl />
	<GeoJSONSource
		data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
		{cluster}
		clusterMaxZoom={cluster ? clusterMaxZoom : undefined}
		clusterRadius={cluster ? clusterRadius : undefined}
	>
		<CircleLayer
			filter={['has', 'point_count']}
			paint={{
				'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 50, '#f1f075', 150, '#f28cb1'],
				'circle-radius': ['+', 10, ['sqrt', ['get', 'point_count']]],
				'circle-opacity': 0.8
			}}
		/>
		<SymbolLayer
			filter={['has', 'point_count']}
			layout={{
				'text-field': '{point_count_abbreviated}',
				'text-size': 12
			}}
		/>
		<CircleLayer
			filter={['!', ['has', 'point_count']]}
			paint={{
				'circle-color': '#ffff00',
				'circle-radius': 2
			}}
		/>
	</GeoJSONSource>
</MapLibre>
