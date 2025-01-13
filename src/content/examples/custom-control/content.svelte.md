---
title: Custom Control
description: Easily create user-defined controls with a native look and feel.
---

<script lang="ts">
  import Demo from "./CustomControl.svelte";
  import demoRaw from "./CustomControl.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
