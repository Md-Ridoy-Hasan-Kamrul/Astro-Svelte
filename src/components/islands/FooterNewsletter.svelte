<script lang="ts">
	import { toast } from 'svelte-sonner';

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
	<label class="sr-only" for="footer-email">Email</label>
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
	<button
		type="submit"
		disabled={pending}
		class="inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-[linear-gradient(180deg,#f7f7f7_0%,#d8d8d8_45%,#bdbdbd_100%)] px-4 text-[0.8125rem] font-semibold text-[#141419] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_12px_rgba(0,0,0,0.08)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
	>
		Subscribe
	</button>
</form>
