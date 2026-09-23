<script lang="ts">
	/**
	 * Shared loading / error / empty / success chrome for data UIs.
	 * Keep Query/Axios payloads out of this component — only presentation.
	 */
	type Tone = 'neutral' | 'danger' | 'success' | 'info';

	let {
		tone = 'neutral',
		title,
		description = '',
		actionLabel,
		onAction,
		busy = false,
		class: className = '',
	}: {
		tone?: Tone;
		title: string;
		description?: string;
		actionLabel?: string;
		onAction?: () => void;
		busy?: boolean;
		class?: string;
	} = $props();

	const toneClass = $derived(
		{
			neutral: 'border-line bg-mist/50 text-ink',
			danger: 'border-accent/35 bg-accent/8 text-ink',
			success: 'border-sea/35 bg-sea/8 text-ink',
			info: 'border-sea/25 bg-foam/70 text-ink',
		}[tone],
	);
</script>

<div
	class="grid gap-2 rounded-lg border px-3.5 py-3 {toneClass} {className}"
	role="status"
	aria-live="polite"
	aria-busy={busy || undefined}
>
	<p class="m-0 text-sm font-semibold tracking-[-0.01em]">{title}</p>
	{#if description}
		<p class="m-0 text-sm text-ink-soft">{description}</p>
	{/if}
	{#if actionLabel && onAction}
		<button
			type="button"
			class="mt-1 justify-self-start rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-60"
			disabled={busy}
			onclick={onAction}
		>
			{actionLabel}
		</button>
	{/if}
</div>
