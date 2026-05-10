---
title: Hover Styles
description: Use events, feature states, and a pointer-tracking popup to create a per feature hover effect.
original: https://maplibre.org/maplibre-gl-js/docs/examples/create-a-hover-effect/
---

<script lang="ts">
  import Demo from "./HoverStyles.svelte";
  import demoRaw from "./HoverStyles.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
