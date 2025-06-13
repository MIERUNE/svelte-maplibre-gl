<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/TerrainControl/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext, getSourceContext } from '../contexts.svelte.js';

	interface Props extends Omit<maplibregl.TerrainSpecification, 'source'> {
		source?: string;
		position?: maplibregl.ControlPosition;
	}
	let { position, source, ...restOptions }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	const options = $derived({
		source: source ?? getSourceContext().id,
		...restOptions
	});

	let control: maplibregl.TerrainControl | null = null;
	$effect(() => {
		if (control) {
			mapCtx.map?.removeControl(control);
		}
		control = new maplibregl.TerrainControl($state.snapshot(options));
		mapCtx.map?.addControl(control, position);
	});

	onDestroy(() => {
		if (control) {
			mapCtx.map?.removeControl(control);
		}
	});
</script>
