---
title: Limit Map Interactions
description: Set the zoom/pitch range and toggle UI handlers on the map.
original: https://maplibre.org/maplibre-gl-js/docs/examples/toggle-interactions/
---

<script lang="ts">
  import Demo from "./LimitInteraction.svelte";
  import demoRaw from "./LimitInteraction.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
