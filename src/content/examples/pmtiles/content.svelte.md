---
title: PMTiles Protocol
description: Uses the PMTiles plugin and protocol to present a map.
original: https://maplibre.org/maplibre-gl-js/docs/examples/pmtiles/
---

<script lang="ts">
  import Demo from "./PMTiles.svelte";
  import demoRaw from "./PMTiles.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
