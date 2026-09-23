<script lang="ts">
	/**
	 * Interactive Book — Astro/Svelte port of
	 * https://framer.com/m/InteractiveBook-xGXc.js@uLOYl8huI2w4XDdONaRK
	 * Leaf pairing, open-shift, z-offset, and rotateY timings match Framer.
	 */
	export type BookPage = {
		title: string;
		items: string[];
		eyebrow?: string;
	};

	let {
		pages,
		coverTitle = 'Skills',
		coverSubtitle = 'Click to open',
		backTitle = 'Thanks',
		backSubtitle = 'Click to close',
		width = 400,
		height = 600,
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

	let flippedCount = $state(0);
	let isBookClosed = $state(true);
	let bookX = $state(0);
	/** Per-leaf rotateY — animated independently from translateZ (Framer-motion style). */
	let rotates = $state<number[]>([]);
	/** Close sequence uses a shorter ease-in-out; open/flip uses cubic-bezier. */
	let leafEase = $state<'open' | 'close'>('open');
	/** Framer: open shift 0.6s, close shift 0.8s. */
	let bookShiftDuration = $state(0.6);

	$effect(() => {
		const n = totalLeaves;
		if (rotates.length !== n) {
			rotates = Array.from({ length: n }, (_, i) => (i < flippedCount ? -180 : 0));
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

		// Framer: first click opens (shift) and flips leaf 0 together.
		if (flippedCount === 0) {
			isBookClosed = false;
			bookShiftDuration = 0.6;
			bookX = width / 2;
		}

		if (flippedCount < totalLeaves) {
			leafEase = 'open';
			const indexToFlip = flippedCount;
			flippedCount += 1;
			setRotate(indexToFlip, -180);
			await wait(700);
		} else {
			// Framer close: shift back (0.8s), stagger reverse flips (0.5s each, 80ms gap),
			// then reset flippedCount / closed immediately after the stagger loop.
			leafEase = 'close';
			bookShiftDuration = 0.8;
			bookX = 0;
			for (let i = totalLeaves - 1; i >= 0; i--) {
				setRotate(i, 0);
				await wait(80);
			}
			flippedCount = 0;
			isBookClosed = true;
		}
	}

	function leafZIndex(index: number) {
		const isFlipped = index < flippedCount;
		const isFlipping = index === flippedCount - 1 && flippedCount > 0;
		if (isFlipping) return 100;
		return isFlipped ? index : totalLeaves - index;
	}

	function leafZOffset(index: number) {
		const isFlipped = index < flippedCount;
		return (isFlipped ? index : totalLeaves - index) * 0.4;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			void handleClick();
		}
	}
</script>

<!-- Framer root: full-area flex + perspective + click -->
<div
	class="relative mx-auto flex w-full items-center justify-center overflow-visible {className}"
	style="min-height: {height}px; width: 100%; max-width: {width * 2}px; perspective: 2500px; cursor: pointer;"
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
		style="width: {width}px; height: {height}px; position: relative; transform-style: preserve-3d; transform: translateX({bookX}px); transition: transform {bookShiftDuration}s ease-in-out, box-shadow 0.35s ease; box-shadow: {isBookClosed
			? closedShadow
			: '0px 0px 0px transparent'};"
	>
		{#each leafPairs as [front, back], index}
			<!-- Outer: translateZ only (no transition) — matches Framer style.transform -->
			<div
				class="absolute inset-0"
				style="transform-style: preserve-3d; transform-origin: left center; z-index: {leafZIndex(
					index,
				)}; transform: translateZ({leafZOffset(index)}px); will-change: transform;"
			>
				<!-- Inner: rotateY only (transitioned) — matches Framer motion animate -->
				<div
					class="absolute inset-0"
					style="transform-style: preserve-3d; transform-origin: left center; transform: rotateY({rotates[
						index
					] ?? 0}deg); transition: transform {leafEase === 'close'
						? '0.5s ease-in-out'
						: '0.7s cubic-bezier(0.4, 0, 0.2, 1)'}; will-change: transform;"
				>
					<div
						class="absolute inset-0 overflow-hidden"
						style="backface-visibility: hidden; -webkit-backface-visibility: hidden; background-color: transparent; border-radius: 0px {borderRadius}px {borderRadius}px 0px;"
					>
						{@render faceContent(front)}
						<span
							class="pointer-events-none absolute inset-y-0 left-0 w-[12%]"
							style="background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);"
							aria-hidden="true"
						></span>
					</div>

					<div
						class="absolute inset-0 overflow-hidden"
						style="backface-visibility: hidden; -webkit-backface-visibility: hidden; background-color: transparent; transform: rotateY(180deg) translateZ(0.01px); border-radius: {borderRadius}px 0px 0px {borderRadius}px;"
					>
						{@render faceContent(back)}
						<span
							class="pointer-events-none absolute inset-y-0 right-0 w-[12%]"
							style="background: linear-gradient(to right, rgba(0,0,0,0.1), transparent); transform: scaleX(-1);"
							aria-hidden="true"
						></span>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

{#snippet faceContent(face: Face)}
	{#if face.kind === 'cover'}
		<div
			class="flex size-full flex-col justify-between p-8 text-[#f4f8f9]"
			style="background: linear-gradient(145deg, #0f454c 0%, #1a6b73 48%, #14212b 100%);"
		>
			<p class="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#c8dde1]/85">
				Stack
			</p>
			<div>
				<p class="font-display text-[2.1rem] font-extrabold leading-none tracking-tight">
					{coverTitle}
				</p>
				<p class="mt-3 max-w-[16rem] text-[0.9rem] leading-snug text-[#f4f8f9]/75">
					{coverSubtitle}
				</p>
			</div>
			<p class="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#c8dde1]/7">
				Click to open →
			</p>
		</div>
	{:else if face.kind === 'back'}
		<div
			class="flex size-full flex-col justify-between p-8 text-[#f4f8f9]"
			style="background: linear-gradient(145deg, #14212b 0%, #0f454c 100%);"
		>
			<p class="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#c8dde1]/85">
				End
			</p>
			<div>
				<p class="font-display text-[1.75rem] font-extrabold tracking-tight">{backTitle}</p>
				<p class="mt-2 text-[0.9rem] text-[#f4f8f9]/75">{backSubtitle}</p>
			</div>
			<p class="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#c8dde1]/7">
				Click to close
			</p>
		</div>
	{:else if face.kind === 'blank'}
		<div class="size-full bg-[#f7fafb]"></div>
	{:else}
		<div class="flex size-full flex-col bg-[#f7fafb] p-7 text-[#14212b]">
			<p
				class="mb-1 font-mono text-[0.68rem] font-semibold tracking-wider text-[#1a6b73] tabular-nums"
			>
				{String(face.index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
			</p>
			{#if face.page.eyebrow}
				<p class="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#1a6b73]">
					{face.page.eyebrow}
				</p>
			{/if}
			<h3 class="mb-4 font-display text-[1.2rem] font-bold leading-snug tracking-tight">
				{face.page.title}
			</h3>
			<ul class="m-0 flex min-h-0 flex-1 list-none flex-col gap-1.5 overflow-auto p-0">
				{#each face.page.items as item}
					<li
						class="rounded-[6px] border border-[rgb(20_33_43/0.12)] bg-[#eef3f5]/80 px-2.5 py-1.5 text-[0.78rem] font-medium leading-snug text-[#3a4a56]"
					>
						{item}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/snippet}
