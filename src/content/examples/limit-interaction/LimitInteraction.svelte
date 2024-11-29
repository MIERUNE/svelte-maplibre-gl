<script lang="ts">
	import { MapLibre } from 'svelte-maplibre-gl';

	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';

	let zoomRange = $state([5, 11]);
	let pitchRange = $state([0, 60]);
	let boxZoom = $state(true);
	let doubleClickZoom = $state(true);
	let dragRotate = $state(true);
	let dragPan = $state(true);
	let keyboard = $state(true);
	let scrollZoom = $state(true);
	let touchZoomRotate = $state(true);
	let touchPitch = $state(true);
</script>

<MapLibre
	class="relative h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={5}
	center={{ lng: 137, lat: 36 }}
	{doubleClickZoom}
	{boxZoom}
	{keyboard}
	{dragRotate}
	{dragPan}
	{scrollZoom}
	{touchZoomRotate}
	{touchPitch}
	minZoom={zoomRange[0]}
	maxZoom={zoomRange[1]}
	minPitch={pitchRange[0]}
	maxPitch={pitchRange[1]}
>
	<div class="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur">
		<div class="mb-3 flex flex-col items-center space-y-2.5 px-2">
			<Label for="zoom" class="leading-none">Zoom Range ({zoomRange})</Label>
			<Slider id="zoom" bind:value={zoomRange} min={0} max={22} />
		</div>
		<div class="mb-3 flex flex-col items-center space-y-2.5 px-2">
			<Label for="pitch" class="leading-none">Pitch Range ({pitchRange})</Label>
			<Slider id="pitch" bind:value={pitchRange} min={0} max={90} />
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="scrollZoom" bind:checked={scrollZoom} />
			<Label for="scrollZoom" class="leading-none">Scroll Zoom</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="boxZoom" bind:checked={boxZoom} />
			<Label for="boxZoom" class="leading-none">Box Zoom</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="dragPan" bind:checked={dragPan} />
			<Label for="dragPan" class="leading-none">Drag Pan</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="dragRotate" bind:checked={dragRotate} />
			<Label for="dragRotate" class="leading-none">Drag Rotate</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="doubleClickZoom" bind:checked={doubleClickZoom} />
			<Label for="doubleClickZoom" class="leading-none">Double Click Zoom</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="keyboard" bind:checked={keyboard} />
			<Label for="keyboard" class="leading-none">Keyboard</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="touchZoomRotate" bind:checked={touchZoomRotate} />
			<Label for="touchZoomRotate" class="leading-none">Touch Zoom Rotate</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="touchPitch" bind:checked={touchPitch} />
			<Label for="touchPitch" class="leading-none">Touch Pitch</Label>
		</div>
	</div>
</MapLibre>
