<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import {
		MapLibre,
		RasterTileSource,
		RasterDEMTileSource,
		VectorTileSource,
		GeoJSONSource,
		BackgroundLayer,
		RasterLayer,
		FillLayer,
		LineLayer,
		CircleLayer,
		FillExtrusionLayer,
		NavigationControl,
		FullScreenControl,
		ScaleControl,
		LogoControl,
		GeolocateControl,
		AttributionControl,
		HeatmapLayer,
		TerrainControl,
		Hash,
		HillshadeLayer,
		Terrain,
		Sky,
		Projection,
		Light,
		Marker,
		Popup,
		GlobeControl
	} from 'svelte-maplibre-gl';

	let map: maplibregl.Map | undefined = $state.raw();
	let hash = $state(true);
	let sky = $state(true);
	let globe = $state(true);
	let showCities = $state(true);
	let hillshade = $state(true);
	let extrude = $state(false);
	let heatmap = $state(false);
	let pointColor = $state('#ffff00');
	let lineColor = $state('#ff00dd');
	let lineWidth = $state(1.5);
	let circleRadius = $state(3);
	let center: [number, number] = $state([137.3543, 37.062]);
	let zoom = $state(6.0);
	let pitch = $state(0);
	let bearing = $state(0);
	let controlPosition: maplibregl.ControlPosition | undefined = $state('bottom-right');
	let markerLnglat = $state({ lng: 139.767052, lat: 35.681167 });
</script>

<div class="flex items-center gap-x-2 p-1 text-sm">
	<label>
		<input class="rounded border p-1 leading-none" type="checkbox" bind:checked={showCities} />
		Cities
	</label>
	<label>
		<input class="rounded border p-1 leading-none" type="checkbox" bind:checked={hillshade} />
		Hillshade
	</label>
	<label>
		<input class="rounded border p-1 leading-none" type="checkbox" bind:checked={sky} />
		Sky
	</label>
	<label>
		<input class="rounded border p-1 leading-none" type="checkbox" bind:checked={extrude} />
		Extrude
	</label>
	<label>
		<input class="rounded border p-1 leading-none" type="checkbox" bind:checked={heatmap} />
		Heatmap
	</label>
	<label>
		<input class="rounded border p-1 leading-none" type="checkbox" bind:checked={globe} />
		Globe
	</label>
	<label>
		pC:
		<input type="color" bind:value={pointColor} class="inline-block w-7 rounded border leading-none" />
	</label>
	<label>
		pR:
		<input
			type="number"
			min="0"
			max="10"
			step="0.5"
			bind:value={circleRadius}
			class="w-12 rounded border p-1 leading-none"
		/>
	</label>
	<label>
		lC:
		<input type="color" bind:value={lineColor} class="w-7 rounded border leading-none" />
	</label>
	<label>
		lW:
		<input
			type="number"
			min="0"
			max="10"
			step="0.5"
			bind:value={lineWidth}
			class="w-12 rounded border p-1 leading-none"
		/>
	</label>
	<select bind:value={controlPosition}>
		<option value="top-left">top-left</option>
		<option value="top-right">top-right</option>
		<option value="bottom-left">botom-left</option>
		<option value="bottom-right">bottom-right</option>
		<option value={undefined}>auto</option>
	</select>
	<button
		class="rounded border p-1 leading-none"
		onclick={() => {
			map?.flyTo({ center: markerLnglat, zoom: 15 });
		}}>Fly to</button
	>
</div>
<div class="flex items-center gap-x-4 text-sm">
	<pre
		class="my-1 grow">{`lat: ${center[1].toFixed(3)}, lng: ${center[0].toFixed(3)}, z: ${zoom.toFixed(1)}, pitch: ${pitch.toFixed(1)}, bearing: ${bearing.toFixed(1)}`}</pre>
	<pre class="my-1 grow">marker: {`${markerLnglat.lat.toFixed(3)}, ${markerLnglat.lng.toFixed(3)}`}</pre>
	<label>
		z:
		<input type="number" min="0" max="24" step="0.5" bind:value={zoom} class="w-12 rounded border p-1 leading-none" />
	</label>
	<label>
		<input type="checkbox" bind:checked={hash} /> Hash
	</label>
</div>

<MapLibre
	class="h-[60vh] min-h-[300px]"
	bind:map
	bind:zoom
	bind:center
	bind:pitch
	bind:bearing
	maxPitch={85}
	attributionControl={false}
