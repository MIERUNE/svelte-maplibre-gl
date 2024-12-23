<script lang="ts">
	import { onDestroy, onMount, untrack } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { MapboxOverlay, type MapboxOverlayProps } from '@deck.gl/mapbox';
	import { getMapContext } from '../contexts.svelte.js';

	type Props = MapboxOverlayProps;

	let {
		// not reactive
		interleaved = false,
		id,
		debug,
		_typedArrayManagerProps,
		// reactive (?)
		style,
		useDevicePixels,
		parameters,
		layers,
		layerFilter,
		effects = [],
		_framebuffer,
		_animate,
		getCursor,
		getTooltip,
		pickingRadius,
		touchAction,
		eventRecognizerOptions,
		_pickable,
		onDeviceInitialized,
		onViewStateChange,
		onInteractionStateChange,
		onHover,
		onClick,
		onDragStart,
		onDrag,
		onDragEnd,
		onLoad,
		onResize,
		onBeforeRender,
		onAfterRender,
		onError,
		_onMetrics
	}: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let deckOverlay: MapboxOverlay;
	onMount(() => {
		const options: MapboxOverlayProps = Object.fromEntries(
			Object.entries({
				interleaved,
				id,
				debug,
				_typedArrayManagerProps,
				style,
				useDevicePixels,
				parameters,
				layers,
				layerFilter,
				effects,
				_framebuffer,
				_animate,
				getCursor,
				getTooltip,
				pickingRadius,
				touchAction,
				eventRecognizerOptions,
				_pickable,
				onDeviceInitialized,
				onViewStateChange,
				onInteractionStateChange,
				onHover,
				onClick,
				onDragStart,
				onDrag,
				onDragEnd,
				onLoad,
				onResize,
				onBeforeRender,
				onAfterRender,
				onError,
				_onMetrics

				// filter out undefined values
			}).filter(([, v]) => v !== undefined)
		);

		deckOverlay = new MapboxOverlay(options);

		mapCtx.map?.addControl(deckOverlay as maplibregl.IControl);
	});

	let firstRun = true;

	// collect all reactive prop changes and apply them in a single update
	let pendingChanges: MapboxOverlayProps = {};
	let changeTrigger = $state(0);

	function reactiveProp<K extends keyof MapboxOverlayProps>(name: K, value: MapboxOverlayProps[K]) {
		if (!firstRun) {
			pendingChanges[name] = value;
			untrack(() => (changeTrigger += 1));
		}
	}

	$effect(() => reactiveProp('style', style));
	$effect(() => reactiveProp('useDevicePixels', useDevicePixels));
	$effect(() => reactiveProp('parameters', parameters));
	$effect(() => reactiveProp('layers', layers));
	$effect(() => reactiveProp('layerFilter', layerFilter));
	$effect(() => reactiveProp('effects', effects));
	$effect(() => reactiveProp('_framebuffer', _framebuffer));
	$effect(() => reactiveProp('_animate', _animate));
	$effect(() => reactiveProp('getCursor', getCursor));
	$effect(() => reactiveProp('getTooltip', getTooltip));
	$effect(() => reactiveProp('pickingRadius', pickingRadius));
	$effect(() => reactiveProp('touchAction', touchAction));
	$effect(() => reactiveProp('eventRecognizerOptions', eventRecognizerOptions));
	$effect(() => reactiveProp('_pickable', _pickable));
	$effect(() => reactiveProp('onDeviceInitialized', onDeviceInitialized));
	$effect(() => reactiveProp('onViewStateChange', onViewStateChange));
	$effect(() => reactiveProp('onInteractionStateChange', onInteractionStateChange));
	$effect(() => reactiveProp('onHover', onHover));
	$effect(() => reactiveProp('onClick', onClick));
	$effect(() => reactiveProp('onDragStart', onDragStart));
	$effect(() => reactiveProp('onDrag', onDrag));
	$effect(() => reactiveProp('onDragEnd', onDragEnd));
	$effect(() => reactiveProp('onLoad', onLoad));
	$effect(() => reactiveProp('onResize', onResize));
	$effect(() => reactiveProp('onBeforeRender', onBeforeRender));
	$effect(() => reactiveProp('onAfterRender', onAfterRender));
	$effect(() => reactiveProp('onError', onError));
	$effect(() => reactiveProp('_onMetrics', _onMetrics));

	$effect(() => {
		firstRun = false;
	});

	$effect(() => {
		changeTrigger;
		if (!firstRun) {
			deckOverlay.setProps(pendingChanges);
			pendingChanges = {};
		}
	});

	onDestroy(() => {
		mapCtx.map?.removeControl(deckOverlay as maplibregl.IControl);
	});
</script>
