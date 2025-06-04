<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import SymbolLayer from '$lib/maplibre/layers/SymbolLayer.svelte';
	import { MapLibre, GeoJSONSource, CircleLayer } from 'svelte-maplibre-gl';

	let type = $state('');
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://demotiles.maplibre.org/style.json"
	zoom={9}
	center={[9.0679, 45.9]}
	globalState={{
		type: type
	}}
>
	<GeoJSONSource data="https://maplibre.org/maplibre-gl-js/docs/assets/funicolares-and-funivias-como.json">
		<SymbolLayer
			layout={{
				'text-field': '{name}',
				'text-font': ['Open Sans Semibold'],
				'text-offset': [0, 1],
				'text-anchor': 'top'
			}}
			paint={{
				'text-color': '#000000',
				'text-halo-color': '#ffffff',
				'text-halo-width': 2
			}}
			filter={[
				'case',
				['==', ['to-string', ['global-state', 'type']], ''],
				true,
				['==', ['get', 'type'], ['global-state', 'type']]
			]}
		/>
		<CircleLayer
			paint={{
				'circle-radius': 5,
				'circle-color': '#000000'
			}}
			filter={[
				'case',
				['==', ['to-string', ['global-state', 'type']], ''],
				true,
				['==', ['get', 'type'], ['global-state', 'type']]
			]}
		/>
	</GeoJSONSource>

	<!-- Controls -->
	<div
		class="absolute top-3 left-3 z-10 flex min-w-[200px] flex-col items-stretch gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
		<div class="flex items-center justify-between space-x-2">
			<Label for="shadow-method" class="leading-none">Color Ramp</Label>
			<select bind:value={type} id="hillshade-method" class="text-center">
				<option value="">All</option>
				<option value="lift">Aerial lift</option>
				<option value="railway">Cable railway</option>
			</select>
		</div>
	</div>
</MapLibre>