>
	<!--
	maxBounds={[
		{ lng: 120, lat: 20 },
		{ lng: 150, lat: 50 }
	]}
	-->
	{#if hash}
		<Hash />
	{/if}
	{#if sky}
		<Sky
			sky-color="#001560"
			horizon-color="#0090c0"
			fog-color="#ffffff"
			sky-horizon-blend={0.9}
			horizon-fog-blend={0.8}
			fog-ground-blend={0.7}
			atmosphere-blend={['interpolate', ['linear'], ['zoom'], 2, 0.8, 4, 0.3, 7, 0]}
		/>
	{/if}
	<Light anchor="map" />
	<Projection type={globe ? 'globe' : undefined} />
	<AttributionControl position={controlPosition} compact />
	<LogoControl position={controlPosition} />
	<ScaleControl position={controlPosition} />
	<FullScreenControl position={controlPosition} />
	<GeolocateControl position={controlPosition} />
	<NavigationControl position={controlPosition} visualizePitch />
	<TerrainControl position={controlPosition} source="terrain" />
	<GlobeControl position={controlPosition} />
	<RasterDEMTileSource
		id="terrain"
		tiles={['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={15}
		encoding="terrarium"
		attribution="<a href='https://github.com/tilezen/joerd/blob/master/docs/attribution.md'>Mapzen (Terrain)</a>"
	>
		{#if !globe}
			<Terrain />
		{/if}
	</RasterDEMTileSource>
	<RasterTileSource
		tiles={['https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg']}
		minzoom={2}
		maxzoom={18}
		attribution="国土地理院, TSIC, GEO Grid/AIST, USGS, GEBCO, NASA"
	>
		<RasterLayer />
	</RasterTileSource>
	<BackgroundLayer id="dummy1" layout={{ visibility: 'none' }} />
	{#if hillshade}
		<RasterDEMTileSource
			tiles={['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png']}
			minzoom={0}
			maxzoom={15}
			encoding="terrarium"
			attribution="<a href='https://github.com/tilezen/joerd/blob/master/docs/attribution.md'>Mapzen (Terrain)</a>"
		>
			<HillshadeLayer beforeId="dummy1" />
		</RasterDEMTileSource>
	{/if}
	<BackgroundLayer id="dummy2" layout={{ visibility: 'none' }} />
	<BackgroundLayer id="dummy3" layout={{ visibility: 'none' }} />
	<VectorTileSource
		tiles={['https://jma-assets.mierune.dev/tiles/mete/{z}/{x}/{y}.pbf']}
		minzoom={0}
		maxzoom={13}
		attribution={'<a href="https://www.data.jma.go.jp/developer/gis.html">気象庁</a>'}
	>
		{#if showCities}
			<LineLayer
				sourceLayer="city"
				beforeId="dummy3"
				layout={{ 'line-join': 'round', 'line-cap': 'round' }}
				paint={{ 'line-color': lineColor, 'line-width': lineWidth }}
			/>
			{#if extrude}
				<FillExtrusionLayer
					sourceLayer="city"
					beforeId="dummy2"
					paint={{
						'fill-extrusion-color': '#555533',
						'fill-extrusion-height': ['/', ['to-number', ['get', 'code']], 100],
						'fill-extrusion-opacity': 0.7
					}}
				/>
			{:else}
				<FillLayer
					id="cityfill"
					sourceLayer="city"
					beforeId="dummy2"
					paint={{ 'fill-color': '#aaaa33', 'fill-opacity': 0.3 }}
				/>
			{/if}
		{/if}
	</VectorTileSource>
	<GeoJSONSource data="https://jma-assets.mierune.dev/codes/amedas_ame.geojson">
		{#if heatmap}
			<HeatmapLayer
				paint={{
					'heatmap-weight': 1,
					'heatmap-intensity': ['interpolate', ['exponential', 2], ['zoom'], 0, 0.9, 18, 10],
					'heatmap-color': [
						'interpolate',
						['linear'],
						['heatmap-density'],
						0,
						'rgba(33,102,172,0)',
						0.2,
						'rgb(103,169,207)',
						0.4,
						'rgb(209,229,240)',
						0.6,
						'rgb(253,219,199)',
						0.7,
						'rgb(239,138,98)',
						0.9,
						'rgb(178,24,43)',
						1,
						'rgb(100,0,200)'
					],
					'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 8, 18, 20],
					'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 2, 1, 18, 0]
				}}
			/>
		{:else}
			<CircleLayer beforeId="dummy3" paint={{ 'circle-radius': circleRadius, 'circle-color': pointColor }} />
		{/if}
	</GeoJSONSource>
	<Marker bind:lnglat={markerLnglat} draggable color="#99dd55">
		{#snippet content()}
			<span class="text-3xl">🐸</span>
		{/snippet}
		<Popup class="text-black">
			<span class="text-lg">
				{`${markerLnglat.lat.toFixed(3)}, ${markerLnglat.lng.toFixed(3)}`}
			</span>
		</Popup>
	</Marker>
</MapLibre>
