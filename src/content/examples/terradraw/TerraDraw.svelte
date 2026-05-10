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
		// Enable mode/session history with a bounded stack.
		modeLevel: { maxStackSize: 100 },
		sessionLevel: { maxStackSize: 100 },
		// Enable TerraDraw's default keyboard shortcuts.
		keyboardShortcuts: {}
	};
	let terraDrawUndoSize: number = $state(0);
	let terraDrawRedoSize: number = $state(0);
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
		onhistory={({ undoSize, redoSize }) => {
			terraDrawUndoSize = undoSize;
			terraDrawRedoSize = redoSize;
		}}
		{undoRedo}
	/>

	<!-- Draw controls -->
	<div
		role="group"
		aria-label="Draw controls"
		class="absolute top-3 left-3 z-10 flex flex-col items-stretch gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
			{#each modeNames as modeName (modeName)}
				<button
					type="button"
					aria-pressed={mode === modeName}
					class="inline-flex h-7 items-center justify-start rounded-md border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
					onclick={() => (mode = modeName)}
				>
					{modeName}
				</button>
			{/each}
		{#if selected}
			<button
				type="button"
				aria-label="Remove selected feature"
				class="mt-1 inline-flex h-7 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 px-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
				onclick={() => {
					if (!selected) return;
					draw?.removeFeatures([selected]);
						draw?.deselectFeature(selected);
					}}>Remove</button>
			{/if}
	</div>

	<!-- Undo Redo Controls -->
	{#if undoRedo}
		<div class="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex justify-center mx-auto">
			<div
				role="group"
				aria-label="Undo and redo controls"
				class="inline-flex items-center gap-1 rounded-lg border border-border/40 bg-background/80 p-1.5 backdrop-blur-sm"
			>
					<button
						type="button"
						onclick={() => draw?.undo()}
						class="inline-flex h-7 items-center justify-center gap-1 rounded-md border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
						disabled={terraDrawUndoSize === 0}
					>
						<RotateCcw class="w-3" />
						Undo
					</button>

					<button
						type="button"
						onclick={() => draw?.redo()}
						class="inline-flex h-7 items-center justify-center gap-1 rounded-md border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
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
