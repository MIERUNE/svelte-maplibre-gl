---
title: 3D Floor Plan
description: Create a 3D indoor map with the fill-extrude-height paint property.
original: https://maplibre.org/maplibre-gl-js/docs/examples/3d-extrusion-floorplan/
---

<script lang="ts">
  import Demo from "./Floorplan.svelte";
  import demoRaw from "./Floorplan.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
