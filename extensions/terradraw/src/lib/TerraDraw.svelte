<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		TerraDraw as Draw,
		TerraDrawModeUndoRedo,
		TerraDrawSessionUndoRedo,
		TerraDrawUndoRedoKeyboardShortcuts
	} from 'terra-draw';
	import type { IdStrategy, TerraDrawEventListeners } from 'terra-draw';
	import { getMapContext } from 'svelte-maplibre-gl';
	import type { UndoRedoOptions } from '$lib/types';

	type FeatureId = string | number;

	const mapCtx = getMapContext();

	let {
		mode,
		modes,
		tracked,
		idStrategy,
		draw = $bindable(),
		undoRedo,
		onfinish,
		onchange,
		onready,
		onselect,
		ondeselect
	}: {
		mode: string;
		modes: ConstructorParameters<typeof Draw>[0]['modes'];
		idStrategy?: IdStrategy<FeatureId>;
		tracked?: boolean;
		/** Terra Draw instance */
		draw?: Draw;
		undoRedo?: UndoRedoOptions;
		onchange?: TerraDrawEventListeners['change'];
		onfinish?: TerraDrawEventListeners['finish'];
		onready?: TerraDrawEventListeners['ready'];
		onselect?: TerraDrawEventListeners['select'];
		ondeselect?: TerraDrawEventListeners['deselect'];
	} = $props();

	let destroyed = false;
	onDestroy(() => {
		destroyed = true;
	});

	mapCtx.waitForStyleLoaded(async (map) => {
		const { TerraDrawMapLibreGLAdapter } = await import('terra-draw-maplibre-gl-adapter');
		if (destroyed) return;
		draw = new Draw({
			adapter: new TerraDrawMapLibreGLAdapter({ map }),
			modes,
			idStrategy,
			tracked,
			undoRedo: undoRedo
				? {
						modeLevel: new TerraDrawModeUndoRedo({
							maxStackSize: undoRedo?.modeLevel?.maxStackSize ?? 100
						}),
						sessionLevel: new TerraDrawSessionUndoRedo({
							maxStackSize: undoRedo?.sessionLevel?.maxStackSize ?? 100
						}),
						keyboardShortcuts: undoRedo.keyboardShortcuts
							? new TerraDrawUndoRedoKeyboardShortcuts({
									undo: undoRedo.keyboardShortcuts.undo,
									redo: undoRedo.keyboardShortcuts.redo
								})
							: undefined
					}
				: undefined
		});
	});

	$effect(() => {
		const instance = draw;
		if (!instance) return;
		instance.start();
		return () => instance.stop();
	});
	$effect(() => {
		draw?.setMode(mode);
	});

	// Event listeners
	$effect(() => {
		const instance = draw;
		if (!instance || !onready) return;
		instance.on('ready', onready);
		return () => instance.off('ready', onready);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !onfinish) return;
		instance.on('finish', onfinish);
		return () => instance.off('finish', onfinish);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !onchange) return;
		instance.on('change', onchange);
		return () => instance.off('change', onchange);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !onselect) return;
		instance.on('select', onselect);
		return () => instance.off('select', onselect);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !ondeselect) return;
		instance.on('deselect', ondeselect);
		return () => instance.off('deselect', ondeselect);
	});
</script>
