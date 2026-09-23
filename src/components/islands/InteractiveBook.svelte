<script lang="ts">
	/**
	 * Interactive Book — Astro/Svelte port of
	 * https://framer.com/m/InteractiveBook-xGXc.js@uLOYl8huI2w4XDdONaRK
	 * Leaf pairing, open-shift, z-offset, and rotateY timings match Framer.
	 * Scales to fit the container so open spreads stay usable from 320px up.
	 */
	export type BookPage = {
		title: string;
		items: string[];
		eyebrow?: string;
	};

	/** Framer default page size (2:3). */
	const DEFAULT_BOOK_WIDTH = 400;
	const DEFAULT_BOOK_HEIGHT = 600;
	const MIN_BOOK_WIDTH = 168;
	const PERSPECTIVE_PX = 2500;
	const OPEN_SHIFT_S = 0.6;
	const CLOSE_SHIFT_S = 0.8;
	const FLIP_OPEN_MS = 700;
	const FLIP_CLOSE_S = 0.5;
	const FLIP_OPEN_EASE = '0.7s cubic-bezier(0.4, 0, 0.2, 1)';
	const CLOSE_STAGGER_MS = 80;
	const FLIPPING_Z_INDEX = 100;
	const LEAF_Z_STEP_PX = 0.4;
	const SPINE_GRADIENT_WIDTH = '12%';

	let {
		pages,
		coverTitle = 'Skills',
		coverSubtitle = 'Click to open',
		backTitle = 'Thanks',
		backSubtitle = 'Click to close',
		width = DEFAULT_BOOK_WIDTH,
		height = DEFAULT_BOOK_HEIGHT,
		borderRadius = 10,
		shadowColor = '#000000',
		shadowOpacity = 0.4,
		shadowBlur = 10,
		shadowOffsetX = 5,
		shadowOffsetY = 5,
		shadowSpread = 0,
		class: className = '',
	}: {
		pages: BookPage[];
		coverTitle?: string;
		coverSubtitle?: string;
		backTitle?: string;
		backSubtitle?: string;
		width?: number;
		height?: number;
		borderRadius?: number;
		shadowColor?: string;
		shadowOpacity?: number;
		shadowBlur?: number;
		shadowOffsetX?: number;
		shadowOffsetY?: number;
		shadowSpread?: number;
		class?: string;
	} = $props();

	type Face =
		| { kind: 'cover' }
		| { kind: 'back' }
		| { kind: 'blank' }
		| { kind: 'page'; page: BookPage; index: number };

	const faces = $derived.by(() => {
		const list: Face[] = [{ kind: 'cover' }];
		for (let i = 0; i < pages.length; i++) {
			list.push({ kind: 'page', page: pages[i], index: i });
		}
		list.push({ kind: 'back' });
		if (list.length % 2 !== 0) list.push({ kind: 'blank' });
		return list;
	});

	const leafPairs = $derived.by(() => {
		const pairs: [Face, Face][] = [];
		for (let i = 0; i < faces.length; i += 2) {
			pairs.push([faces[i], faces[i + 1] ?? { kind: 'blank' }]);
		}
		return pairs;
	});

	const totalLeaves = $derived(leafPairs.length);
	const aspectRatio = $derived(height / width);

	let stageEl = $state<HTMLDivElement | null>(null);
	let containerWidth = $state(DEFAULT_BOOK_WIDTH);
	let flippedCount = $state(0);
	let isBookClosed = $state(true);
	let bookX = $state(0);
	let rotates = $state<number[]>([]);
	let leafEase = $state<'open' | 'close'>('open');
	let bookShiftDuration = $state(OPEN_SHIFT_S);

	/** Closed page width clamped to the stage; never below MIN_BOOK_WIDTH. */
	const bookW = $derived(
		Math.min(width, Math.max(MIN_BOOK_WIDTH, Math.floor(containerWidth || width))),
	);
	const bookH = $derived(Math.round(bookW * aspectRatio));
	/** When open, scale the whole book so a 2-page spread fits the stage. */
	const spreadScale = $derived(
		isBookClosed ? 1 : Math.min(1, containerWidth / Math.max(bookW * 2, 1)),
	);
	const stageMinHeight = $derived(Math.ceil(bookH * spreadScale));

	$effect(() => {
		const el = stageEl;
		if (!el || typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver((entries) => {
			const next = entries[0]?.contentRect.width;
			if (typeof next === 'number' && next > 0) containerWidth = next;
		});
		observer.observe(el);
		containerWidth = el.clientWidth || width;
		return () => observer.disconnect();
	});

	$effect(() => {
		const n = totalLeaves;
		if (rotates.length !== n) {
			rotates = Array.from({ length: n }, (_, i) => (i < flippedCount ? -180 : 0));
		}
	});

	/** Keep open shift in sync when the book resizes mid-session. */
	$effect(() => {
		if (!isBookClosed && flippedCount > 0) {
			bookX = bookW / 2;
		}
	});

	function hexToRgba(hex: string, alpha: number) {
		const raw = hex.replace('#', '');
		const full =
			raw.length === 3
				? raw
						.split('')
						.map((c) => c + c)
						.join('')
				: raw;
		const r = parseInt(full.slice(0, 2), 16);
		const g = parseInt(full.slice(2, 4), 16);
		const b = parseInt(full.slice(4, 6), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	const closedShadow = $derived(
		`${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${hexToRgba(shadowColor, shadowOpacity)}`,
	);

	function wait(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	function setRotate(index: number, value: number) {
		rotates = rotates.map((v, i) => (i === index ? value : v));
	}

	async function handleClick() {
		if (totalLeaves === 0) return;

		if (flippedCount === 0) {
			isBookClosed = false;
			bookShiftDuration = OPEN_SHIFT_S;
			bookX = bookW / 2;
		}

		if (flippedCount < totalLeaves) {
			leafEase = 'open';
			const indexToFlip = flippedCount;
			flippedCount += 1;
			setRotate(indexToFlip, -180);
			await wait(FLIP_OPEN_MS);
		} else {
			leafEase = 'close';
			bookShiftDuration = CLOSE_SHIFT_S;
			bookX = 0;
			for (let i = totalLeaves - 1; i >= 0; i--) {
				setRotate(i, 0);
				await wait(CLOSE_STAGGER_MS);
			}
			flippedCount = 0;
			isBookClosed = true;
		}
	}

	function leafZIndex(index: number) {
		const isFlipped = index < flippedCount;
		const isFlipping = index === flippedCount - 1 && flippedCount > 0;
		if (isFlipping) return FLIPPING_Z_INDEX;
		return isFlipped ? index : totalLeaves - index;
	}

	function leafZOffset(index: number) {
		const isFlipped = index < flippedCount;
		return (isFlipped ? index : totalLeaves - index) * LEAF_Z_STEP_PX;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			void handleClick();
		}
	}

	/** Scale face type/padding with book width so copy stays readable when shrunk. */
	const facePad = $derived(bookW < 280 ? 'p-4' : bookW < 340 ? 'p-5' : 'p-7');
	const coverPad = $derived(bookW < 280 ? 'p-5' : 'p-8');
	const coverTitleClass = $derived(
		bookW < 280
			? 'font-display text-[1.45rem] font-extrabold leading-none tracking-tight'
			: 'font-display text-[2.1rem] font-extrabold leading-none tracking-tight',
	);
	const pageTitleClass = $derived(
		bookW < 280
			? 'mb-3 font-display text-[1rem] font-bold leading-snug tracking-tight'
			: 'mb-4 font-display text-[1.2rem] font-bold leading-snug tracking-tight',
	);
	const itemClass = $derived(
		bookW < 280
			? 'rounded-[6px] border border-[rgb(20_33_43/0.12)] bg-[#eef3f5]/80 px-2 py-1 text-[0.68rem] font-medium leading-snug text-[#3a4a56]'
			: 'rounded-[6px] border border-[rgb(20_33_43/0.12)] bg-[#eef3f5]/80 px-2.5 py-1.5 text-[0.78rem] font-medium leading-snug text-[#3a4a56]',
	);
</script>

<div
	bind:this={stageEl}
	class="relative mx-auto w-full max-w-full overflow-x-clip overflow-y-visible {className}"
	style="min-height: {stageMinHeight}px;"
>
	<div
		class="relative mx-auto flex w-full items-center justify-center"
		style="min-height: {stageMinHeight}px; perspective: {PERSPECTIVE_PX}px; transform: scale({spreadScale}); transform-origin: center center; cursor: pointer;"
		role="button"
		tabindex="0"
		aria-label={isBookClosed
			? 'Open skills book'
			: flippedCount >= totalLeaves
				? 'Close skills book'
				: 'Turn page'}
		onclick={handleClick}
		onkeydown={onKeydown}
	>
		<div
			class="relative outline-none"
			style="width: {bookW}px; height: {bookH}px; position: relative; transform-style: preserve-3d; transform: translateX({bookX}px); transition: transform {bookShiftDuration}s ease-in-out, box-shadow 0.35s ease; box-shadow: {isBookClosed
				? closedShadow
				: '0px 0px 0px transparent'};"
		>
			{#each leafPairs as [front, back], index}
				<div
					class="absolute inset-0"
					style="transform-style: preserve-3d; transform-origin: left center; z-index: {leafZIndex(
						index,
					)}; transform: translateZ({leafZOffset(index)}px); will-change: transform;"
				>
					<div
						class="absolute inset-0"
						style="transform-style: preserve-3d; transform-origin: left center; transform: rotateY({rotates[
							index
						] ?? 0}deg); transition: transform {leafEase === 'close'
							? `${FLIP_CLOSE_S}s ease-in-out`
							: FLIP_OPEN_EASE}; will-change: transform;"
					>
						<div
							class="absolute inset-0 overflow-hidden"
							style="backface-visibility: hidden; -webkit-backface-visibility: hidden; background-color: transparent; border-radius: 0px {borderRadius}px {borderRadius}px 0px;"
						>
							{@render faceContent(front)}
							<span
								class="pointer-events-none absolute inset-y-0 left-0"
								style="width: {SPINE_GRADIENT_WIDTH}; background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);"
								aria-hidden="true"
							></span>
						</div>

						<div
							class="absolute inset-0 overflow-hidden"
							style="backface-visibility: hidden; -webkit-backface-visibility: hidden; background-color: transparent; transform: rotateY(180deg) translateZ(0.01px); border-radius: {borderRadius}px 0px 0px {borderRadius}px;"
						>
							{@render faceContent(back)}
							<span
								class="pointer-events-none absolute inset-y-0 right-0"
								style="width: {SPINE_GRADIENT_WIDTH}; background: linear-gradient(to right, rgba(0,0,0,0.1), transparent); transform: scaleX(-1);"
								aria-hidden="true"
							></span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

