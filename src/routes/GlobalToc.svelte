<script lang="ts">
	import Index from '$lib/components/Index.svelte';
	import CloseIcon from 'lucide-svelte/icons/x';
	import { cn } from '$lib/utils';

	import { toc as docsToc } from '$content/docs/toc';
	import { toc as componentsToc } from '$content/components/toc';
	import { toc as examplesToc } from '$content/examples/toc';
	import { beforeNavigate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';

	let { open = $bindable() }: { open: boolean } = $props();

	beforeNavigate(() => {
		open = false;
	});

	$effect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<div
	id="global-toc"
	class={cn(
		`ease duration-400 fixed inset-0 z-50 bg-background/40 transition-all md:hidden`,
		open ? 'opacity-100 backdrop-blur-xs' : 'pointer-events-none opacity-0 backdrop-blur-0'
	)}
>
	<div class="absolute inset-0" aria-hidden="true" onmousedown={() => (open = false)}></div>
	<div
		class={cn(
			`ease duration-400 absolute inset-0 z-50 w-72 overflow-scroll bg-muted/90 transition-all md:hidden`,
			open ? 'translate-x-0 shadow-lg' : '-translate-x-full shadow-none'
		)}
	>
		<div class="sticky top-0 z-50 flex h-[72px] items-center justify-between bg-background px-4 leading-none">
			<h1 class="ml-3 text-lg font-bold">
				<span>Svelte MapLibre GL</span>
			</h1>
			<Button variant="outline" size="icon" title="Menu" onclick={() => (open = false)}>
				<CloseIcon class="size-6!"></CloseIcon>
			</Button>
		</div>
		<div class="p-8 pb-0">
			<Index name="Docs" toc={docsToc}></Index>
		</div>
		<div class="p-8 pb-0">
			<Index name="Examples" toc={examplesToc}></Index>
		</div>
		<div class="p-8 pb-0">
			<Index name="API Reference" toc={componentsToc}></Index>
		</div>
	</div>
</div>
