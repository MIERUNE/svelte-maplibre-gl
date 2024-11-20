<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/interfaces/IControl/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	interface Props {
		position?: maplibregl.ControlPosition;
		control: maplibregl.IControl;
	}
	let { position, control }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	$effect(() => {
		mapCtx.map?.removeControl(control);
		mapCtx.map?.addControl(control, position);
	});

	onDestroy(() => {
		if (control) {
			mapCtx.map?.removeControl(control);
		}
	});
</script>
