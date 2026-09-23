<script lang="ts">
	import { toast } from 'svelte-sonner';
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

	const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	let email = $state('');
	let pending = $state(false);

	function onSubmit(event: Event) {
		event.preventDefault();
		const value = email.trim();

		if (!EMAIL_PATTERN.test(value)) {
			toast.error('Enter a valid email');
			return;
		}

		pending = true;
		toast.success('Subscribed', {
			description: 'Thanks — we will keep you posted.',
		});
		email = '';
		pending = false;
	}
</script>

<form
	class="flex w-full max-w-[18.5rem] flex-wrap items-center gap-2 min-[480px]:flex-nowrap"
	onsubmit={onSubmit}
	novalidate
>
	<label class="sr-only" for="footer-email">Newsletter email</label>
	<input
		id="footer-email"
		name="email"
		type="email"
		autocomplete="email"
		placeholder="Your email"
		required
		bind:value={email}
		class="min-h-9 min-w-0 flex-1 rounded-full border border-white/35 bg-white/35 px-4 text-[0.8125rem] text-[#0a0a0c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1.5px_rgba(0,0,0,0.06)] outline-none placeholder:text-[#141419]/40 focus:bg-white/45"
	/>
	<LiquidGlassButton type="submit" label="Subscribe" size="sm" disabled={pending} />
</form>
