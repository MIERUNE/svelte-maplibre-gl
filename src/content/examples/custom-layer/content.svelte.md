---
title: Custom style layer
description: Use a custom style layer to render custom WebGL content.
original: https://maplibre.org/maplibre-gl-js/docs/examples/custom-style-layer/
---

<script lang="ts">
  import Demo from "./CustomLayer.svelte";
  import demoRaw from "./CustomLayer.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
