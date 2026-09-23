<script lang="ts">
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

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

<LiquidGlassButton
	{href}
	label={pressed ? 'Opening…' : label}
	external
	onclick={onClick}
/>
