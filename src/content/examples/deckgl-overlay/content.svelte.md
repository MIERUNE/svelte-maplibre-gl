---
title: deck.gl Overlay
description: Interleaving deck.gl with MapLibre layers
original: https://deck.gl/gallery/maplibre-overlay
---

<script lang="ts">
  import Demo from "./DeckGL.svelte";
  import demoRaw from "./DeckGL.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
