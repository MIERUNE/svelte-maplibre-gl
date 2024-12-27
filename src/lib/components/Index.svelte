<script lang="ts">
	import { page } from '$app/state';
	import type { Toc } from './types';
	let { name, toc }: { name: string; toc: Toc } = $props();
</script>

<nav>
	<h2 class="mb-4 text-lg font-bold">{name}</h2>
	{#each toc as subtoc}
		<h3 class="my-3">{subtoc.title}</h3>
		<ul class="flex flex-col text-sm">
			{#each Object.entries(subtoc.items) as [path, title]}
				<li
					class="border-l border-foreground/10 py-1 pl-4 data-[active=true]:border-foreground"
					data-active={page.url.pathname === path}
				>
					<a class="data-[active=true]:font-medium" data-active={page.url.pathname === path} href={path}>{title}</a>
				</li>
			{/each}
		</ul>
	{/each}
</nav>
