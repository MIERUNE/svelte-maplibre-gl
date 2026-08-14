<script lang="ts">
	import 'svelte-maplibre-gl/vite'; // Required only for GL JS v6+
	import { MapLibre, FillExtrusionLayer } from 'svelte-maplibre-gl';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';

	const STYLES = ['Voyager', 'Dark Matter'] as const;
	type StyleName = (typeof STYLES)[number];
	const STYLE_URLS: Record<StyleName, string> = {
		Voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
		'Dark Matter': 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
	};
	let baseStyle: StyleName = $state('Voyager');
	let roundedCornerDistance = $state(2);
</script>

<div class="mb-3 flex flex-wrap items-center gap-6">
	<RadioGroup.Root bind:value={baseStyle} class="flex flex-row gap-x-3">
		{#each STYLES as name (name)}
			<div class="flex items-center space-x-1">
				<RadioGroup.Item value={name} id={`base-${name}`} />
				<Label class="cursor-pointer" for={`base-${name}`}>{name}</Label>
			</div>
		{/each}
	</RadioGroup.Root>
	<div class="flex w-64 flex-col items-center gap-2">
		<Label for="rounded-corner-distance" class="leading-none">
			Rounded corner distance ({roundedCornerDistance} m)
		</Label>
		<Slider type="single" id="rounded-corner-distance" bind:value={roundedCornerDistance} min={0} max={10} step={0.5} />
	</div>
</div>

<MapLibre
	class="h-[55vh] min-h-75"
	style={STYLE_URLS[baseStyle]}
	zoom={14.5}
	pitch={70}
	minZoom={14}
	bearing={0}
	center={[-74.01, 40.7075]}
>
	<FillExtrusionLayer
		source="carto"
		sourceLayer="building"
		minzoom={14}
		filter={['!=', ['get', 'hide_3d'], true]}
		layout={{
			'fill-extrusion-rounded-corner-distance': roundedCornerDistance
		}}
		paint={{
			'fill-extrusion-color': [
				'interpolate',
				['linear'],
				['get', 'render_height'],
				0,
				'#aaccbb',
				200,
				'royalblue',
				400,
				'purple'
			],
			'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, ['get', 'render_height']],
			'fill-extrusion-base': ['case', ['>=', ['get', 'zoom'], 14], ['get', 'render_min_height'], 0]
		}}
	/>
</MapLibre>
