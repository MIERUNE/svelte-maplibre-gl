<script lang="ts">
	import {
		MapLibre,
		GeoJSONSource,
		CircleLayer,
		Marker,
		GlobeControl,
		QuerySourceFeatures,
		QueryRenderedFeatures
	} from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let features: maplibregl.MapGeoJSONFeature[] = $state.raw([]);
	let mode: 'source' | 'rendered' = $state('source');
</script>

<div class="flex h-[55vh] min-h-[300px] gap-x-3">
	<MapLibre
		class="h-[55vh] min-h-[300px] grow"
		style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
		zoom={3}
		center={{ lng: 120, lat: 20 }}
	>
		<GlobeControl />
		<GeoJSONSource
			id="earthquakes"
			data="https://maplibre.org/maplibre-gl-js/docs/assets/significant-earthquakes-2015.geojson"
			promoteId="ids"
		>
			{#if mode == 'source'}
				<!-- map.querySourceFeatures() -->
				<QuerySourceFeatures bind:features>
					{#snippet children(feature: maplibregl.MapGeoJSONFeature)}
						{#if feature.geometry.type === 'Point'}
							<Marker lnglat={feature.geometry.coordinates as [number, number]} />
						{/if}
					{/snippet}
				</QuerySourceFeatures>
			{/if}
			<CircleLayer paint={{ 'circle-color': 'red', 'circle-radius': 4 }}>
				{#if mode == 'rendered'}
					<!-- map.queryRenderedFeatures() -->
					<QueryRenderedFeatures bind:features>
						{#snippet children(feature: maplibregl.MapGeoJSONFeature)}
							{#if feature.geometry.type === 'Point'}
								<Marker lnglat={feature.geometry.coordinates as [number, number]} />
							{/if}
						{/snippet}
					</QueryRenderedFeatures>
				{/if}
			</CircleLayer>
		</GeoJSONSource>
	</MapLibre>

	<!-- List of earthquakes -->
	<div class="relative basis-[10em]">
		<Tabs.Root bind:value={mode} class="flex h-full flex-col">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="source">Source</Tabs.Trigger>
				<Tabs.Trigger value="rendered">Rendered</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="source" class="min-h-0 shrink overflow-scroll">
				<ul class="m-0 ml-2 overflow-scroll px-3 text-xs">
					{#each features as feature (feature.id)}
						<li>{feature.properties.title}</li>
					{/each}
				</ul>
			</Tabs.Content>
			<Tabs.Content value="rendered" class="min-h-0 shrink overflow-scroll">
				<ul class="m-0 ml-4 overflow-scroll px-3 text-xs">
					{#each features as feature (feature.id)}
						<li>{feature.properties.title}</li>
					{/each}
				</ul>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
