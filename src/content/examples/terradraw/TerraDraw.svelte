<script lang="ts">
	import { MapLibre, GlobeControl } from 'svelte-maplibre-gl';
	import { TerraDraw } from '@svelte-maplibre-gl/terradraw';
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
	let undoRedo: boolean = $state(true);
	let terraDrawUndoSize: number = $state(0);
	let terradrawRedoSize: number = $state(0);

	$effect(() => {
		if (draw) {
			draw.on('history', ({ undoSize, redoSize }) => {
				terraDrawUndoSize = undoSize;
				terradrawRedoSize = redoSize;
			});
		}
	});
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
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
		<div class="absolute top-3 left-0 right-0 z-10 flex justify-center">
			<div
				class="inline-flex items-center gap-1 rounded-lg border border-border/40 bg-background/80 p-1.5 backdrop-blur-sm"
			>
				<button
					onclick={() => draw?.undo()}
					class="inline-flex items-center gap-1.5 rounded-md border border-border/30 px-2.5 py-1.5 text-xs text-foreground transition-opacity hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
					disabled={terraDrawUndoSize === 0}
				>
					<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
						<path
							d="M2 8a6 6 0 1 0 6-6 6 6 0 0 0-4.24 1.76L2 2"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path
							d="M2 2v3.5H5.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Undo
				</button>

				<button
					onclick={() => draw?.redo()}
					class="inline-flex items-center gap-1.5 rounded-md border border-border/30 px-2.5 py-1.5 text-xs text-foreground transition-opacity hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
					disabled={terradrawRedoSize === 0}
				>
					Redo
					<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
						<path
							d="M14 8a6 6 0 1 1-6-6 6 6 0 0 1 4.24 1.76L14 2"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path
							d="M14 2v3.5H10.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<GlobeControl />
</MapLibre>
