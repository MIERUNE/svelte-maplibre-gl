<script lang="ts">
	import 'svelte-maplibre-gl/vite';
	import type { IControl, StyleSpecification } from 'maplibre-gl';
	import { CustomControl, MapLibre } from 'svelte-maplibre-gl';

	function makeControl(label: string): IControl {
		let el: HTMLDivElement | undefined;
		return {
			onAdd: () => {
				el = document.createElement('div');
				el.className = 'maplibregl-ctrl maplibregl-ctrl-group';
				el.dataset.testid = `custom-control-${label}`;
				el.textContent = label;
				return el;
			},
			onRemove: () => {
				el?.parentNode?.removeChild(el);
				el = undefined;
			}
		};
	}

	const first = makeControl('a');
	const second = makeControl('b');
	let control = $state<IControl>(first);

	const style = {
		version: 8,
		sources: {},
		layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;
</script>

<button type="button" data-testid="swap-custom-control" onclick={() => (control = second)}>
	Swap custom control
</button>

<MapLibre {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<CustomControl {control} />
</MapLibre>
