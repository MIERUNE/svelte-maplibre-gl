---
title: 3D Buildings
description: Use extrusions with rounded corners to display buildings' height in 3D.
original: https://maplibre.org/maplibre-gl-js/docs/examples/display-buildings-in-3d/
---

<script lang="ts">
  import Demo from "./Buildings3D.svelte";
  import demoRaw from "./Buildings3D.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

Rounded corners require MapLibre GL JS 6.2 or later.

<Demo />

<CodeBlock content={demoRaw} {shiki} />
