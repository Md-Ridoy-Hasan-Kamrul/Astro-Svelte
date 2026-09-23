<script lang="ts">
	import { toast } from 'svelte-sonner';
	import AsyncStatus from '../ui/AsyncStatus.svelte';
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

	const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const SUBMIT_DELAY_MS = 450;

	let email = $state('');
	let pending = $state(false);
	let fieldError = $state<string | null>(null);
	let sent = $state(false);

	async function onSubmit(event: Event) {
		event.preventDefault();
		const value = email.trim();
		fieldError = null;
		sent = false;

		if (!value) {
			fieldError = 'Email is required';
			return;
		}

		if (!EMAIL_PATTERN.test(value)) {
			fieldError = 'Enter a valid email';
			toast.error('Enter a valid email');
			return;
		}

		pending = true;
		await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
		pending = false;
		sent = true;
		email = '';
		toast.success('Subscribed', {
			description: 'Thanks — we will keep you posted.',
		});
	}

	function clearSuccess() {
		sent = false;
	}
</script>

<div class="grid w-full max-w-74 gap-2">
	{#if sent}
		<AsyncStatus
			tone="success"
			title="Subscribed"
			description="We will keep you posted."
			actionLabel="Dismiss"
			onAction={clearSuccess}
			class="text-[#0a0a0c]"
		/>
	{/if}

	<form
		class="flex w-full flex-wrap items-center gap-2 min-[480px]:flex-nowrap"
		aria-busy={pending || undefined}
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
			disabled={pending}
			bind:value={email}
			aria-invalid={fieldError ? 'true' : undefined}
			aria-describedby={fieldError ? 'footer-email-error' : undefined}
			class="min-h-9 min-w-0 flex-1 rounded-full border border-white/35 bg-white/35 px-4 text-[0.8125rem] text-[#0a0a0c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1.5px_rgba(0,0,0,0.06)] outline-none placeholder:text-[#141419]/40 focus:bg-white/45 disabled:cursor-not-allowed disabled:opacity-60"
		/>
		<LiquidGlassButton
			type="submit"
			label={pending ? '…' : 'Subscribe'}
			size="sm"
			disabled={pending}
		/>
	</form>

	{#if fieldError}
		<p id="footer-email-error" class="m-0 text-xs text-[#8b2e2e]" role="alert">{fieldError}</p>
	{/if}
</div>
