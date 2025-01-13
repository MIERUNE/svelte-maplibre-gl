---
title: Canvas Source
description: Add a canvas source to the map.
original: https://maplibre.org/maplibre-gl-js/docs/examples/canvas-source/
---

<script lang="ts">
  import Demo from "./Canvas.svelte";
  import demoRaw from "./Canvas.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
