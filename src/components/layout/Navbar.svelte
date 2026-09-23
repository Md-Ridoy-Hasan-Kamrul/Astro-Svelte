<script lang="ts">
	/**
	 * Shared site navbar (Layout).
	 * Desktop (≥1021px): Liquid Glass Navbar
	 *   https://framer.com/m/Liquid-Glass-Navbar-6gh01a.js@fE2FOG4pYkG2DSJZNgIz
	 * ≤1020px: Fullscreen Navbars
	 *   https://framer.com/m/Fullscreen-Navbars-kfEGbm.js@laKIaWcHyClfIGlbZlhN
	 *
	 * Active route/section is driven from the live URL + scroll spy so the same
	 * persisted island stays correct across Home ↔ About / section jumps.
	 */
	import { onDestroy, onMount } from 'svelte';
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';
	import { pauseSmoothScroll, resumeSmoothScroll } from '../../lib/smoothScroll';

	let {
		surface = 'light',
		currentPath = '/',
	}: {
		surface?: 'dark' | 'light';
		/** Astro pathname for first paint; client sync overrides after mount. */
		currentPath?: string;
	} = $props();

	const SECTION_IDS = ['features', 'how', 'stack'] as const;
	type SectionId = (typeof SECTION_IDS)[number];
	type LinkMatch = SectionId | 'about';

	let open = $state(false);
	let path = $state(normalizePath(currentPath));
	let hash = $state('');
	let scrolledSection = $state<SectionId | ''>('');
	let liveSurface = $state(surface);

	const isDark = $derived(liveSurface === 'dark');

	function normalizePath(value: string) {
		if (!value || value === '') return '/';
		if (value.length > 1 && value.endsWith('/')) return value.slice(0, -1);
		return value;
	}

	function surfaceForPath(pathname: string): 'dark' | 'light' {
		const normalized = normalizePath(pathname);
		return normalized === '/' || normalized === '/login' ? 'dark' : 'light';
	}

	function syncFromLocation() {
		if (typeof window === 'undefined') return;
		path = normalizePath(window.location.pathname);
		hash = window.location.hash;
		liveSurface = surfaceForPath(path);
		if (path !== '/') scrolledSection = '';
	}

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
		if (open) pauseSmoothScroll();
		else resumeSmoothScroll();
	});

	$effect(() => {
		if (typeof document === 'undefined' || !open) return;
		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') close();
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	onMount(() => {
		let observer: IntersectionObserver | undefined;
		const ratios = new Map<string, number>();

		function bindSectionObserver() {
			observer?.disconnect();
			ratios.clear();
			const sectionNodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
				(el): el is HTMLElement => Boolean(el),
			);
			if (sectionNodes.length === 0) return;

			observer = new IntersectionObserver(
				(entries) => {
					if (normalizePath(window.location.pathname) !== '/') return;
					for (const entry of entries) {
						ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
					}
					let bestId: SectionId | '' = '';
					let bestRatio = 0;
					for (const id of SECTION_IDS) {
						const ratio = ratios.get(id) ?? 0;
						if (ratio > bestRatio) {
							bestRatio = ratio;
							bestId = id;
						}
					}
					if (bestId && bestRatio > 0.12) {
						scrolledSection = bestId;
						const nextHash = `#${bestId}`;
						if (window.location.hash !== nextHash) {
							history.replaceState(null, '', nextHash);
							hash = nextHash;
						}
					} else if (window.scrollY < 120) {
						scrolledSection = '';
						if (window.location.hash) {
							history.replaceState(null, '', window.location.pathname + window.location.search);
							hash = '';
						}
					}
				},
				{
					root: null,
					rootMargin: '-18% 0px -55% 0px',
					threshold: [0, 0.15, 0.35, 0.55, 0.75],
				},
			);
			for (const node of sectionNodes) observer.observe(node);
		}

		function onHashChange() {
			hash = window.location.hash;
			if (hash) {
				const id = hash.slice(1) as SectionId;
				if ((SECTION_IDS as readonly string[]).includes(id)) {
					scrolledSection = id;
				}
			}
		}

		function onPageLoad() {
			close();
			syncFromLocation();
			onHashChange();
			bindSectionObserver();
		}

		syncFromLocation();
		onHashChange();
		bindSectionObserver();

		window.addEventListener('hashchange', onHashChange);
		window.addEventListener('popstate', syncFromLocation);
		document.addEventListener('astro:page-load', onPageLoad);
		document.addEventListener('astro:after-swap', onPageLoad);

		return () => {
			window.removeEventListener('hashchange', onHashChange);
			window.removeEventListener('popstate', syncFromLocation);
			document.removeEventListener('astro:page-load', onPageLoad);
			document.removeEventListener('astro:after-swap', onPageLoad);
			observer?.disconnect();
		};
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});

	const links = [
		{ href: '/#features', label: 'Features', match: 'features' as const },
		{ href: '/#how', label: 'How it works', match: 'how' as const },
		{ href: '/#stack', label: 'Stack', match: 'stack' as const },
		{ href: '/about', label: 'About', match: 'about' as const },
	] as const;

	const socials = [
		{ href: 'https://docs.astro.build', label: 'Astro' },
		{ href: 'https://svelte.dev/docs/svelte/getting-started', label: 'Svelte' },
		{ href: 'https://github.com/withastro/astro', label: 'GitHub' },
	] as const;

	function isActive(match: LinkMatch) {
		if (match === 'about') return path === '/about';
		if (path !== '/') return false;
		const fromHash = hash === `#${match}`;
		const fromScroll = scrolledSection === match;
		return fromHash || fromScroll;
	}

	function linkClass(match: LinkMatch) {
		const base =
			'rounded-full px-3 py-2 text-[0.9375rem] font-semibold tracking-[-0.01em] no-underline transition';
		if (isActive(match)) {
			return `${base} bg-[#f7f7f8] text-[#0a0a0c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.08)]`;
		}
		return `${base} text-[#0a0a0c]/80 hover:bg-white/40 hover:text-[#0a0a0c]`;
	}

	const cream = '#f5f3ee';
	const ink = '#111111';
</script>

<header
	class={isDark
		? 'fixed inset-x-0 top-0 z-40 w-full max-w-[100vw] overflow-x-clip'
		: 'sticky top-0 z-40 w-full max-w-[100vw] overflow-x-clip'}
>
	<!-- Desktop: Liquid Glass -->
	<div class="hidden px-[clamp(0.75rem,3vw,1.25rem)] pb-2 pt-3 min-[1021px]:block">
		<div
			class="mx-auto w-[min(100%,48.75rem)] rounded-full p-0.75 [background:linear-gradient(180deg,#fff_0%,#c9c9c9_9%,#a1a1a1_32%,#757575_73%,#fff_100%)] [box-shadow:0.29px_4.36px_2.18px_rgba(0,0,0,0.01),0.48px_7.24px_3.63px_rgba(0,0,0,0.01),0.78px_11.7px_5.86px_rgba(0,0,0,0.02),1.28px_19.15px_9.6px_rgba(0,0,0,0.03),2.2px_32.97px_16.52px_rgba(0,0,0,0.03),4px_60px_30.07px_rgba(0,0,0,0.06)]"
		>
			<div
				class="relative flex items-center justify-between gap-3 overflow-hidden rounded-full px-2.5 py-2 pl-3.5 [background:linear-gradient(150deg,#d0d0d0_0%,#e8e8e8_50%,#c8c8c8_100%)] [box-shadow:inset_0_1px_1.5px_rgba(0,0,0,0.07),inset_0_-1px_1.5px_rgba(0,0,0,0.07)]"
			>
				<a href="/" class="inline-flex items-center gap-1.5 no-underline" data-astro-prefetch>
					<span
						class="grid size-7.5 place-items-center rounded-[0.2rem] [background:linear-gradient(135deg,#f4f5f8_0%,#c4c8d0_55%,#9ea2ac_100%)] [box-shadow:inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_7px_-1px_rgba(0,0,0,0.35)]"
						aria-hidden="true"
					>
						<span class="size-2 rotate-45 rounded-xs bg-[#0e0e12]"></span>
					</span>
					<span
						class="font-display text-[0.9375rem] font-extrabold tracking-[-0.01em] text-[#0a0a0c]"
					>
						Astro Svelte
					</span>
				</a>

				<nav class="flex items-center gap-0.5" aria-label="Primary">
					{#each links as link}
						<a
							href={link.href}
							class={linkClass(link.match)}
							aria-current={isActive(link.match) ? 'page' : undefined}
							data-astro-prefetch
						>
							{link.label}
						</a>
					{/each}
				</nav>

				<LiquidGlassButton href="/login" label="Get started" size="sm" />
			</div>
		</div>
	</div>

	<!-- ≤1020px: Fullscreen Navbars -->
	<div class="min-[1021px]:hidden">
		<div
			class="flex h-16 items-center justify-between gap-2 px-[clamp(0.5rem,3vw,1.75rem)] min-[375px]:gap-3 min-[768px]:h-20"
		>
			<a href="/" class="inline-flex min-w-0 items-center gap-1 no-underline" onclick={close}>
				<span
					class="truncate font-display text-xl font-normal italic leading-none tracking-tight min-[375px]:text-2xl"
					style="color: {isDark ? cream : ink}"
				>
					Astro Svelte
				</span>
			</a>

			<button
				type="button"
				class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-2.5 transition hover:scale-110 min-[375px]:w-32 min-[375px]:gap-3 min-[375px]:px-5"
				style="border-color: {isDark
					? 'rgba(245, 243, 238, 0.25)'
					: 'rgba(10, 10, 10, 0.3)'}; color: {isDark ? cream : ink}"
				aria-expanded={open}
				aria-controls="fullscreen-menu"
				aria-label={open ? 'Close' : 'Menu'}
				onclick={toggle}
			>
				<span
					class="relative hidden h-3.5 w-12.5 overflow-hidden text-[0.8125rem] font-medium uppercase tracking-[0.14em] min-[375px]:block"
					aria-hidden="true"
				>
					<span
						class="absolute left-0 top-0 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] {open
							? '-translate-y-2.5 opacity-0'
							: 'translate-y-0 opacity-100'}"
					>
						Menu
					</span>
					<span
						class="absolute left-0 top-0 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] {open
							? 'translate-y-0 opacity-100'
							: 'translate-y-2.5 opacity-0'}"
					>
						Close
					</span>
				</span>
				<span class="relative block size-5" aria-hidden="true">
					<span
						class="absolute left-px top-1.5 block h-0.5 w-4.5 rounded-xs transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] {open
							? 'top-2.25 rotate-45'
							: ''}"
						style="background-color: {isDark ? cream : ink}"
					></span>
					<span
						class="absolute left-px top-3 block h-0.5 w-4.5 rounded-xs transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] {open
							? 'top-2.25 -rotate-45'
							: ''}"
						style="background-color: {isDark ? cream : ink}"
					></span>
				</span>
			</button>
		</div>

		{#if open}
			<div
				id="fullscreen-menu"
				class="fixed inset-0 z-50 flex flex-col overflow-auto overscroll-contain motion-safe:animate-[rise_500ms_ease_both] {isDark
					? 'bg-[#0a0a0a] text-[#f5f3ee]'
					: 'bg-[#f5f3ee] text-[#111]'}"
				role="dialog"
				aria-modal="true"
				aria-label="Site menu"
			>
				<div
					class="flex h-16 shrink-0 items-center justify-between gap-3 px-[clamp(0.5rem,3vw,1.75rem)] min-[768px]:h-20"
				>
					<a href="/" class="inline-flex items-center no-underline" onclick={close}>
						<span
							class="font-display text-2xl font-normal italic leading-none tracking-tight"
							style="color: {isDark ? cream : ink}"
						>
							Astro Svelte
						</span>
					</a>
					<button
						type="button"
						class="inline-flex w-32 cursor-pointer items-center justify-center gap-3 rounded-full border px-5 py-2.5 transition hover:scale-110"
						style="border-color: {isDark
							? 'rgba(245, 243, 238, 0.25)'
							: 'rgba(10, 10, 10, 0.3)'}; color: {isDark ? cream : ink}"
						onclick={close}
					>
						<span class="text-[0.8125rem] font-medium uppercase tracking-[0.14em]">Close</span>
						<span class="relative block size-5" aria-hidden="true">
							<span
								class="absolute left-px top-2.25 block h-0.5 w-4.5 rotate-45 rounded-xs"
								style="background-color: {isDark ? cream : ink}"
							></span>
							<span
								class="absolute left-px top-2.25 block h-0.5 w-4.5 -rotate-45 rounded-xs"
								style="background-color: {isDark ? cream : ink}"
							></span>
						</span>
					</button>
				</div>

				<nav
					class="flex flex-1 flex-col justify-center gap-0 px-[clamp(0.75rem,4vw,2.5rem)] py-6"
					aria-label="Primary"
				>
					{#each links as link, index}
						<a
							href={link.href}
							class="group flex items-baseline gap-4 border-b py-[clamp(0.85rem,2.8vw,1.35rem)] no-underline transition {isDark
								? 'border-white/10'
								: 'border-black/10'}"
							onclick={close}
							aria-current={isActive(link.match) ? 'page' : undefined}
							style="animation-delay: {80 + index * 50}ms"
						>
							<span
								class="font-mono text-[0.75rem] font-semibold tracking-wider tabular-nums {isDark
									? 'text-[#8a8782]'
									: 'text-sea'}"
							>
								{String(index + 1).padStart(2, '0')}
							</span>
							<span
								class="font-display text-[clamp(2rem,9vw,4.5rem)] font-normal italic leading-none tracking-tight transition group-hover:opacity-70 {isActive(
									link.match,
								)
									? 'underline decoration-2 underline-offset-8'
									: ''}"
								style="color: {isDark ? cream : ink}"
							>
								{link.label}
							</span>
						</a>
					{/each}
				</nav>

				<div
					class="mt-auto flex flex-col gap-4 px-[clamp(0.75rem,4vw,2.5rem)] py-5 min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between {isDark
						? ''
						: 'border-t border-black/14'}"
				>
					<div class="flex flex-col gap-2 text-sm">
						<a
							href="mailto:hello@astrosvelte.dev"
							class="font-medium no-underline hover:opacity-70"
							style="color: {isDark ? cream : ink}"
						>
							hello@astrosvelte.dev
						</a>
						<div class="flex flex-wrap gap-4">
							{#each socials as item}
								<a
									href={item.href}
									class="font-medium no-underline hover:opacity-70 {isDark
										? 'text-[#8a8782]'
										: 'text-ink-soft'}"
									target="_blank"
									rel="noopener noreferrer"
									onclick={close}
								>
									{item.label}
								</a>
							{/each}
						</div>
					</div>
					<LiquidGlassButton
						href="/login"
						label="Get started"
						surface={isDark ? 'dark' : 'light'}
						onclick={close}
						class="self-start min-[768px]:self-auto"
					/>
				</div>
			</div>
		{/if}
	</div>
</header>
