<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/FullscreenControl/

	import * as maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';
	import { resetEventListener } from '../utils.js';
	import type { Listener, Event } from '../types.js';

	interface Props extends maplibregl.FullscreenControlOptions {
		position?: maplibregl.ControlPosition;
		/** Forces CSS-based pseudo fullscreen mode. Requires maplibre-gl 5.18.0 or later. */
		pseudo?: boolean;
		// Events
		// https://maplibre.org/maplibre-gl-js/docs/API/classes/FullscreenControl/#events
		onfullscreenstart?: Listener<Event<maplibregl.FullscreenControl>>;
		onfullscreenend?: Listener<Event<maplibregl.FullscreenControl>>;
	}
	let { position, onfullscreenstart, onfullscreenend, ...options }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let control = $state.raw<maplibregl.FullscreenControl | null>(null);
	$effect(() => {
		const map = mapCtx.map;
		const currentControl = new maplibregl.FullscreenControl(options);
		map?.addControl(currentControl, position);
		control = currentControl;

		return () => {
			map?.removeControl(currentControl);
		};
	});

	$effect(() => resetEventListener(control, 'fullscreenstart', onfullscreenstart));
	$effect(() => resetEventListener(control, 'fullscreenend', onfullscreenend));
</script>
