<script lang="ts">
	let open = $state(false);

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}
</script>

<header class="sticky top-0 z-40 border-b border-line bg-mist/80 backdrop-blur-[12px]">
	<div
		class="mx-auto flex min-h-16 w-[min(100%-2rem,72rem)] items-center justify-between gap-4"
	>
		<a
			href="#top"
			class="inline-flex items-center gap-2 font-display text-[1.2rem] font-extrabold tracking-tight text-ink no-underline"
			onclick={close}
		>
			<i class="las la-layer-group text-[1.25rem] text-sea" aria-hidden="true"></i>
			Astro Svelte
		</a>

		<button
			type="button"
			class="grid size-10 place-items-center rounded-[0.4rem] border border-line bg-paper min-[721px]:hidden"
			aria-expanded={open}
			aria-controls="site-menu"
			onclick={toggle}
		>
			<span class="sr-only">Menu</span>
			{#if open}
				<i class="las la-times text-xl text-ink" aria-hidden="true"></i>
			{:else}
				<i class="las la-bars text-xl text-ink" aria-hidden="true"></i>
			{/if}
		</button>

		<nav
			id="site-menu"
			class="absolute inset-x-0 top-full flex-col items-stretch gap-0 border-b border-line bg-paper/95 px-[clamp(1rem,4vw,2.5rem)] pb-4 pt-2 min-[721px]:static min-[721px]:flex-row min-[721px]:items-center min-[721px]:gap-6 min-[721px]:border-0 min-[721px]:bg-transparent min-[721px]:p-0 {open
				? 'flex'
				: 'hidden'} min-[721px]:flex"
			aria-label="Primary"
		>
			<a
				href="#features"
				class="border-b border-line py-3 text-[0.95rem] font-semibold text-ink-soft no-underline transition-colors hover:text-sea-deep min-[721px]:border-0 min-[721px]:py-0"
				onclick={close}
			>
				Features
			</a>
			<a
				href="#how"
				class="border-b border-line py-3 text-[0.95rem] font-semibold text-ink-soft no-underline transition-colors hover:text-sea-deep min-[721px]:border-0 min-[721px]:py-0"
				onclick={close}
			>
				How it works
			</a>
			<a
				href="#live-repo"
				class="border-b border-line py-3 text-[0.95rem] font-semibold text-ink-soft no-underline transition-colors hover:text-sea-deep min-[721px]:border-0 min-[721px]:py-0"
				onclick={close}
			>
				Live
			</a>
			<a
				href="#stack"
				class="border-b border-line py-3 text-[0.95rem] font-semibold text-ink-soft no-underline transition-colors hover:text-sea-deep min-[721px]:border-0 min-[721px]:py-0"
				onclick={close}
			>
				Stack
			</a>
			<a
				href="#cta"
				class="py-3 text-[0.95rem] font-semibold text-ink-soft no-underline transition-colors hover:text-sea-deep min-[721px]:py-0"
				onclick={close}
			>
				Get started
			</a>
		</nav>
	</div>
</header>
