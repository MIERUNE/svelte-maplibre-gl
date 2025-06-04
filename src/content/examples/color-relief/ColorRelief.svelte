<script lang="ts">
	import {
		HillshadeLayer,
		MapLibre,
		RasterDEMTileSource,
		TerrainControl,
		GlobeControl,
		Light,
		ColorReliefLayer
	} from 'svelte-maplibre-gl';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';

	// https://nathanmolson.github.io/color_relief
	const COLOR_RAMPS = {
		LINZ: [
			'interpolate',
			['linear'],
			['elevation'],
			0,
			'#c0e0ffff',
			0.1,
			'#d8d8d8ff',
			3,
			'#548359ff',
			255,
			'#32482dff',
			1000,
			'#32482dff',
			1200,
			'#adb7a3ff',
			1700,
			'#bfbfb8ff',
			1750,
			'#e6f4fdff',
			3000,
			'#ffffffff'
		],
		isoluminant: [
			'interpolate',
			['linear'],
			['elevation'],
			0,
			'rgb(112, 209, 255)',
			12.88581315,
			'rgb(113, 211, 247)',
			51.5432526,
			'rgb(114, 212, 234)',
			115.9723183,
			'rgb(117, 213, 222)',
			206.1730104,
			'rgb(120, 214, 209)',
			322.1453287,
			'rgb(124, 215, 196)',
			463.8892734,
			'rgb(130, 215, 183)',
			631.4048443,
			'rgb(138, 215, 169)',
			824.6920415,
			'rgb(149, 214, 155)',
			1043.750865,
			'rgb(163, 212, 143)',
			1288.581315,
			'rgb(178, 209, 134)',
			1559.183391,
			'rgb(193, 205, 127)',
			1855.557093,
			'rgb(207, 202, 121)',
			2177.702422,
			'rgb(220, 197, 118)',
			2525.619377,
			'rgb(233, 193, 118)',
			2899.307958,
			'rgb(244, 188, 120)',
			3298.768166,
			'rgb(255, 183, 124)',
			3724,
			'rgb(255, 178, 129)'
		],
		rainbow: [
			'interpolate',
			['linear'],
			['elevation'],
			0,
			'rgb(4, 0, 108)',
			12.88581315,
			'rgb(5, 1, 154)',
			51.5432526,
			'rgb(10, 21, 189)',
			115.9723183,
			'rgb(16, 44, 218)',
			206.1730104,
			'rgb(24, 69, 240)',
			322.1453287,
			'rgb(20, 112, 193)',
			463.8892734,
			'rgb(39, 144, 116)',
			631.4048443,
			'rgb(57, 169, 29)',
			824.6920415,
			'rgb(111, 186, 5)',
			1043.750865,
			'rgb(160, 201, 4)',
			1288.581315,
			'rgb(205, 216, 2)',
			1559.183391,
			'rgb(244, 221, 4)',
			1855.557093,
			'rgb(251, 194, 14)',
			2177.702422,
			'rgb(252, 163, 21)',
			2525.619377,
			'rgb(253, 128, 20)',
			2899.307958,
			'rgb(254, 85, 14)',
			3298.768166,
			'rgb(243, 36, 13)',
			3724,
			'rgb(215, 5, 13)'
		],
		geographical: [
			'interpolate',
			['linear'],
			['elevation'],
			0,
			'rgb(112, 209, 255)',
			1,
			'rgb(112, 209, 255)',
			2,
			'rgb(112, 173, 92)',
			176.4705882,
			'rgb(131, 174, 94)',
			352.9411765,
			'rgb(149, 175, 95)',
			529.4117647,
			'rgb(166, 176, 97)',
			705.8823529,
			'rgb(181, 177, 99)',
			882.3529412,
			'rgb(195, 177, 101)',
			1058.823529,
			'rgb(208, 178, 103)',
			1235.294118,
			'rgb(220, 180, 105)',
			1411.764706,
			'rgb(228, 182, 108)',
			1588.235294,
			'rgb(231, 187, 111)',
			1764.705882,
			'rgb(231, 192, 118)',
			1941.176471,
			'rgb(231, 197, 129)',
			2117.647059,
			'rgb(231, 203, 144)',
			2294.117647,
			'rgb(230, 208, 161)',
			2470.588235,
			'rgb(229, 212, 177)',
			2647.058824,
			'rgb(229, 217, 194)',
			2823.529412,
			'rgb(228, 222, 210)',
			3000,
			'rgb(226, 226, 226)'
		],
		categorical: [
			'interpolate',
			['linear'],
			['elevation'],
			0,
			'rgb(4, 0, 108)',
			1,
			'rgb(5, 1, 159)',
			232.75,
			'rgb(5, 1, 159)',
			233.75,
			'rgb(12, 28, 197)',
			465.5,
			'rgb(12, 28, 197)',
			466.5,
			'rgb(17, 53, 230)',
			698.25,
			'rgb(17, 53, 230)',
			699.25,
			'rgb(32, 92, 222)',
			931,
			'rgb(32, 92, 222)',
			932,
			'rgb(21, 135, 144)',
			1163.75,
			'rgb(21, 135, 144)',
			1164.75,
			'rgb(51, 164, 44)',
			1396.5,
			'rgb(51, 164, 44)',
			1397.5,
			'rgb(108, 184, 6)',
			1629.25,
			'rgb(108, 184, 6)',
			1630.25,
			'rgb(163, 202, 4)',
			1862,
			'rgb(163, 202, 4)',
			1863,
			'rgb(214, 218, 2)',
			2094.75,
			'rgb(214, 218, 2)',
			2095.75,
			'rgb(249, 214, 7)',
			2327.5,
			'rgb(249, 214, 7)',
			2328.5,
			'rgb(252, 180, 18)',
			2560.25,
			'rgb(252, 180, 18)',
			2561.25,
			'rgb(252, 143, 21)',
			2793,
			'rgb(252, 143, 21)',
			2794,
			'rgb(254, 98, 16)',
			3025.75,
			'rgb(254, 98, 16)',
			3026.75,
			'rgb(246, 41, 13)',
			3258.5,
			'rgb(246, 41, 13)',
			3259.5,
			'rgb(215, 5, 13)',
			3491.25,
			'rgb(215, 5, 13)'
		],
		monochrome: ['interpolate', ['linear'], ['elevation'], 0.1, '#111', 0.2, 'black', 3724, 'white'],
		rgbk: ['interpolate', ['linear'], ['elevation'], 0, '#f00', 800, '#0f0', 1600, '#00f', 2400, '#fff', 3724, 'black']
	} as const;
	type ColorRamp = keyof typeof COLOR_RAMPS;

	let colorRamp: ColorRamp = $state('LINZ');
	let hillshade = $state(0.4);
