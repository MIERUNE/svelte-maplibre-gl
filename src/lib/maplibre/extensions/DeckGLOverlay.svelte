<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { MapboxOverlay, type MapboxOverlayProps } from '@deck.gl/mapbox';
	import { getMapContext } from '../contexts.svelte.js';

	type Props = MapboxOverlayProps;

	let {
		// not reactive (?)
		interleaved = false,
		id,
		debug,
		_typedArrayManagerProps,
		// reactive (?)
		layers,
		layerFilter,
		effects = [],
		parameters,
		useDevicePixels,
		pickingRadius
	}: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let deckOverlay: MapboxOverlay;
	onMount(() => {
		deckOverlay = new MapboxOverlay({
			id,
			parameters,
			debug,
			_typedArrayManagerProps,
			interleaved,
			layers,
			effects
		});

		mapCtx.map?.addControl(deckOverlay);
	});

	let firstRun = true;

	$effect(() => {
		layers;
		if (!firstRun) {
			deckOverlay.setProps({ layers });
		}
	});

	$effect(() => {
		effects;
		if (!firstRun) {
			deckOverlay.setProps({ effects });
		}
	});

	$effect(() => {
		pickingRadius;
		if (!firstRun) {
			deckOverlay.setProps({ pickingRadius });
		}
	});

	$effect(() => {
		parameters;
		if (!firstRun) {
			deckOverlay.setProps({ parameters });
		}
	});

	$effect(() => {
		layerFilter;
		if (!firstRun) {
			deckOverlay.setProps({ layerFilter });
		}
	});

	$effect(() => {
		useDevicePixels;
		if (!firstRun) {
			deckOverlay.setProps({ useDevicePixels });
		}
	});

	$effect(() => {
		firstRun = false;
	});

	onDestroy(() => {
		mapCtx.map?.removeControl(deckOverlay);
	});
</script>
