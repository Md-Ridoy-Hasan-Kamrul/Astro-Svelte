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

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex min-h-12 items-center justify-center rounded-[0.35rem] bg-sea px-5 font-bold text-paper no-underline transition hover:-translate-y-px hover:bg-sea-deep {pressed
		? 'opacity-90'
		: ''}"
	onclick={onClick}
>
	{pressed ? 'Opening…' : label}
</a>
