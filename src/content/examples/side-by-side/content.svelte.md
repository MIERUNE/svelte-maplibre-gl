---
title: Side by Side
description: Synchronize two maps.
original: https://visgl.github.io/react-map-gl/examples/side-by-side
---

<script lang="ts">
  import Demo from "./SideBySide.svelte";
  import demoRaw from "./SideBySide.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
    let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
