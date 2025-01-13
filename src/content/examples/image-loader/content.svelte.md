---
title: Load Images from URLs
description: Utility for loading images from URLs
original: https://maplibre.org/maplibre-gl-js/docs/examples/add-image-stretchable/
---

<script lang="ts">
  import Demo from "./Images.svelte";
  import demoRaw from "./Images.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
