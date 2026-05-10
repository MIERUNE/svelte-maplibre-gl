<script lang="ts">
	import { MapLibre, FillExtrusionLayer } from 'svelte-maplibre-gl';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';

	const STYLES = ['Voyager', 'Dark Matter'] as const;
	type StyleName = (typeof STYLES)[number];
	const STYLE_URLS: Record<StyleName, string> = {
		Voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
		'Dark Matter': 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
	};
	let baseStyle: StyleName = $state('Voyager');
</script>

<div class="mb-3">
	<RadioGroup.Root bind:value={baseStyle} class="flex flex-row gap-x-3">
		{#each STYLES as name (name)}
			<div class="flex items-center space-x-1">
				<RadioGroup.Item value={name} id={`base-${name}`} />
				<Label class="cursor-pointer" for={`base-${name}`}>{name}</Label>
			</div>
		{/each}
	</RadioGroup.Root>
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
