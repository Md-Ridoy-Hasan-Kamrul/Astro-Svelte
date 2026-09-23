<script lang="ts">
	/**
	 * Animated Path — Astro/Svelte port of
	 * https://framer.com/m/AnimatedPath-zpq9rv.js@POpugJ0TBxWL4GA458rY
	 * Exact Framer viewBox / PROCESS_PATH / trail mask behavior.
	 */
	import { onDestroy, onMount } from 'svelte';
	import {
		FRAMER_POINTS,
		FRAMER_PROCESS_PATH,
		FRAMER_VIEW_HEIGHT,
		FRAMER_VIEW_WIDTH,
		type PathPoint,
	} from '../../lib/animatedPath';

	let {
		path = FRAMER_PROCESS_PATH,
		points = FRAMER_POINTS,
		viewWidth = FRAMER_VIEW_WIDTH,
		viewHeight = FRAMER_VIEW_HEIGHT,
		lineColor = '#111111',
		dotColor = '#111111',
		strokeWidth = 1,
		dashLength = 7,
		gapLength = 7,
		dotSize = 11,
		speed = 130,
		trailLength = 0.3,
		startDelay = 0,
		startOnView = true,
		showBase = true,
		baseOpacity = 0.16,
		class: className = '',
	}: {
		path?: string;
		points?: PathPoint[];
		viewWidth?: number;
		viewHeight?: number;
		lineColor?: string;
		dotColor?: string;
		strokeWidth?: number;
		dashLength?: number;
		gapLength?: number;
		dotSize?: number;
		speed?: number;
		trailLength?: number;
		startDelay?: number;
		startOnView?: boolean;
		showBase?: boolean;
		baseOpacity?: number;
		class?: string;
	} = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let measurementPath: SVGPathElement | undefined = $state();
	let started = $state(!startOnView);
	let pathLength = $state(800);
	const uid = `ap-${Math.random().toString(36).slice(2, 9)}`;

	const animationName = `smooth-process-flow-${uid}`;
	const animationClass = `smooth-process-path-${uid}`;
	const animationDuration = $derived(Math.max(pathLength / Math.max(speed, 1), 0.4));
	const normalizedTrail = $derived(Math.max(0.01, Math.min(trailLength, 0.9999)));
	const normalizedGap = $derived(1 - normalizedTrail);

	let styleEl: HTMLStyleElement | null = null;

	function syncStyles() {
		if (typeof document === 'undefined') return;
		const css = `
@keyframes ${animationName} {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -1; }
}
.${animationClass} {
  animation-name: ${animationName};
  animation-duration: ${animationDuration}s;
  animation-delay: ${Math.max(startDelay, 0)}s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  will-change: stroke-dashoffset;
}
@media (prefers-reduced-motion: reduce) {
  .${animationClass} {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }
}`;
		if (!styleEl) {
			styleEl = document.createElement('style');
			styleEl.dataset.animatedPath = uid;
			document.head.appendChild(styleEl);
		}
		styleEl.textContent = css;
	}

	onMount(() => {
		if (measurementPath) {
			const measured = measurementPath.getTotalLength();
			if (measured > 0) pathLength = measured;
		}
		syncStyles();

		if (!startOnView) {
			started = true;
			return;
		}

		const el = containerEl;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				started = entry.isIntersecting;
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	});

	$effect(() => {
		void animationDuration;
		void startDelay;
		syncStyles();
	});

	onDestroy(() => {
		styleEl?.remove();
		styleEl = null;
	});
</script>

<div
	bind:this={containerEl}
	class="pointer-events-none relative h-full w-full overflow-visible {className}"
	aria-hidden="true"
>
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 {viewWidth} {viewHeight}"
		preserveAspectRatio="none"
		class="absolute inset-0 block overflow-visible"
	>
		<path
			bind:this={measurementPath}
			d={path}
			fill="none"
			stroke="transparent"
			stroke-width="1"
		/>

		<defs>
			<mask
				id="moving-trail-mask-{uid}"
				maskUnits="userSpaceOnUse"
				maskContentUnits="userSpaceOnUse"
				x="-100"
				y="-100"
				width={viewWidth + 200}
				height={viewHeight + 200}
			>
				<path
					d={path}
					pathLength="1"
					fill="none"
					stroke="white"
					stroke-width={Math.max(strokeWidth + 14, 18)}
					stroke-linecap="round"
					stroke-dasharray="{normalizedTrail} {normalizedGap}"
					stroke-dashoffset="0"
					class={started ? animationClass : undefined}
				/>
			</mask>
		</defs>

		{#if showBase}
			<path
				d={path}
				fill="none"
				stroke={lineColor}
				stroke-width={strokeWidth}
				stroke-dasharray="{dashLength} {gapLength}"
				stroke-linecap="round"
				opacity={baseOpacity}
				vector-effect="non-scaling-stroke"
			/>
		{/if}

		<path
			d={path}
			fill="none"
			stroke={lineColor}
			stroke-width={strokeWidth}
			stroke-dasharray="{dashLength} {gapLength}"
			stroke-linecap="round"
			vector-effect="non-scaling-stroke"
			mask={started ? `url(#moving-trail-mask-${uid})` : undefined}
		/>

		{#each points as point}
			<circle cx={point.x} cy={point.y} r={dotSize / 2} fill={dotColor} />
		{/each}
	</svg>
</div>
