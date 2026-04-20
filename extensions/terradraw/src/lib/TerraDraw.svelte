<script lang="ts">
	import {
		TerraDraw as Draw,
		TerraDrawModeUndoRedo,
		TerraDrawSessionUndoRedo,
		TerraDrawUndoRedoKeyboardShortcuts
	} from 'terra-draw';
	import type { IdStrategy, TerraDrawEventListeners } from 'terra-draw';
	import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
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

	mapCtx.waitForStyleLoaded((map) => {
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
		draw?.start();
		return () => draw?.stop();
	});
	$effect(() => {
		draw?.setMode(mode);
	});

	// Event listeners
	$effect(() => {
		if (!onready) return;
		draw?.on('ready', onready);
		return () => draw?.off('ready', onready);
	});
	$effect(() => {
		if (!onfinish) return;
		draw?.on('finish', onfinish);
		return () => draw?.off('finish', onfinish);
	});
	$effect(() => {
		if (!onchange) return;
		draw?.on('change', onchange);
		return () => draw?.off('change', onchange);
	});
	$effect(() => {
		if (!onselect) return;
		draw?.on('select', onselect);
		return () => draw?.off('select', onselect);
	});
	$effect(() => {
		if (!ondeselect) return;
		draw?.on('deselect', ondeselect);
		return () => draw?.off('deselect', ondeselect);
	});
</script>
