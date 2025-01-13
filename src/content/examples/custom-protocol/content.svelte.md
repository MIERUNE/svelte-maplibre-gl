---
title: Custom Protocols
description: Add a custom resource loading function to handle a custom URL scheme.
---

<script lang="ts">
  import Demo from "./CustomProtocol.svelte";
  import demoRaw from "./CustomProtocol.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
