---
title: Contour Lines
description: Render contour lines from a raster DEM source using maplibre-contour
original: https://maplibre.org/maplibre-gl-js/docs/examples/contour-lines/
---

<script lang="ts">
  import Demo from "./Contour.svelte";
  import demoRaw from "./Contour.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
