---
title: Terra Draw
description: Use Terra Draw to draw a geometry in various forms such as point, line or polygon on your map.
---

<script lang="ts">
  import Demo from "./TerraDraw.svelte";
  import demoRaw from "./TerraDraw.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
