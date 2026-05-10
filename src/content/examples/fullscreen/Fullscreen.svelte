<script lang="ts">
	import { MapLibre, FullScreenControl } from 'svelte-maplibre-gl';

	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let pseudo = $state(false);
</script>

<MapLibre
	class="relative h-[55vh] min-h-75 border-8 border-slate-500"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
>
	<div
		class="absolute top-3 right-3 z-10 flex items-center space-x-2 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
		<Checkbox id="pseudo" bind:checked={pseudo} />
		<Label for="pseudo" class="leading-none">Pseudo fullscreen</Label>
	</div>

	<FullScreenControl position="top-left" {pseudo} />
</MapLibre>
