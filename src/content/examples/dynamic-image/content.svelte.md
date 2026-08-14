---
title: GPU-Animated Image
description: Render an animated icon directly into the style image atlas with a WebGL shader.
original: https://maplibre.org/maplibre-gl-js/docs/examples/animate-an-icon-on-the-gpu/
---

<script lang="ts">
  import Demo from "./DynamicImage.svelte";
  import demoRaw from "./DynamicImage.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
