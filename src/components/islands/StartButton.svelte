<script lang="ts">
	interface Props {
		label?: string;
		href?: string;
	}

	let {
		label = 'Open the docs',
		href = 'https://docs.astro.build/en/guides/framework-components/',
	}: Props = $props();

	let pressed = $state(false);

	function onClick() {
		pressed = true;
	}
</script>

<a class="start" class:pressed {href} target="_blank" rel="noopener noreferrer" onclick={onClick}>
	{pressed ? 'Opening…' : label}
</a>

<style>
	.start {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3rem;
		padding: 0.7rem 1.4rem;
		border-radius: 0.35rem;
		background: var(--sea);
		color: #f4f8f9;
		font-weight: 700;
		text-decoration: none;
		transition: background 160ms ease, transform 160ms ease;
	}

	.start:hover {
		background: var(--sea-deep);
		transform: translateY(-1px);
	}

	.start.pressed {
		opacity: 0.9;
	}
</style>
