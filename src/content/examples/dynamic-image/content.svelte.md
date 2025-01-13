---
title: Dynamic Image
description: Add an icon to the map that was generated at runtime.
original: https://maplibre.org/maplibre-gl-js/docs/examples/add-image-generated/
---

<script lang="ts">
  import Demo from "./DynamicImage.svelte";
  import demoRaw from "./DynamicImage.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
