<script lang="ts">
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
</script>

<MapLibre
	zoom={5}
	center={[142, 43]}
	class="h-[400px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
>
	<Marker lnglat={[141.692222, 42.775]} />
</MapLibre>
