<script module>
	// TODO: Request terra-draw to export these types
	type FeatureId = string | number;
	type OnFinishContext = { mode: string; action: string };
	type IdStrategy<Id extends FeatureId> = {
		isValidId: (id: Id) => boolean;
		getId: () => Id;
	};
	type FinishListener = (id: FeatureId, context: OnFinishContext) => void;
	type ChangeListener = (ids: FeatureId[], type: string) => void;
	type SelectListener = (id: FeatureId) => void;
	type DeselectListener = () => void;
</script>

<script lang="ts">
	import { TerraDraw as Draw } from 'terra-draw';
	import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
	import { getMapContext } from 'svelte-maplibre-gl';

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
		onready?: () => void;
		onfinish?: FinishListener;
		onchange?: ChangeListener;
		onselect?: SelectListener;
		ondeselect?: DeselectListener;
	} = $props();

	draw = new Draw({
		adapter: new TerraDrawMapLibreGLAdapter({ map: mapCtx.map }),
		modes,
		idStrategy,
		tracked
	});

	$effect(() => {
		draw.start();
		return () => draw.stop();
	});
	$effect(() => {
		draw.setMode(mode);
	});

	// Event listeners
	$effect(() => {
		if (!onready) return;
		draw.on('ready', onready);
		return () => draw.off('ready', onready);
	});
	$effect(() => {
		if (!onfinish) return;
		draw.on('finish', onfinish);
		return () => draw.off('finish', onfinish);
	});
	$effect(() => {
		if (!onchange) return;
		draw.on('change', onchange);
		return () => draw.off('change', onchange);
	});
	$effect(() => {
		if (!onselect) return;
		draw.on('select', onselect);
		return () => draw.off('select', onselect);
	});
	$effect(() => {
		if (!ondeselect) return;
		draw.on('deselect', ondeselect);
		return () => draw.off('deselect', ondeselect);
	});
</script>
