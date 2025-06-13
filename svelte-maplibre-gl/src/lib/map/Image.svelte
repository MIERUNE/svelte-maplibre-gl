<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addimage

	import { onDestroy, untrack } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	interface Props {
		id: string;
		image:
			| HTMLImageElement
			| ImageBitmap
			| ImageData
			| { width: number; height: number; data: Uint8Array | Uint8ClampedArray }
			| maplibregl.StyleImageInterface;
		options?: Partial<maplibregl.StyleImageMetadata>;
	}

	let { id, image: srcImage, options }: Props = $props();

	const mapCtx = getMapContext();
	let prevId = id;
	let firstRun = true;

	$effect(() => {
		if (!mapCtx.map) {
			return;
		}

		// Remove previous image if id or dimensions have changed
		let prevImage: maplibregl.StyleImage | undefined = mapCtx.map.getImage(prevId);
		if (
			prevImage &&
			(id !== prevId || srcImage.width !== prevImage.data.width || srcImage.height !== prevImage.data.height)
		) {
			mapCtx.map?.removeImage(prevId);
			prevId = id;
		}

		if (!prevImage) {
			mapCtx.map.addImage(
				id,
				srcImage,
				untrack(() => options)
			);
			firstRun = true;
		} else {
			mapCtx.map.updateImage(id, srcImage);
		}
	});

	$effect(() => {
		options;
		if (!firstRun) {
			const image = mapCtx.map?.getImage(id);
			if (!image) {
				return;
			}
			image.pixelRatio = options?.pixelRatio ?? 1;
			image.sdf = options?.sdf ?? false;
			image.stretchX = options?.stretchX;
			image.stretchY = options?.stretchY;
			image.content = options?.content;
			image.textFitWidth = options?.textFitWidth;
			image.textFitHeight = options?.textFitHeight;
			mapCtx.map?.style.updateImage(id, image);
		}
	});

	$effect(() => {
		firstRun = false;
	});

	onDestroy(() => {
		mapCtx.map?.removeImage(id);
	});
</script>
