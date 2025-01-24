<script lang="ts">
	import { MapLibre, Projection } from 'svelte-maplibre-gl';

	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';

	let center = $state({ lng: 137, lat: 36.5 });
	let zoom = $state(4);
	let bearing = $state(0);
	let pitch = $state(0);
	let roll: number | undefined = $state(undefined);
	let elevation: number | undefined = $state(undefined);

	const MODES = ['Side by Side', 'Split', 'Scope'] as const;
	type Modes = (typeof MODES)[number];

	let splitMode: Modes = $state('Side by Side');
	let width = $state(0);
	let globe = $state(false);
	let point = $state({ x: 100, y: 100 });

	export const ro = (node: Element) => {
		const ro = new ResizeObserver(([entry]) => (width = entry.contentRect.width));
		ro.observe(node);
		return { destroy: () => ro.disconnect() };
	};
</script>

<div class="mb-3 flex items-center justify-between">
	<RadioGroup.Root bind:value={splitMode} class="flex flex-row gap-x-3">
		{#each MODES as mode}
			<div class="flex items-center space-x-1">
				<RadioGroup.Item value={mode} id={mode} />
				<Label for={mode}>{mode}</Label>
			</div>
		{/each}
	</RadioGroup.Root>
	<div class="flex items-center space-x-2">
		<Switch id="globe" bind:checked={globe} />
		<Label for="globe">Globe</Label>
	</div>
</div>

<div
	class="relative flex h-[55vh] min-h-[300px] flex-row-reverse"
	use:ro
	role="application"
	onmousemove={(ev) => (point = { x: ev.offsetX, y: ev.offsetY })}
>
	<MapLibre
		class="flex-1"
		style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
		bind:center
		bind:zoom
		bind:bearing
		bind:pitch
		bind:roll
		bind:elevation
		padding={splitMode === 'Split' ? { left: 0, right: width / 2, top: 0, bottom: 0 } : undefined}
	>
		<Projection type={globe ? 'globe' : undefined} />
	</MapLibre>
	<MapLibre
		class={splitMode === 'Scope' ? 'absolute! inset-0' : 'flex-1'}
		style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
		inlineStyle={splitMode === 'Scope' ? `clip-path: circle(15% at ${point.x}px ${point.y}px);` : undefined}
		bind:center
		bind:zoom
		bind:bearing
		bind:pitch
		bind:roll
		bind:elevation
		attributionControl={false}
		padding={splitMode === 'Split' ? { left: width / 2, right: 0, top: 0, bottom: 0 } : undefined}
	>
		<Projection type={globe ? 'globe' : undefined} />
	</MapLibre>
</div>