</script>

<MapLibre class="h-[55vh] min-h-[300px]" zoom={9.5} center={{ lng: 11.5, lat: 47.3 }}>
	<GlobeControl />
	<Light anchor="map" />
	<!-- Terrain -->
	<RasterDEMTileSource
		id="terrain"
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		tileSize={256}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		<TerrainControl position="top-right" />
	</RasterDEMTileSource>
	<!-- Color Relief and Hillshade -->
	<RasterDEMTileSource
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		tileSize={256}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		<ColorReliefLayer
			paint={{
				'color-relief-opacity': 1,
				'color-relief-color': COLOR_RAMPS[colorRamp] as any
			}}
		/>
		<HillshadeLayer
			paint={{
				'hillshade-method': 'igor',
				'hillshade-exaggeration': hillshade,
				'hillshade-highlight-color': '#ffffff'
			}}
		/>
	</RasterDEMTileSource>

	<!-- Controls -->
	<div
		class="absolute top-3 left-3 z-10 flex min-w-[200px] flex-col items-stretch gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
		<div class="mb-2 flex items-center justify-between space-x-2">
			<Label for="shadow-method" class="leading-none">Color Ramp</Label>
			<select bind:value={colorRamp} id="hillshade-method" class="text-center">
				{#each Object.keys(COLOR_RAMPS) as ramp (ramp)}
					<option value={ramp}>{ramp}</option>
				{/each}
			</select>
		</div>
		<div class="flex items-center justify-between space-x-3">
			<Label for="hillshade" class="leading-none">Hillshade</Label>
			<Slider type="single" id="hillshade" bind:value={hillshade} min={0} max={1} step={0.01} />
		</div>
	</div>
</MapLibre>
