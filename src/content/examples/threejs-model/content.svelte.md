---
title: 3D model with three.js
description: Use a custom style layer with three.js to add a 3D model to the map.
original: https://maplibre.org/maplibre-gl-js/docs/examples/globe-3d-model/
---

<script lang="ts">
  import Demo from "./CustomLayer.svelte";
  import demoRaw from "./CustomLayer.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
