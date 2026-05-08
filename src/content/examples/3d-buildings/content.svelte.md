---
title: 3D Buildings
description: Use extrusions to display buildings' height in 3D.
original: https://maplibre.org/maplibre-gl-js/docs/examples/display-buildings-in-3d/
---

<script lang="ts">
  import Demo from "./Buildings3D.svelte";
  import demoRaw from "./Buildings3D.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
