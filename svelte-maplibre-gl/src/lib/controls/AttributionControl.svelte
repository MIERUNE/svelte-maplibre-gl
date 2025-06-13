<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/AttributionControl/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	interface Props extends maplibregl.AttributionControlOptions {
		position?: maplibregl.ControlPosition;
	}
	let { position, ...options }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let control: maplibregl.AttributionControl | null = null;
	$effect(() => {
		control && mapCtx.map?.removeControl(control);
		control = new maplibregl.AttributionControl($state.snapshot(options));
		mapCtx.map?.addControl(control, position);
	});

	onDestroy(() => {
		if (control) {
			mapCtx.map?.removeControl(control);
		}
	});
</script>
