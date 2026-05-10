<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/interfaces/IControl/

	import type { Snippet } from 'svelte';
	import type * as maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	interface Props {
		position?: maplibregl.ControlPosition;
		control?: maplibregl.IControl;
		group?: boolean;
		class?: string;
		children?: Snippet;
	}
	let { position, control: givenControl, class: className, group = true, children }: Props = $props();
	const hasGivenControl = $derived.by(() => {
		if (!givenControl && !children) throw new Error('You must provide either control or children.');
		return !!givenControl;
	});

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let el: HTMLDivElement | undefined = $state();

	let control = $derived.by(() => {
		if (hasGivenControl) {
			return givenControl;
		}

		return {
			onAdd: () => {
				return el!;
			},
			onRemove: () => {
				el?.parentNode?.removeChild(el);
			}
		};
	});

	$effect(() => {
		if (control) {
			mapCtx.map?.addControl(control, position);
		}
		return () => {
			control && mapCtx.map?.removeControl(control);
		};
	});
</script>

{#if !hasGivenControl}
	<div bind:this={el} class={`maplibregl-ctrl ${className}`} class:maplibregl-ctrl-group={group}>
		{@render children?.()}
	</div>
{/if}
