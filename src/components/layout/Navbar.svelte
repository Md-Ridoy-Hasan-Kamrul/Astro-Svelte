<script lang="ts">
	/**
	 * Desktop (≥1021px): Liquid Glass Navbar
	 *   https://framer.com/m/Liquid-Glass-Navbar-6gh01a.js@fE2FOG4pYkG2DSJZNgIz
	 * ≤1020px (laptop / tablet / mobile L·M·S): Fullscreen Navbars
	 *   https://framer.com/m/Fullscreen-Navbars-kfEGbm.js@laKIaWcHyClfIGlbZlhN
	 * Dark variants sit on the hero; light variants for other pages.
	 */
	import { onDestroy } from 'svelte';
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

	let {
		surface = 'light',
	}: {
		/** Dark = Framer dark (over hero). Light = Framer light (other pages). */
		surface?: 'dark' | 'light';
	} = $props();

	let open = $state(false);
	const isDark = $derived(surface === 'dark');

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
	});

	$effect(() => {
		if (typeof document === 'undefined' || !open) return;
		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') close();
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});

	const links = [
		{ href: '/#features', label: 'Features' },
		{ href: '/#how', label: 'How it works' },
		{ href: '/#stack', label: 'Stack' },
		{ href: '/about', label: 'About' },
	] as const;

	const socials = [
		{ href: 'https://docs.astro.build', label: 'Astro' },
		{ href: 'https://svelte.dev/docs/svelte/getting-started', label: 'Svelte' },
		{ href: 'https://github.com/withastro/astro', label: 'GitHub' },
	] as const;

	const glassLinkClass =
		'rounded-full px-3 py-2 text-[0.9375rem] font-semibold tracking-[-0.01em] text-[#0a0a0c]/80 no-underline transition hover:bg-white/40 hover:text-[#0a0a0c]';

	const cream = '#f5f3ee';
	const ink = '#111111';
</script>

<header
	class={isDark
		? 'fixed inset-x-0 top-0 z-40'
		: 'sticky top-0 z-40'}
>
	<!-- Desktop: Liquid Glass (unchanged above 1020px) -->
	<div class="hidden px-[clamp(0.75rem,3vw,1.25rem)] pb-2 pt-3 min-[1021px]:block">
		<div
			class="mx-auto w-[min(100%,48.75rem)] rounded-full p-0.75 [background:linear-gradient(180deg,#fff_0%,#c9c9c9_9%,#a1a1a1_32%,#757575_73%,#fff_100%)] [box-shadow:0.29px_4.36px_2.18px_rgba(0,0,0,0.01),0.48px_7.24px_3.63px_rgba(0,0,0,0.01),0.78px_11.7px_5.86px_rgba(0,0,0,0.02),1.28px_19.15px_9.6px_rgba(0,0,0,0.03),2.2px_32.97px_16.52px_rgba(0,0,0,0.03),4px_60px_30.07px_rgba(0,0,0,0.06)]"
		>
			<div
				class="relative flex items-center justify-between gap-3 overflow-hidden rounded-full px-2.5 py-2 pl-3.5 [background:linear-gradient(150deg,#d0d0d0_0%,#e8e8e8_50%,#c8c8c8_100%)] [box-shadow:inset_0_1px_1.5px_rgba(0,0,0,0.07),inset_0_-1px_1.5px_rgba(0,0,0,0.07)]"
			>
				<a href="/" class="inline-flex items-center gap-1.5 no-underline">
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
						<a href={link.href} class={glassLinkClass}>{link.label}</a>
					{/each}
				</nav>

				<LiquidGlassButton href="/#cta" label="Get started" size="sm" />
			</div>
		</div>
	</div>

	<!-- ≤1020px: Fullscreen Navbars — dark on hero, light elsewhere -->
	<div class="min-[1021px]:hidden">
		<div
			class="flex h-16 items-center justify-between gap-3 px-[clamp(0.5rem,3vw,1.75rem)] min-[768px]:h-20"
		>
			<a href="/" class="inline-flex items-center gap-1 no-underline" onclick={close}>
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
				aria-expanded={open}
				aria-controls="fullscreen-menu"
				aria-label={open ? 'Close' : 'Menu'}
				onclick={toggle}
			>
				<span class="relative h-3.5 w-12.5 overflow-hidden text-[0.8125rem] font-medium uppercase tracking-[0.14em]" aria-hidden="true">
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
								class="font-display text-[clamp(2rem,9vw,4.5rem)] font-normal italic leading-none tracking-tight transition group-hover:opacity-70"
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
						href="/#cta"
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
