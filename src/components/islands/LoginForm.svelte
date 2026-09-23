<script lang="ts">
	/**
	 * Login form — NeuroField inputs matching
	 * https://framer.com/m/NeuroField-VOsoq7.js@CwCJKv0L7J7qifRS563C
	 */
	import { toast } from 'svelte-sonner';
	import {
		type LoginFieldErrors,
		validateLogin,
	} from '../../lib/auth/validateLogin';
	import { getMutationViewState } from '../../lib/query/queryUi';
	import AsyncStatus from '../ui/AsyncStatus.svelte';
	import NeuroField from '../ui/NeuroField.svelte';

	const SUBMIT_DELAY_MS = 700;

	let email = $state('');
	let password = $state('');
	let fieldErrors = $state<LoginFieldErrors>({});
	let pending = $state(false);
	let formError = $state<string | null>(null);
	let success = $state(false);

	const view = $derived(
		getMutationViewState({
			isPending: pending,
			isError: Boolean(formError),
			isSuccess: success,
		}),
	);

	async function onSubmit(event: Event) {
		event.preventDefault();
		success = false;
		formError = null;

		const parsed = validateLogin({ email, password });
		if (!parsed.ok) {
			fieldErrors = parsed.errors;
			formError = 'Please fix the highlighted fields.';
			toast.error('Please fix the form');
			return;
		}

		fieldErrors = {};
		pending = true;
		await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
		pending = false;
		success = true;
		toast.success('Signed in', {
			description: `Welcome back, ${parsed.data.email}`,
		});
	}

	function resetStatus() {
		success = false;
		formError = null;
		fieldErrors = {};
	}
</script>

<form
	class="mx-auto grid w-full max-w-[320px] gap-8"
	aria-labelledby="login-title"
	aria-busy={pending || undefined}
	onsubmit={onSubmit}
	novalidate
>
	{#if view === 'loading'}
		<AsyncStatus tone="info" title="Signing in…" busy class="border-white/20 bg-white/5 text-white" />
	{:else if view === 'error' && formError}
		<AsyncStatus
			tone="danger"
			title="Could not sign in"
			description={formError}
			actionLabel="Dismiss"
			onAction={resetStatus}
			class="border-white/20 bg-white/5 text-white"
		/>
	{:else if view === 'success'}
		<AsyncStatus
			tone="success"
			title="Signed in"
			description="Demo login succeeded — no session is stored yet."
			actionLabel="Sign in again"
			onAction={resetStatus}
			class="border-white/20 bg-white/5 text-white"
		/>
	{/if}

	<div class="grid gap-2">
		<NeuroField
			id="login-email"
			name="email"
			type="email"
			placeholder="ENTER YOUR EMAIL"
			bind:value={email}
			disabled={pending}
			invalid={Boolean(fieldErrors.email)}
			describedBy={fieldErrors.email ? 'login-email-error' : undefined}
		/>
		{#if fieldErrors.email}
			<p id="login-email-error" class="m-0 font-mono text-[0.7rem] text-[#f07c00]" role="alert">
				{fieldErrors.email}
			</p>
		{/if}
	</div>

	<div class="grid gap-2">
		<!-- Password + docked SIGN IN — same layout as Framer email + SUBSCRIBE -->
		<NeuroField
			id="login-password"
			name="password"
			type="password"
			placeholder="ENTER PASSWORD"
			bind:value={password}
			actionLabel="SIGN IN"
			actionType="submit"
			disabled={pending}
			busy={pending}
			invalid={Boolean(fieldErrors.password)}
			describedBy={fieldErrors.password ? 'login-password-error' : undefined}
		/>
		{#if fieldErrors.password}
			<p id="login-password-error" class="m-0 font-mono text-[0.7rem] text-[#f07c00]" role="alert">
				{fieldErrors.password}
			</p>
		{/if}
	</div>
</form>