{#snippet faceContent(face: Face)}
	{#if face.kind === 'cover'}
		<div
			class="flex size-full flex-col justify-between text-hero {coverPad}"
			style="background: linear-gradient(145deg, #0f454c 0%, #1a6b73 48%, #14212b 100%);"
		>
			<p class="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foam/85">
				Stack
			</p>
			<div>
				<p class={coverTitleClass}>{coverTitle}</p>
				<p class="mt-3 max-w-[16rem] text-[0.85rem] leading-snug text-hero/75">
					{coverSubtitle}
				</p>
			</div>
			<p class="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-foam/70">
				Click to open →
			</p>
		</div>
	{:else if face.kind === 'back'}
		<div
			class="flex size-full flex-col justify-between text-hero {coverPad}"
			style="background: linear-gradient(145deg, #14212b 0%, #0f454c 100%);"
		>
			<p class="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foam/85">
				End
			</p>
			<div>
				<p class="font-display text-[1.5rem] font-extrabold tracking-tight min-[360px]:text-[1.75rem]">
					{backTitle}
				</p>
				<p class="mt-2 text-[0.85rem] text-hero/75">{backSubtitle}</p>
			</div>
			<p class="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-foam/70">
				Click to close
			</p>
		</div>
	{:else if face.kind === 'blank'}
		<div class="size-full bg-paper"></div>
	{:else}
		<div class="flex size-full flex-col bg-paper text-ink {facePad}">
			<p
				class="mb-1 font-mono text-[0.68rem] font-semibold tracking-wider text-sea tabular-nums"
			>
				{String(face.index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
			</p>
			{#if face.page.eyebrow}
				<p class="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-sea">
					{face.page.eyebrow}
				</p>
			{/if}
			<h3 class={pageTitleClass}>{face.page.title}</h3>
			<ul class="m-0 flex min-h-0 flex-1 list-none flex-col gap-1.5 overflow-auto p-0">
				{#each face.page.items as item}
					<li class={itemClass}>{item}</li>
				{/each}
			</ul>
		</div>
	{/if}
{/snippet}
