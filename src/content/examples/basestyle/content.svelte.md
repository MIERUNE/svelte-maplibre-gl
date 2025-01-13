---
title: Change Base Style
description: This library efficiently preserves dynamic user contents even when the base style changes.
---

<script lang="ts">
  import Demo from "./BaseStyle.svelte";
  import demoRaw from "./BaseStyle.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
