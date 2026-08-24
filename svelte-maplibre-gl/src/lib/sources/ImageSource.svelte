<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/ImageSource/
	// https://maplibre.org/maplibre-style-spec/sources/#image

	import type { Snippet } from 'svelte';
	import type * as maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';
	import RawSource from './RawSource.svelte';

	type ImageSourceWarp = 'auto' | 'perspective' | 'flat';
	type WarpableImageSource = {
		setWarp(warp: ImageSourceWarp): unknown;
	};

	interface Props extends Omit<maplibregl.ImageSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.ImageSource;
		warp?: ImageSourceWarp;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, warp, children, ...spec }: Props = $props();

	const mapCtx = getMapContext();

	function supportsWarp(source: unknown): source is WarpableImageSource {
		return typeof source === 'object' && source !== null && 'setWarp' in source && typeof source.setWarp === 'function';
	}

	$effect(() => {
		const map = mapCtx.map;
		const sourceId = source?.id;
		const nextWarp = warp ?? 'auto';
		if (!map || !sourceId) return;

		const applyWarp = () => {
			const currentSource = map.getSource(sourceId);
			if (supportsWarp(currentSource)) {
				currentSource.setWarp(nextWarp);
			}
		};

		applyWarp();
		map.on('style.load', applyWarp);
		return () => map.off('style.load', applyWarp);
	});
</script>

<RawSource {id} bind:source type="image" {...spec}>
	{@render children?.()}
</RawSource>
