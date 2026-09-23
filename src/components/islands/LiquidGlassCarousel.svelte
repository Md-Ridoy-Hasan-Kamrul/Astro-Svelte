<script lang="ts">
	/**
	 * Liquid Glass Carousel — Astro/Svelte port of
	 * https://framer.com/m/liquid-glass-carousel-SkrkTr.js@kpCFFax8ciLkuLf0kMrs
	 * (Three.js glass lens + horizontal panels — no React / Framer.)
	 */
	import { onMount } from 'svelte';
	import {
		createLiquidGlassCarousel,
		DEFAULT_CONFIG,
		type LiquidGlassCarouselConfig,
		type LiquidGlassCarouselHandle,
		type LiquidGlassProject,
	} from '../../lib/carousel/liquidGlassEngine';
	import { getListViewState } from '../../lib/query/queryUi';
	import AsyncStatus from '../ui/AsyncStatus.svelte';

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
	let booting = $state(true);
	let canHover = $state(true);

	const listState = $derived(getListViewState(projects));
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

	function bindHoverMedia() {
		mediaCleanup?.();
		mediaCleanup = null;
		if (typeof window === 'undefined' || !window.matchMedia) return;
		const media = window.matchMedia('(hover: hover) and (pointer: fine)');
		const update = () => {
			canHover = media.matches;
		};
		update();
		media.addEventListener?.('change', update);
		mediaCleanup = () => media.removeEventListener?.('change', update);
	}

	function destroyHandle() {
		try {
			handle?.destroy();
		} catch (error) {
			console.error('LiquidGlassCarousel destroy failed', error);
		}
		handle = null;
	}

	function startEngine() {
		if (!mountEl || listState === 'empty') {
			booting = listState !== 'empty';
			return;
		}

		destroyHandle();
		booting = true;
		initError = null;
		entryDone = !(config.entryAnimation ?? DEFAULT_CONFIG.entryAnimation);
		bindHoverMedia();

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
			booting = false;
		} catch (error) {
			console.error('LiquidGlassCarousel failed to initialize', error);
			initError = 'The carousel could not initialize its graphics engine.';
			entryDone = true;
			booting = false;
		}
	}

	function retryInit() {
		initError = null;
		booting = true;
		queueMicrotask(startEngine);
	}

	onMount(() => {
		if (listState === 'empty') {
			booting = false;
			return;
		}

		let cancelled = false;
		let tries = 0;

		const waitForMount = () => {
			if (cancelled) return;
			if (!mountEl) {
				tries += 1;
				if (tries < 120) requestAnimationFrame(waitForMount);
				else {
					initError = 'The carousel mount node never became ready.';
					booting = false;
				}
				return;
			}
			startEngine();
		};

		requestAnimationFrame(waitForMount);

		return () => {
			cancelled = true;
			mediaCleanup?.();
			mediaCleanup = null;
			destroyHandle();
		};
	});
</script>

<div
	class="relative h-full w-full overflow-hidden touch-none {className}"
	style="background: {merged.background}; color: {merged.foreground};"
	role="region"
	aria-roledescription="carousel"
	aria-label="Features carousel"
	aria-busy={booting || undefined}
>
	{#if listState === 'empty'}
		<div class="grid size-full place-items-center p-6">
			<AsyncStatus
				tone="neutral"
				title="No projects yet"
				description="Add feature cards to populate the glass carousel."
			/>
		</div>
	{:else if initError}
		<div class="grid size-full place-items-center p-6">
			<AsyncStatus
				tone="danger"
				title="Carousel unavailable"
				description={initError}
				actionLabel="Try again"
				onAction={retryInit}
			/>
		</div>
	{:else}
		{#if booting}
			<div class="pointer-events-none absolute inset-0 z-2 grid place-items-center p-6">
				<AsyncStatus tone="info" title="Loading carousel…" busy />
			</div>
		{/if}

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
