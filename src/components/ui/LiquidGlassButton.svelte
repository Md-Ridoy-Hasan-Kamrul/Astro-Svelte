<script lang="ts">
	/**
	 * Liquid Glass Button — Astro/Svelte port of
	 * https://framer.com/m/LiquidGlassButtons-Cm3c86.js@y7tM3V9YGLt9tBHu2Y4O
	 * (CSS glass layers only — no React / canvas refraction.)
	 */
	type Surface = 'light' | 'dark';
	type Size = 'sm' | 'md';

	let {
		label,
		href,
		type = 'button',
		disabled = false,
		surface = 'light',
		size = 'md',
		external = false,
		class: className = '',
		onclick,
	}: {
		label: string;
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		surface?: Surface;
		size?: Size;
		external?: boolean;
		class?: string;
		onclick?: (event: MouseEvent) => void;
	} = $props();

	const rootClass = $derived(
		[
			'liquid-glass-btn',
			size === 'sm' ? 'liquid-glass-btn--sm' : '',
			className,
		]
			.filter(Boolean)
			.join(' '),
	);
</script>

{#if href}
	<a
		{href}
		class={rootClass}
		data-surface={surface}
		data-disabled={disabled ? 'true' : undefined}
		aria-disabled={disabled || undefined}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		onclick={onclick}
	>
		<span class="liquid-glass-btn__face">
			<span class="liquid-glass-btn__body" aria-hidden="true"></span>
			<span class="liquid-glass-btn__surface" aria-hidden="true"></span>
			<span class="liquid-glass-btn__tint" aria-hidden="true"></span>
			<span class="liquid-glass-btn__shoulder" aria-hidden="true"></span>
			<span class="liquid-glass-btn__rim" aria-hidden="true"></span>
			<span class="liquid-glass-btn__reflection" aria-hidden="true"></span>
			<span class="liquid-glass-btn__caustic" aria-hidden="true"></span>
			<span class="liquid-glass-btn__bottom" aria-hidden="true"></span>
			<span class="liquid-glass-btn__label">{label}</span>
		</span>
	</a>
{:else}
	<button
		{type}
		class={rootClass}
		data-surface={surface}
		data-disabled={disabled ? 'true' : undefined}
		disabled={disabled}
		onclick={onclick}
	>
		<span class="liquid-glass-btn__face">
			<span class="liquid-glass-btn__body" aria-hidden="true"></span>
			<span class="liquid-glass-btn__surface" aria-hidden="true"></span>
			<span class="liquid-glass-btn__tint" aria-hidden="true"></span>
			<span class="liquid-glass-btn__shoulder" aria-hidden="true"></span>
			<span class="liquid-glass-btn__rim" aria-hidden="true"></span>
			<span class="liquid-glass-btn__reflection" aria-hidden="true"></span>
			<span class="liquid-glass-btn__caustic" aria-hidden="true"></span>
			<span class="liquid-glass-btn__bottom" aria-hidden="true"></span>
			<span class="liquid-glass-btn__label">{label}</span>
		</span>
	</button>
{/if}
