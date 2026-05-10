<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/sprite/

	import { getMapContext } from '../contexts.svelte.js';

	interface Props {
		id: string;
		url: string;
	}
	let { id, url }: Props = $props();

	const mapCtx = getMapContext();

	$effect(() => {
		if (!mapCtx.map) {
			return;
		}
		// Capture at effect-run time so the cleanup removes the sprite under
		// the id that was actually added, even if `id` changes before cleanup.
		const addedId = id;
		const addedUrl = url;
		mapCtx.waitForStyleLoaded((map) => {
			map.addSprite(addedId, addedUrl);
		});

		return () => {
			mapCtx.waitForStyleLoaded((map) => {
				map.removeSprite(addedId);
			});
		};
	});
</script>
