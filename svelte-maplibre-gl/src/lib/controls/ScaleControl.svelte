<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/ScaleControl/

	import { onDestroy, untrack } from 'svelte';
	import * as maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	interface Props extends maplibregl.ScaleControlOptions {
		position?: maplibregl.ControlPosition;
	}
	let { position, unit = 'metric', maxWidth }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let control: maplibregl.ScaleControl | null = null;
	$effect(() => {
		untrack(() => control && mapCtx.map?.removeControl(control));
		const options: maplibregl.ScaleControlOptions = { unit: untrack(() => unit) };
		if (maxWidth !== undefined) {
			options.maxWidth = maxWidth;
		}
		control = new maplibregl.ScaleControl(options);
		mapCtx.map?.addControl(
			untrack(() => control!),
			position
		);
	});

	let firstRun = true;

	$effect(() => {
		if (unit && !firstRun) {
			control?.setUnit(unit);
		}
	});

	$effect(() => {
		firstRun = false;
	});

	onDestroy(() => {
		if (control) {
			mapCtx.map?.removeControl(control);
		}
	});
</script>
