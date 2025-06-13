<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import { getMapContext } from '../contexts.svelte.js';
	import maplibregl from 'maplibre-gl';

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let {
		images,
		loading = $bindable(),
		children
	}: {
		images: Record<string, string | [string, Partial<maplibregl.StyleImageMetadata>]>;
		loading?: boolean;
		children?: Snippet;
	} = $props();

	let initialLoaded = $state(false);

	// map from loaded image id to url
	const loadedImages: Map<string, string> = new Map();

	$effect(() => {
		// Remove images that are not in the new list or have a different url
		for (const [id, url] of loadedImages) {
			const src = images[id];
			if (src) {
				const newUrl = Array.isArray(src) ? src[0] : src;
				if (url === newUrl) {
					continue;
				} else {
					loadedImages.delete(id);
				}
			} else {
				loadedImages.delete(id);
				mapCtx.map?.removeImage(id);
			}
		}

		// Load and add images that are not already loaded
		const tasks = [];
		for (const [id, src] of Object.entries(images)) {
			// if already loaded
			if (loadedImages.has(id)) {
				// Update image options if necessary
				const image = mapCtx.map?.getImage(id);
				if (image) {
					const _src = $state.snapshot(src) as string | [string, Partial<maplibregl.StyleImageMetadata>];
					const options = Array.isArray(_src) ? _src[1] : {};
					let changed = false;
					if (image.pixelRatio !== (options.pixelRatio ?? 1)) {
						image.pixelRatio = options.pixelRatio ?? 1;
						changed = true;
					}
					if (image.sdf !== (options.sdf ?? false)) {
						image.sdf = options.sdf ?? false;
						changed = true;
					}
					if (image.stretchX !== options.stretchX) {
						image.stretchX = options.stretchX;
						changed = true;
					}
					if (image.stretchY !== options.stretchY) {
						image.stretchY = options.stretchY;
						changed = true;
					}
					if (image.content !== options.content) {
						image.content = options.content;
						changed = true;
					}
					if (image.textFitHeight !== options.textFitHeight) {
						image.textFitHeight = options.textFitHeight;
						changed = true;
					}
					if (image.textFitWidth !== options.textFitWidth) {
						image.textFitWidth = options.textFitWidth;
						changed = true;
					}

					if (changed) {
						mapCtx.map?.style.updateImage(id, image);
					}
				}

				continue;
			}

			const [url, options] = Array.isArray(src) ? src : [src, undefined];
			loadedImages.set(id, url);
			tasks.push(
				(async () => {
					const image = await mapCtx.map?.loadImage(url);
					if (mapCtx.map?.getImage(id)) {
						mapCtx.map?.removeImage(id);
					}
					if (image && loadedImages.has(id)) {
						mapCtx.map?.addImage(id, image?.data, options);
					}
				})()
			);
		}

		if (tasks.length > 0) {
			loading = true;
			Promise.allSettled([tasks]).then((results) => {
				const failures = results.filter((r) => r.status === 'rejected');
				if (failures.length > 0) {
					console.error(`${failures.length} images failed to load:`, failures);
				}
				initialLoaded = true;
				loading = false;
			});
		} else {
			initialLoaded = true;
		}
	});

	onDestroy(() => {
		for (const id of loadedImages.keys()) {
			mapCtx.map?.removeImage(id);
		}
	});
</script>

{#if initialLoaded}
	{@render children?.()}
{/if}
