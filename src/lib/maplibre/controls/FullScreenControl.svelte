<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/FullscreenControl/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';
	import { resetEventListener } from '../utils.js';
	import type { Listener, Event } from '../types.js';

	interface Props extends maplibregl.FullscreenControlOptions {
		position?: maplibregl.ControlPosition;
		// Events
		// https://maplibre.org/maplibre-gl-js/docs/API/classes/FullscreenControl/#events
		onfullscreenstart?: Listener<Event<maplibregl.FullscreenControl>>;
		onfullscreenend?: Listener<Event<maplibregl.FullscreenControl>>;
	}
	let { position, onfullscreenstart, onfullscreenend, ...options }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let control: maplibregl.FullscreenControl | null = null;
	$effect(() => {
		control && mapCtx.map?.removeControl(control);
		control = new maplibregl.FullscreenControl(options);
		mapCtx.map?.addControl(control, position);
	});

	$effect(() => resetEventListener(control, 'fullscreenstart', onfullscreenstart));
	$effect(() => resetEventListener(control, 'fullscreenend', onfullscreenend));

	onDestroy(() => {
		if (control) {
			mapCtx.map?.removeControl(control);
		}
	});
</script>
