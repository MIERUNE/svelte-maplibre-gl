<script lang="ts">
	// import { browser } from '$app/environment';
	import type { HighlighterCore } from 'shiki';
	// import svelte from 'shiki/langs/svelte.mjs';
	// import dark from 'shiki/themes/github-dark-default.mjs';

	let {
		content,
		shiki
	}: {
		content: string;
		shiki: HighlighterCore;
	} = $props();

	const _content = $derived.by(() => {
		return content.replaceAll('\t', '  ').trim();
	});
</script>

<div class="my-6">
	<div class="line-numbers subpixel-antialiased">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html shiki.codeToHtml(_content, { lang: 'svelte', theme: 'github-dark-default' })}
	</div>
	<div class="-mt-3 text-right text-sm">
		Our examples use <a href="https://tailwindcss.com/">Tailwind CSS</a> and
		<a href="https://next.shadcn-svelte.com/">shadcn-svelte</a>.
	</div>
</div>

<style>
	:global(.line-numbers .shiki code) {
		font-size: 13px;
		tab-size: 2;
		counter-reset: step;
		counter-increment: step 0;
	}

	:global(.line-numbers .shiki code .line::before) {
		content: counter(step);
		counter-increment: step;
		width: 1em;
		margin-right: 2em;
		display: inline-block;
		text-align: right;
		color: rgba(115, 131, 148, 0.5);
	}
</style>
