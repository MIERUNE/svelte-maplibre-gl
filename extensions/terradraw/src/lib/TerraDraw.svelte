<script lang="ts">
	import { TerraDraw as Draw } from 'terra-draw';
	import type { IdStrategy, TerraDrawEventListeners } from 'terra-draw';
	import { getMapContext } from 'svelte-maplibre-gl';

	type FeatureId = string | number;

	const mapCtx = getMapContext();

	let {
		mode,
		modes,
		tracked,
		idStrategy,
		draw = $bindable(),
		onfinish,
		onchange,
		onready,
		onselect,
		ondeselect
	}: {
		mode: string;
		modes: ConstructorParameters<typeof Draw>[0]['modes'];
		idStrategy?: IdStrategy<FeatureId>;
		tracked?: boolean;
		/** Terra Draw instance */
		draw?: Draw;
		onchange?: TerraDrawEventListeners['change'];
		onfinish?: TerraDrawEventListeners['finish'];
		onready?: TerraDrawEventListeners['ready'];
		onselect?: TerraDrawEventListeners['select'];
		ondeselect?: TerraDrawEventListeners['deselect'];
	} = $props();

	mapCtx.waitForStyleLoaded(async (map) => {
		const { TerraDrawMapLibreGLAdapter } = await import('terra-draw-maplibre-gl-adapter');
		draw = new Draw({
			adapter: new TerraDrawMapLibreGLAdapter({ map }),
			modes,
			idStrategy,
			tracked
		});
	});

	$effect(() => {
		const instance = draw;
		if (!instance) return;
		instance.start();
		return () => instance.stop();
	});
	$effect(() => {
		draw?.setMode(mode);
	});

	// Event listeners
	$effect(() => {
		const instance = draw;
		if (!instance || !onready) return;
		instance.on('ready', onready);
		return () => instance.off('ready', onready);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !onfinish) return;
		instance.on('finish', onfinish);
		return () => instance.off('finish', onfinish);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !onchange) return;
		instance.on('change', onchange);
		return () => instance.off('change', onchange);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !onselect) return;
		instance.on('select', onselect);
		return () => instance.off('select', onselect);
	});
	$effect(() => {
		const instance = draw;
		if (!instance || !ondeselect) return;
		instance.on('deselect', ondeselect);
		return () => instance.off('deselect', ondeselect);
	});
</script>
