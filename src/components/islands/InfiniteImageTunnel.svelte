<script lang="ts">
	/**
	 * Infinite Image Tunnel — Astro/Svelte port of
	 * https://framer.com/m/InfiniteImageTunnel-SK1BQY.js@al6yucrFJM9FTwK1PmPJ
	 * (CSS 3D perspective tunnel — no React / Framer runtime.)
	 */
	import { onDestroy, onMount } from 'svelte';

	type Surface = 'left' | 'right' | 'ceiling' | 'floor';

	type TileSpec = {
		surface: Surface;
		offset: number;
		cross: number;
		span: number;
		depth: number;
		index: number;
	};

	type Geo = {
		halfWidth: number;
		halfHeight: number;
		depth: number;
		bay: number;
	};

	let {
		images = [
			'/tunnel/01.jpg',
			'/tunnel/02.jpg',
			'/tunnel/03.jpg',
			'/tunnel/04.jpg',
			'/tunnel/05.jpg',
			'/tunnel/06.jpg',
			'/tunnel/07.jpg',
			'/tunnel/08.jpg',
			'/tunnel/09.jpg',
			'/tunnel/10.jpg',
			'/tunnel/11.jpg',
			'/tunnel/12.jpg',
		],
		animationSpeed = 1,
		perspective = 1800,
		tunnelDepth = 5000,
		backgroundColor = '#0a0f12',
		showGrid = true,
		gridColor = '#ffffff',
		gridOpacity = 0.18,
		gridThickness = 1,
		tileGap = 12,
		imageTileScale = 1,
		pauseOnHover = false,
		clickToToggle = true,
		mouseParallax = true,
		class: className = '',
	}: {
		images?: string[];
		animationSpeed?: number;
		perspective?: number;
		tunnelDepth?: number;
		backgroundColor?: string;
		showGrid?: boolean;
		gridColor?: string;
		gridOpacity?: number;
		gridThickness?: number;
		tileGap?: number;
		imageTileScale?: number;
		pauseOnHover?: boolean;
		clickToToggle?: boolean;
		mouseParallax?: boolean;
		class?: string;
	} = $props();

	const LAYOUT: TileSpec[] = [
		{ surface: 'left', offset: -0.34, cross: 0.3, span: 0.62, depth: 0.045, index: 0 },
		{ surface: 'left', offset: 0.36, cross: 0.22, span: 0.3, depth: 0.075, index: 8 },
		{ surface: 'left', offset: 0.06, cross: 0.4, span: 0.7, depth: 0.145, index: 1 },
		{ surface: 'left', offset: -0.52, cross: 0.18, span: 0.42, depth: 0.205, index: 9 },
		{ surface: 'left', offset: 0.44, cross: 0.26, span: 0.52, depth: 0.255, index: 2 },
		{ surface: 'left', offset: -0.18, cross: 0.34, span: 0.44, depth: 0.335, index: 10 },
		{ surface: 'left', offset: 0.2, cross: 0.3, span: 0.66, depth: 0.395, index: 3 },
		{ surface: 'left', offset: -0.46, cross: 0.24, span: 0.36, depth: 0.475, index: 4 },
		{ surface: 'left', offset: 0.3, cross: 0.2, span: 0.3, depth: 0.535, index: 11 },
		{ surface: 'left', offset: -0.1, cross: 0.36, span: 0.58, depth: 0.605, index: 5 },
		{ surface: 'left', offset: 0.48, cross: 0.22, span: 0.4, depth: 0.695, index: 2 },
		{ surface: 'left', offset: -0.36, cross: 0.28, span: 0.5, depth: 0.775, index: 6 },
		{ surface: 'left', offset: 0.14, cross: 0.24, span: 0.34, depth: 0.865, index: 6 },
		{ surface: 'left', offset: -0.28, cross: 0.3, span: 0.46, depth: 0.935, index: 7 },
		{ surface: 'right', offset: 0.32, cross: 0.26, span: 0.44, depth: 0.03, index: 4 },
		{ surface: 'right', offset: -0.24, cross: 0.36, span: 0.68, depth: 0.095, index: 8 },
		{ surface: 'right', offset: 0.5, cross: 0.18, span: 0.28, depth: 0.17, index: 2 },
		{ surface: 'right', offset: -0.06, cross: 0.42, span: 0.56, depth: 0.23, index: 9 },
		{ surface: 'right', offset: 0.38, cross: 0.24, span: 0.38, depth: 0.31, index: 10 },
		{ surface: 'right', offset: -0.44, cross: 0.22, span: 0.46, depth: 0.37, index: 0 },
		{ surface: 'right', offset: 0.1, cross: 0.34, span: 0.64, depth: 0.445, index: 11 },
		{ surface: 'right', offset: -0.34, cross: 0.28, span: 0.34, depth: 0.52, index: 3 },
		{ surface: 'right', offset: 0.44, cross: 0.2, span: 0.42, depth: 0.585, index: 1 },
		{ surface: 'right', offset: -0.14, cross: 0.32, span: 0.52, depth: 0.665, index: 4 },
		{ surface: 'right', offset: 0.26, cross: 0.24, span: 0.3, depth: 0.74, index: 1 },
		{ surface: 'right', offset: -0.48, cross: 0.26, span: 0.48, depth: 0.82, index: 6 },
		{ surface: 'right', offset: 0.06, cross: 0.3, span: 0.4, depth: 0.9, index: 5 },
		{ surface: 'ceiling', offset: -0.22, cross: 0.4, span: 0.7, depth: 0.115, index: 2 },
		{ surface: 'ceiling', offset: 0.34, cross: 0.28, span: 0.44, depth: 0.29, index: 4 },
		{ surface: 'ceiling', offset: -0.06, cross: 0.46, span: 0.8, depth: 0.43, index: 5 },
		{ surface: 'ceiling', offset: 0.4, cross: 0.24, span: 0.36, depth: 0.61, index: 6 },
		{ surface: 'ceiling', offset: -0.3, cross: 0.36, span: 0.6, depth: 0.78, index: 9 },
		{ surface: 'ceiling', offset: 0.18, cross: 0.3, span: 0.42, depth: 0.925, index: 2 },
		{ surface: 'floor', offset: 0.3, cross: 0.26, span: 0.4, depth: 0.06, index: 1 },
		{ surface: 'floor', offset: -0.34, cross: 0.3, span: 0.52, depth: 0.16, index: 3 },
		{ surface: 'floor', offset: 0.08, cross: 0.22, span: 0.3, depth: 0.245, index: 5 },
		{ surface: 'floor', offset: 0.42, cross: 0.24, span: 0.44, depth: 0.355, index: 7 },
		{ surface: 'floor', offset: -0.2, cross: 0.34, span: 0.58, depth: 0.47, index: 10 },
		{ surface: 'floor', offset: 0.24, cross: 0.2, span: 0.28, depth: 0.56, index: 3 },
		{ surface: 'floor', offset: -0.44, cross: 0.26, span: 0.46, depth: 0.68, index: 0 },
		{ surface: 'floor', offset: 0.12, cross: 0.3, span: 0.5, depth: 0.8, index: 8 },
		{ surface: 'floor', offset: -0.16, cross: 0.24, span: 0.34, depth: 0.89, index: 4 },
		{ surface: 'floor', offset: 0.36, cross: 0.28, span: 0.42, depth: 0.96, index: 11 },
	];

	const MOBILE_KEEP_EVERY = 3;
	const DEPTH_SPAN_SCALE = 2.2;
	const BOOST_MAX = 2.6;
	const BOOST_EASE = 1.4;

	function clamp(v: number, min: number, max: number) {
		return v < min ? min : v > max ? max : v;
	}

	function withAlpha(color: string, alpha: number) {
		const a = clamp(alpha, 0, 1);
		const c = (color || '#FFFFFF').trim();
		if (c.startsWith('rgb')) {
			const parts = c
				.slice(c.indexOf('(') + 1, c.lastIndexOf(')'))
				.split(/[,\s/]+/)
				.filter(Boolean)
				.map(Number);
			const [r = 255, g = 255, b = 255] = parts;
			return `rgba(${r}, ${g}, ${b}, ${a})`;
		}
		const clean = c.replace('#', '');
		const full =
			clean.length === 3
				? clean
						.split('')
						.map((ch) => ch + ch)
						.join('')
				: clean.slice(0, 6);
		const int = parseInt(full, 16);
		if (Number.isNaN(int)) return `rgba(255, 255, 255, ${a})`;
		return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${a})`;
	}

	function surfaceTransform(surface: Surface, geo: Geo, offset: number) {
		switch (surface) {
			case 'left':
				return `translate3d(${-geo.halfWidth}px, ${offset * geo.halfHeight}px, 0px) rotateY(90deg)`;
			case 'right':
				return `translate3d(${geo.halfWidth}px, ${offset * geo.halfHeight}px, 0px) rotateY(-90deg)`;
			case 'ceiling':
				return `translate3d(${offset * geo.halfWidth}px, ${-geo.halfHeight}px, 0px) rotateX(-90deg)`;
			default:
				return `translate3d(${offset * geo.halfWidth}px, ${geo.halfHeight}px, 0px) rotateX(90deg)`;
		}
	}

	function tileSize(spec: TileSpec, geo: Geo, scale: number, gap: number) {
		const isWall = spec.surface === 'left' || spec.surface === 'right';
		const acrossExtent = isWall ? geo.halfHeight * 2 : geo.halfWidth * 2;
		const across = acrossExtent * spec.cross * scale;
		const along = geo.bay * spec.span * scale * DEPTH_SPAN_SCALE;
		const width = isWall ? along : across;
		const height = isWall ? across : along;
		return { width: Math.max(8, width - gap), height: Math.max(8, height - gap) };
	}

	let containerEl: HTMLDivElement | undefined = $state();
	let sceneEl: HTMLDivElement | undefined = $state();
	let width = $state(1200);
	let height = $state(700);
	let started = $state(true);
	let paused = $state(false);

	const depth = $derived(clamp(tunnelDepth, 1000, 10000));
	const isCompact = $derived(width < 640);
	const frameCount = $derived(isCompact ? 14 : 20);
	const layout = $derived(
		isCompact ? LAYOUT.filter((_, i) => i % MOBILE_KEEP_EVERY !== 1) : LAYOUT,
	);
	const geo = $derived<Geo>({
		halfWidth: Math.max(120, width / 2),
		halfHeight: Math.max(90, height / 2),
		depth,
		bay: depth / frameCount,
	});
	const effectivePerspective = $derived(
		Math.round(clamp(perspective, 500, 3000) * clamp(width / 1400, 0.55, 1)),
	);
	const scale = $derived(clamp(imageTileScale, 0.5, 2));
	const gap = $derived(clamp(tileGap, 0, 100));
	const thickness = $derived(clamp(gridThickness, 0.5, 3));
	const lineColor = $derived(withAlpha(gridColor, gridOpacity));
	const vignetteColor = $derived(withAlpha(backgroundColor, 0.92));
	const vignetteTransparent = $derived(withAlpha(backgroundColor, 0));
	const tilePlaceholder = '#050505';

	const tileMeta = $derived(
		layout.map((spec) => {
			const size = tileSize(spec, geo, scale, gap);
			const src = images.length > 0 ? images[spec.index % images.length] : '';
			return { spec, ...size, src, base: surfaceTransform(spec.surface, geo, spec.offset) };
		}),
	);

	const surfaceLines = [
		{ surface: 'left' as const, offset: -1 },
		{ surface: 'left' as const, offset: -0.34 },
		{ surface: 'left' as const, offset: 0.34 },
		{ surface: 'left' as const, offset: 1 },
		{ surface: 'right' as const, offset: -1 },
		{ surface: 'right' as const, offset: -0.34 },
		{ surface: 'right' as const, offset: 0.34 },
		{ surface: 'right' as const, offset: 1 },
		{ surface: 'ceiling' as const, offset: -0.5 },
		{ surface: 'ceiling' as const, offset: 0.5 },
		{ surface: 'floor' as const, offset: -0.5 },
		{ surface: 'floor' as const, offset: 0.5 },
	];

	function surfaceLineStyle(surface: Surface, offset: number) {
		const isWall = surface === 'left' || surface === 'right';
		const w = isWall ? geo.depth : thickness;
		const h = isWall ? thickness : geo.depth;
		const base = surfaceTransform(surface, geo, offset);
		const dir = surface === 'left' || surface === 'ceiling' ? 1 : -1;
		const shift = isWall
			? `translate3d(${(dir * geo.depth) / 2}px, 0px, 0px)`
			: `translate3d(0px, ${(dir * geo.depth) / 2}px, 0px)`;
		return {
			width: `${w}px`,
			height: `${h}px`,
			marginLeft: `${-w / 2}px`,
			marginTop: `${-h / 2}px`,
			backgroundColor: lineColor,
			transform: `${base} ${shift}`,
		};
	}

	const tileEls: (HTMLDivElement | undefined)[] = [];
	const frameEls: (HTMLDivElement | undefined)[] = [];
	let tileZ = new Float64Array(0);
	let frameZ = new Float64Array(0);
	let rafId: number | null = null;
	let lastTime = 0;
	let ramp = 1;
	let boost = 1;
	let holding = false;
	let hovering = false;
	let visible = true;
	let reducedMotion = false;
	let pointer = { x: 0, y: 0 };
	let pointerTarget = { x: 0, y: 0 };
	let lastScene = { x: Number.NaN, y: Number.NaN };
	let rectCache: DOMRect | null = null;
	let wake = () => {};

	function seedDepths() {
		tileZ = new Float64Array(layout.length);
		for (let i = 0; i < layout.length; i++) tileZ[i] = layout[i].depth * depth;
		frameZ = new Float64Array(frameCount);
		for (let i = 0; i < frameCount; i++) frameZ[i] = (i / frameCount) * depth;
	}

	function writeFrame() {
		if (sceneEl && mouseParallax) {
			if (
				Number.isNaN(lastScene.x) ||
				Math.abs(pointer.x - lastScene.x) > 5e-4 ||
				Math.abs(pointer.y - lastScene.y) > 5e-4
			) {
				sceneEl.style.transform = `rotateY(${pointer.x * 7}deg) rotateX(${-pointer.y * 5}deg)`;
				lastScene = { x: pointer.x, y: pointer.y };
			}
		}

		const fadeStart = depth * 0.72;
		const fadeSpan = depth * 0.28;

		for (let i = 0; i < tileZ.length; i++) {
			const el = tileEls[i];
			if (!el) continue;
			const zi = tileZ[i];
			const base = tileMeta[i]?.base ?? '';
			el.style.transform = `translate3d(0px, 0px, ${-zi}px) ${base}`;
			el.style.opacity = zi > fadeStart ? String(clamp(1 - (zi - fadeStart) / fadeSpan, 0, 1)) : '1';
		}

		for (let i = 0; i < frameZ.length; i++) {
			const el = frameEls[i];
			if (!el) continue;
			const zi = frameZ[i];
			el.style.transform = `translate3d(0px, 0px, ${-zi}px)`;
			el.style.opacity = zi > fadeStart ? String(clamp(1 - (zi - fadeStart) / fadeSpan, 0, 1)) : '1';
		}
	}

	function stopLoop() {
		if (rafId !== null) cancelAnimationFrame(rafId);
		rafId = null;
		lastTime = 0;
	}

	function shouldSchedule() {
		if (typeof document !== 'undefined' && document.hidden) return false;
		if (!visible) return false;
		if (reducedMotion) {
			return (
				ramp > 0.001 ||
				Math.abs(boost - 1) > 0.001 ||
				Math.abs(pointer.x - pointerTarget.x) > 0.001 ||
				Math.abs(pointer.y - pointerTarget.y) > 0.001
			);
		}
		return true;
	}

	function tick(time: number) {
		const last = lastTime || time;
		lastTime = time;
		const dt = Math.min(0.05, (time - last) / 1000);
		const hoverPause = pauseOnHover && hovering;
		const running = started && !paused && !hoverPause && !reducedMotion && visible;
		const target = running ? 1 : 0;
		ramp += (target - ramp) * Math.min(1, dt * 2.4);
		const boostTarget = running && holding ? BOOST_MAX : 1;
		boost += (boostTarget - boost) * Math.min(1, dt * BOOST_EASE);
		const idle = reducedMotion ? 0 : 0.035;
		const factor = idle + (1 - idle) * ramp;
		const speedBase = 320 * clamp(animationSpeed, 0.1, 5);
		const delta = speedBase * factor * boost * dt;
		const near = -Math.max(200, geo.halfWidth * 0.4);

		if (delta > 0) {
			for (let i = 0; i < tileZ.length; i++) {
				let v = tileZ[i] - delta;
				if (v < near) v += depth;
				tileZ[i] = v;
			}
			for (let i = 0; i < frameZ.length; i++) {
				let v = frameZ[i] - delta;
				if (v < near) v += depth;
				frameZ[i] = v;
			}
		}

		pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, dt * 3);
		pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, dt * 3);
		writeFrame();

		if (shouldSchedule()) rafId = requestAnimationFrame(tick);
		else stopLoop();
	}

	function startLoop() {
		if (rafId !== null) return;
		if (!shouldSchedule()) return;
		lastTime = 0;
		rafId = requestAnimationFrame(tick);
	}

	function onSceneClick() {
		if (!clickToToggle || !started) return;
		paused = !paused;
		startLoop();
	}

	function onPointerMove(event: PointerEvent) {
		if (!mouseParallax || !containerEl) return;
		let rect = rectCache;
		if (!rect) {
			rect = containerEl.getBoundingClientRect();
			rectCache = rect;
		}
		if (rect.width === 0 || rect.height === 0) return;
		pointerTarget = {
			x: clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5),
			y: clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5),
		};
	}

	onMount(() => {
		const el = containerEl;
		if (!el) return;

		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		seedDepths();
		writeFrame();

		const ro = new ResizeObserver(() => {
			const rect = el.getBoundingClientRect();
			rectCache = rect;
			if (rect.width > 0 && rect.height > 0) {
				width = rect.width;
				height = rect.height;
			}
		});
		ro.observe(el);

		const io = new IntersectionObserver(
			(entries) => {
				const next = entries.some((e) => e.isIntersecting);
				const was = visible;
				visible = next;
				if (next && !was) startLoop();
			},
			{ threshold: 0 },
		);
		io.observe(el);

		const invalidate = () => {
			rectCache = null;
		};
		window.addEventListener('scroll', invalidate, { passive: true });
		window.addEventListener('resize', invalidate, { passive: true });

		const onVisibility = () => {
			if (document.hidden) stopLoop();
			else startLoop();
		};
		document.addEventListener('visibilitychange', onVisibility);

		wake = startLoop;
		startLoop();

		return () => {
			ro.disconnect();
			io.disconnect();
			window.removeEventListener('scroll', invalidate);
			window.removeEventListener('resize', invalidate);
			document.removeEventListener('visibilitychange', onVisibility);
			stopLoop();
		};
	});

	$effect(() => {
		// Reseed when geometry / layout density changes.
		void layout;
		void depth;
		void frameCount;
		seedDepths();
		writeFrame();
		startLoop();
	});

	onDestroy(() => {
		stopLoop();
	});
</script>

<!-- Decorative motion background — keyboard users use page CTAs instead. -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<div
	bind:this={containerEl}
	class="relative h-full w-full overflow-hidden touch-manipulation contain-[layout_paint] {className}"
	style="background-color: {backgroundColor}; perspective: {effectivePerspective}px; perspective-origin: 50% 50%;"
	aria-hidden="true"
	onpointerenter={() => {
		hovering = true;
	}}
	onpointerleave={() => {
		hovering = false;
		holding = false;
		pointerTarget = { x: 0, y: 0 };
		wake();
	}}
	onpointermove={onPointerMove}
	onpointerdown={() => {
		holding = true;
	}}
	onpointerup={() => {
		holding = false;
	}}
	onpointercancel={() => {
		holding = false;
	}}
	onclick={onSceneClick}
>
	<div
		bind:this={sceneEl}
		class="pointer-events-none absolute inset-0 transform-3d will-change-transform"
	>
		<div
			class="absolute left-1/2 top-1/2 transform-3d"
			style="width: {geo.halfWidth * 2}px; height: {geo.halfHeight * 2}px; margin-left: {-geo.halfWidth}px; margin-top: {-geo.halfHeight}px; transform: translate3d(0px, 0px, {-depth}px); background-color: {backgroundColor};"
		></div>

		{#if showGrid}
			<div class="absolute inset-0 transform-3d">
				{#each surfaceLines as line}
					<div
						class="absolute left-1/2 top-1/2 pointer-events-none transform-3d"
						style={surfaceLineStyle(line.surface, line.offset)}
					></div>
				{/each}
				{#each Array.from({ length: frameCount }, (_, i) => i) as i}
					{@const w = geo.halfWidth * 2}
					{@const h = geo.halfHeight * 2}
					{@const t = thickness}
					{@const sideHeight = Math.max(0, h - t * 2)}
					<div
						bind:this={frameEls[i]}
						class="absolute left-1/2 top-1/2 pointer-events-none transform-3d"
						style="width: {w}px; height: {h}px; margin-left: {-w / 2}px; margin-top: {-h / 2}px;"
					>
						<div class="absolute left-0 top-0" style="width: {w}px; height: {t}px; background-color: {lineColor};"></div>
						<div class="absolute bottom-0 left-0" style="width: {w}px; height: {t}px; background-color: {lineColor};"></div>
						<div class="absolute left-0" style="top: {t}px; width: {t}px; height: {sideHeight}px; background-color: {lineColor};"></div>
						<div class="absolute right-0" style="top: {t}px; width: {t}px; height: {sideHeight}px; background-color: {lineColor};"></div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="absolute inset-0 transform-3d">
			{#each tileMeta as tile, i}
				<div
					bind:this={tileEls[i]}
					class="absolute left-1/2 top-1/2 overflow-hidden transform-3d"
					style="width: {tile.width}px; height: {tile.height}px; margin-left: {-tile.width / 2}px; margin-top: {-tile.height / 2}px; background-color: {tilePlaceholder};"
				>
					{#if tile.src}
						<img
							src={tile.src}
							alt=""
							draggable="false"
							loading="lazy"
							decoding="async"
							class="pointer-events-none block size-full select-none object-cover"
						/>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div
		class="pointer-events-none absolute inset-0"
		style="background: radial-gradient(circle at 50% 50%, {vignetteColor} 0%, {vignetteTransparent} 22%);"
		aria-hidden="true"
	></div>
</div>
