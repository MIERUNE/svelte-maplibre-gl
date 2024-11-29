---
title: Hover Styles
description: Use events and feature states to create a per feature hover effect.
---

<script lang="ts">
  import Demo from "./HoverStyles.svelte";
  import demoRaw from "./HoverStyles.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
    let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
