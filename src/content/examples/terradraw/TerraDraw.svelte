<script lang="ts">
	import { MapLibre, GlobeControl } from 'svelte-maplibre-gl';
	import { TerraDraw, type UndoRedoOptions } from '@svelte-maplibre-gl/terradraw';
	import type { TerraDraw as Draw } from 'terra-draw';
	import {
		TerraDrawCircleMode,
		TerraDrawRectangleMode,
		TerraDrawFreehandMode,
		TerraDrawAngledRectangleMode,
		TerraDrawLineStringMode,
		TerraDrawPolygonMode,
		TerraDrawPointMode,
		TerraDrawSectorMode,
		TerraDrawSelectMode,
		TerraDrawSensorMode
	} from 'terra-draw';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import RotateCw from '@lucide/svelte/icons/rotate-cw';

	const defaultSelectFlags = {
		feature: {
			draggable: true,
			coordinates: {
				deletable: true,
				midpoints: true,
				draggable: true
			}
		}
	};
	const modes = [
		new TerraDrawSelectMode({
			flags: {
				point: defaultSelectFlags,
				linestring: defaultSelectFlags,
				polygon: defaultSelectFlags,
				freehand: defaultSelectFlags,
				circle: defaultSelectFlags,
				rectangle: defaultSelectFlags,
				sector: defaultSelectFlags,
				sensor: defaultSelectFlags,
				'angled-rectangle': defaultSelectFlags
			}
		}),
		new TerraDrawPointMode(),
		new TerraDrawLineStringMode(),
		new TerraDrawPolygonMode(),
		new TerraDrawCircleMode(),
		new TerraDrawSectorMode(),
		new TerraDrawSensorMode(),
		new TerraDrawRectangleMode(),
		new TerraDrawFreehandMode(),
		new TerraDrawAngledRectangleMode()
	];
	const modeNames = modes.map((mode) => mode.mode);
	let mode = $state('select');
	let selected: string | number | null = $state(null);
	let draw: Draw | undefined = $state.raw();
	let undoRedo: UndoRedoOptions = {
		keyboardShortcuts: {
			undo: [
				{
					key: 'z',
					heldKeys: ['meta'] // meta in Mac = ctrl in Windows
				}
			],
			redo: [
				{
					key: 'z',
					heldKeys: ['meta', 'shift'] // meta in Mac = ctrl in Windows
				}
			]
		}
	};
	let terraDrawUndoSize: number = $state(0);
	let terraDrawRedoSize: number = $state(0);

	$effect(() => {
		if (!draw) return;

		const handleHistory = ({ undoSize, redoSize }: { undoSize: number; redoSize: number }) => {
			terraDrawUndoSize = undoSize;
			terraDrawRedoSize = redoSize;
		};

		draw?.on('history', handleHistory);

		return () => {
			draw?.off('history', handleHistory);
		};
	});
</script>

<MapLibre
	class="h-[55vh] min-h-75"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={2}
	center={{ lng: 60, lat: 20 }}
>
	<!-- Terra Draw -->
	<TerraDraw
		{mode}
		{modes}
		bind:draw
		onselect={(featureId) => (selected = featureId)}
		ondeselect={() => (selected = null)}
		onfinish={() => (mode = 'select')}
		{undoRedo}
	/>

	<!-- Draw controls -->
	<div
		class="absolute top-3 left-3 z-10 flex flex-col items-stretch gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
		{#each modeNames as modeName (modeName)}
			<label><input type="radio" bind:group={mode} value={modeName} class="mr-1" /> {modeName}</label>
		{/each}
		{#if selected}
			<button
				class="mt-1 rounded border px-1"
				onclick={() => {
					if (!selected) return;
					draw?.removeFeatures([selected]);
					draw?.deselectFeature(selected);
				}}>Remove</button
			>
		{/if}
	</div>

	<!-- Undo Redo Controls -->
	{#if undoRedo}
		<div class="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex justify-center mx-auto">
			<div
				class="inline-flex items-center gap-1 rounded-lg border border-border/40 bg-background/80 p-1.5 backdrop-blur-sm"
			>
				<button
					onclick={() => draw?.undo()}
					class="inline-flex items-center gap-1.5 rounded-md border border-border/30 px-2.5 py-1.5 text-xs text-foreground transition-opacity hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
					disabled={terraDrawUndoSize === 0}
				>
					<RotateCcw class="w-3" />
					Undo
				</button>

				<button
					onclick={() => draw?.redo()}
					class="inline-flex items-center gap-1.5 rounded-md border border-border/30 px-2.5 py-1.5 text-xs text-foreground transition-opacity hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
					disabled={terraDrawRedoSize === 0}
				>
					Redo
					<RotateCw class="w-3" />
				</button>
			</div>
		</div>
	{/if}

	<GlobeControl />
</MapLibre>
