<script lang="ts">
	/**
	 * Desktop (≥1021px): Liquid Glass Navbar
	 *   https://framer.com/m/Liquid-Glass-Navbar-6gh01a.js@fE2FOG4pYkG2DSJZNgIz
	 * ≤1020px (laptop / tablet / mobile L·M·S): Fullscreen Navbars
	 *   https://framer.com/m/Fullscreen-Navbars-kfEGbm.js@laKIaWcHyClfIGlbZlhN
	 */
	import { onDestroy } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

	let open = $state(false);

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

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});

	const links = [
		{ href: '/#features', label: 'Features' },
		{ href: '/#how', label: 'How it works' },
		{ href: '/#live-repo', label: 'Live' },
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
</script>

<header class="sticky top-0 z-40">
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
						<span class="size-2 rotate-45 rounded-xs-[#0e0e12]"></span>
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

	<!-- ≤1020px: Fullscreen Navbars (laptop / tablet / mobile L·M·S) -->
	<div class="min-[1021px]:hidden">
		<div
			class="flex items-center justify-between gap-3 px-[clamp(0.75rem,4vw,1.25rem)] py-3"
		>
			<a href="/" class="inline-flex items-center gap-2 no-underline" onclick={close}>
				<span
					class="grid size-8 place-items-center rounded-sm [background:linear-gradient(135deg,#f4f5f8_0%,#c4c8d0_55%,#9ea2ac_100%)] [box-shadow:inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_7px_-1px_rgba(0,0,0,0.35)]"
					aria-hidden="true"
				>
					<span class="size-2 rotate-45 rounded-xs-[#0e0e12]"></span>
				</span>
				<span class="font-display text-base font-extrabold tracking-tight text-ink">
					Astro Svelte
				</span>
			</a>

			<button
				type="button"
				class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-paper/90 px-3.5 text-sm font-semibold text-ink shadow-sm backdrop-blur-md"
				aria-expanded={open}
				aria-controls="fullscreen-menu"
				onclick={toggle}
			>
				<span>{open ? 'Close' : 'Menu'}</span>
				<span class="relative block h-0.5 w-4 bg-ink" aria-hidden="true">
					<span
						class="absolute left-0 -top-1.25block h-0.5-4 bg-ink transition {open
							? 'translate-y-1.25 rotate-45'
							: ''}"
					></span>
					<span
						class="absolute left-0 top-1.25block hh-0.5w-4 bg-ink transition {open
							? '-translate-y-1.25-rotate-45'
							: ''}"
					></span>
					<span class="block h-0.5 w-4 bg-ink transition {open ? 'opacity-0' : ''}"></span>
				</span>
			</button>
		</div>

		{#if open}
			<div
				id="fullscreen-menu"
				class="fixed inset-0 z-50 flex flex-col bg-mist motion-safe:animate-[rise_400ms_ease_both]"
				role="dialog"
				aria-modal="true"
				aria-label="Site menu"
			>
				<div
					class="flex items-center justify-between gap-3 border-b border-line px-[clamp(0.75rem,4vw,1.25rem)] py-3"
				>
					<a href="/" class="inline-flex items-center gap-2 no-underline" onclick={close}>
						<span
							class="grid size-8 place-items-center rounded-sm [background:linear-gradient(135deg,#f4f5f8_0%,#c4c8d0_55%,#9ea2ac_100%)]"
							aria-hidden="true"
						>
							<span class="size-2 rotate-45 rounded-xs bg-[#0e0e12]"></span>
						</span>
						<span class="font-display text-base font-extrabold tracking-tight text-ink">
							Astro Svelte
						</span>
					</a>
					<button
						type="button"
						class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-paper px-3.5 text-sm font-semibold text-ink"
						onclick={close}
					>
						Close
						<Icon name="close" class="size-4" />
					</button>
				</div>

				<nav
					class="flex flex-1 flex-col justify-center gap-1 px-[clamp(1rem,5vw,2rem)] py-6"
					aria-label="Primary"
				>
					{#each links as link, index}
						<a
							href={link.href}
							class="group flex items-baseline gap-3 border-b border-line/80 py-[clamp(0.65rem,2.5vw,1rem)] no-underline"
							onclick={close}
							style="animation-delay: {80 + index * 50}ms"
						>
							<span
								class="font-mono text-[0.75rem] font-semibold tracking-wider text-sea tabular-nums"
							>
								{String(index + 1).padStart(2, '0')}
							</span>
							<span
								class="font-display text-[clamp(1.75rem,8vw,3.25rem)] font-bold leading-none tracking-tight text-ink transition group-hover:text-sea-deep"
							>
								{link.label}
							</span>
						</a>
					{/each}
				</nav>

				<div
					class="mt-auto flex flex-col gap-4 border-t border-line px-[clamp(1rem,5vw,2rem)] py-5 min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between"
				>
					<div class="flex flex-col gap-2 text-sm text-ink-soft">
						<a
							href="mailto:hello@astrosvelte.dev"
							class="font-semibold text-ink no-underline hover:text-sea-deep"
						>
							hello@astrosvelte.dev
						</a>
						<div class="flex flex-wrap gap-4">
							{#each socials as item}
								<a
									href={item.href}
									class="font-semibold text-ink-soft no-underline hover:text-sea-deep"
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
						onclick={close}
						class="self-start min-[768px]:self-auto"
					/>
				</div>
			</div>
		{/if}
	</div>
</header>
