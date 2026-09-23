<script lang="ts">
	/**
	 * Liquid Glass Carousel — Astro/Svelte port of
	 * https://framer.com/m/liquid-glass-carousel-SkrkTr.js@kpCFFax8ciLkuLf0kMrs
	 * (Three.js glass lens + horizontal panels — no React / Framer.)
	 */
	import { onDestroy, onMount } from 'svelte';
	import {
		createLiquidGlassCarousel,
		DEFAULT_CONFIG,
		type LiquidGlassCarouselConfig,
		type LiquidGlassCarouselHandle,
		type LiquidGlassProject,
	} from '../../lib/carousel/liquidGlassEngine';

	let {
		projects,
		config = {},
		showLabels = true,
		showCursor = true,
		class: className = '',
	}: {
		projects: LiquidGlassProject[];
		config?: Partial<LiquidGlassCarouselConfig>;
		showLabels?: boolean;
		showCursor?: boolean;
		class?: string;
	} = $props();

	let mountEl: HTMLDivElement | undefined = $state();
	let cursorEl: HTMLDivElement | undefined = $state();
	let active = $state(0);
	let focused = $state(false);
	let entryDone = $state(true);
	let initError = $state<string | null>(null);
	let canHover = $state(true);

	const merged = $derived({ ...DEFAULT_CONFIG, ...config });
	const current = $derived(
		projects[active] ?? { brand: `Project ${active + 1}`, description: '' },
	);
	const total = $derived(Math.max(projects.length, 1));

	let handle: LiquidGlassCarouselHandle | null = null;
	let mediaCleanup: (() => void) | null = null;

	function closeFocus() {
		handle?.closeFocus();
	}

	onMount(() => {
		entryDone = !(config.entryAnimation ?? DEFAULT_CONFIG.entryAnimation);

		if (typeof window !== 'undefined' && window.matchMedia) {
			const media = window.matchMedia('(hover: hover) and (pointer: fine)');
			const update = () => {
				canHover = media.matches;
			};
			update();
			media.addEventListener?.('change', update);
			mediaCleanup = () => media.removeEventListener?.('change', update);
		}

		if (!mountEl) return;

		try {
			handle = createLiquidGlassCarousel(mountEl, {
				projects,
				getConfig: () => ({ ...DEFAULT_CONFIG, ...config }),
				cursorElement: showCursor && canHover ? cursorEl : null,
				onActiveChange: (i) => {
					active = i;
				},
				onFocusChange: (v) => {
					focused = v;
				},
				onEntryDone: (done) => {
					entryDone = done;
				},
			});
		} catch (error) {
			console.error('LiquidGlassCarousel failed to initialize', error);
			initError = 'The carousel could not initialize its graphics engine.';
			entryDone = true;
		}

		return () => {
			mediaCleanup?.();
			mediaCleanup = null;
			try {
				handle?.destroy();
			} catch (error) {
				console.error('LiquidGlassCarousel destroy failed', error);
			}
			handle = null;
		};
	});

	onDestroy(() => {
		mediaCleanup?.();
		try {
			handle?.destroy();
		} catch {
			/* ignore */
		}
		handle = null;
	});
</script>

<div
	class="relative h-full w-full overflow-hidden touch-none {className}"
	style="background: {merged.background}; color: {merged.foreground};"
	role="region"
	aria-roledescription="carousel"
	aria-label="Features carousel"
>
	{#if initError}
		<p class="grid size-full place-items-center p-8 text-center" role="status">{initError}</p>
	{:else}
		<div bind:this={mountEl} class="absolute inset-0 touch-none"></div>

		{#if showLabels}
			<div
				class="pointer-events-none absolute left-1/2 top-[10%] w-[min(92vw,32.5rem)] -translate-x-1/2 px-3 text-center transition duration-500 {entryDone
					? 'opacity-100'
					: 'opacity-0'}"
				style="transform: translate(-50%, {focused
					? '-4vh'
					: '0'}); mix-blend-mode: exclusion; color: #fff;"
			>
				<p class="m-0 font-display text-[clamp(1.25rem,3vw,1.75rem)] font-semibold tracking-tight">
					{current.brand}
				</p>
				{#if current.description}
					<p class="mt-1 m-0 text-sm opacity-90">{current.description}</p>
				{/if}
			</div>

			<div
				class="pointer-events-none absolute bottom-[10%] left-1/2 -translate-x-1/2 font-mono text-sm tabular-nums transition-opacity duration-500 {entryDone &&
				!focused
					? 'opacity-100'
					: 'opacity-0'}"
				style="mix-blend-mode: exclusion; color: #fff;"
			>
				{String(active + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
			</div>
		{/if}

		{#if showCursor && canHover}
			<div
				bind:this={cursorEl}
				class="pointer-events-none absolute left-0 top-0 z-4 whitespace-nowrap"
				style="mix-blend-mode: exclusion; color: #fff; will-change: transform;"
				aria-hidden="true"
			>
				View
			</div>
		{/if}

		<button
			type="button"
			aria-label="Close focused project"
			class="absolute right-[4vw] top-[2vh] z-5 border-0 bg-transparent p-0 font-semibold transition-opacity duration-300"
			style="mix-blend-mode: exclusion; color: #fff; opacity: {focused
				? 1
				: 0}; pointer-events: {focused ? 'auto' : 'none'};"
			onclick={closeFocus}
		>
			Close
		</button>
	{/if}
</div>
