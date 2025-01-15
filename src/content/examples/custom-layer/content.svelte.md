---
title: Custom Layer
description: Use a custom layer to draw simple WebGL content.
original: https://maplibre.org/maplibre-gl-js/docs/examples/globe-custom-simple/
---

<script lang="ts">
  import Demo from "./CustomLayer.svelte";
  import demoRaw from "./CustomLayer.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
