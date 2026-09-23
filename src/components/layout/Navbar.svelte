<script lang="ts">
	/**
	 * Liquid Glass Navbar — Astro/Svelte port of
	 * https://framer.com/m/Liquid-Glass-Navbar-6gh01a.js@fE2FOG4pYkG2DSJZNgIz
	 */
	import Icon from '../ui/Icon.svelte';
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

	let open = $state(false);

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	const links = [
		{ href: '/#features', label: 'Features' },
		{ href: '/#how', label: 'How it works' },
		{ href: '/#live-repo', label: 'Live' },
		{ href: '/#stack', label: 'Stack' },
		{ href: '/about', label: 'About' },
	] as const;

	const linkClass =
		'rounded-full px-3 py-2 text-[0.9375rem] font-semibold tracking-[-0.01em] text-[#0a0a0c]/80 no-underline transition hover:bg-white/40 hover:text-[#0a0a0c]';
</script>

<header class="sticky top-0 z-40 px-[clamp(0.75rem,3vw,1.25rem)] pt-3 pb-2">
	<div
		class="mx-auto w-[min(100%,48.75rem)] p-[3px] [background:linear-gradient(180deg,#fff_0%,#c9c9c9_9%,#a1a1a1_32%,#757575_73%,#fff_100%)] [box-shadow:0.29px_4.36px_2.18px_rgba(0,0,0,0.01),0.48px_7.24px_3.63px_rgba(0,0,0,0.01),0.78px_11.7px_5.86px_rgba(0,0,0,0.02),1.28px_19.15px_9.6px_rgba(0,0,0,0.03),2.2px_32.97px_16.52px_rgba(0,0,0,0.03),4px_60px_30.07px_rgba(0,0,0,0.06)] {open
			? 'rounded-[1.85rem]'
			: 'rounded-full'}"
	>
		<div
			class="relative flex flex-col overflow-hidden [background:linear-gradient(150deg,#d0d0d0_0%,#e8e8e8_50%,#c8c8c8_100%)] [box-shadow:inset_0_1px_1.5px_rgba(0,0,0,0.07),inset_0_-1px_1.5px_rgba(0,0,0,0.07)] {open
				? 'rounded-[1.65rem]'
				: 'rounded-full'}"
		>
			<div
				class="flex items-center justify-between gap-3 px-3.5 py-2 min-[721px]:px-2.5 min-[721px]:pl-3.5"
			>
				<a
					href="/"
					class="inline-flex items-center gap-1.5 no-underline"
					onclick={close}
				>
					<span
						class="grid size-[1.875rem] place-items-center rounded-[0.2rem] [background:linear-gradient(135deg,#f4f5f8_0%,#c4c8d0_55%,#9ea2ac_100%)] [box-shadow:inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_7px_-1px_rgba(0,0,0,0.35)]"
						aria-hidden="true"
					>
						<span class="size-2 rotate-45 rounded-[2px] bg-[#0e0e12]"></span>
					</span>
					<span
						class="font-display text-[0.9375rem] font-extrabold tracking-[-0.01em] text-[#0a0a0c]"
					>
						Astro Svelte
					</span>
				</a>

				<nav
					class="hidden items-center gap-0.5 min-[721px]:flex"
					aria-label="Primary"
				>
					{#each links as link}
						<a href={link.href} class={linkClass}>{link.label}</a>
					{/each}
				</nav>

				<div class="flex items-center gap-2">
					<div class="hidden min-[721px]:block">
						<LiquidGlassButton href="/#cta" label="Get started" size="sm" />
					</div>

					<button
						type="button"
						class="relative grid size-10 cursor-pointer place-items-center rounded-full bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_20px_-6px_rgba(148,160,181,0.45)] min-[721px]:hidden"
						aria-expanded={open}
						aria-controls="site-menu"
						onclick={toggle}
					>
						<span class="sr-only">Menu</span>
						{#if open}
							<Icon name="close" class="size-5 text-[#0a0a0c]" />
						{:else}
							<span class="relative block h-[2px] w-[1.125rem] bg-[#0a0a0c]" aria-hidden="true">
								<span
									class="absolute left-0 top-[-5px] block h-[2px] w-[1.125rem] bg-[#0a0a0c]"
								></span>
								<span
									class="absolute left-0 top-[5px] block h-[2px] w-[1.125rem] bg-[#0a0a0c]"
								></span>
							</span>
						{/if}
					</button>
				</div>
			</div>

			{#if open}
				<nav
					id="site-menu"
					class="flex flex-col gap-1 border-t border-[#0a0a0c]/10 px-3 pb-3 pt-2 min-[721px]:hidden"
					aria-label="Primary"
				>
					{#each links as link}
						<a href={link.href} class="{linkClass} w-full" onclick={close}>
							{link.label}
						</a>
					{/each}
					<div class="pt-1">
						<LiquidGlassButton
							href="/#cta"
							label="Get started"
							size="sm"
							class="w-full"
							onclick={close}
						/>
					</div>
				</nav>
			{/if}
		</div>
	</div>
</header>
