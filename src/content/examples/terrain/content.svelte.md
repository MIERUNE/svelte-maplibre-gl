---
title: 3D Terrain and Sky
description: Show elevation in actual 3D with the sky.
original: https://maplibre.org/maplibre-gl-js/docs/examples/sky-fog-terrain/
---

<script lang="ts">
  import Demo from "./Terrain.svelte";
  import demoRaw from "./Terrain.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
