<script lang="ts">
	/**
	 * Sign in + Sign up — same-width NeuroField stack
	 * https://framer.com/m/NeuroField-VOsoq7.js@CwCJKv0L7J7qifRS563C
	 */
	import { toast } from 'svelte-sonner';
	import {
		type LoginFieldErrors,
		type SignupFieldErrors,
		validateLogin,
		validateSignup,
	} from '../../lib/auth/validateLogin';
	import { getMutationViewState } from '../../lib/query/queryUi';
	import AsyncStatus from '../ui/AsyncStatus.svelte';
	import NeuroField from '../ui/NeuroField.svelte';

	const SUBMIT_DELAY_MS = 700;
	const FIELD_GAP_PX = 20;
	const FORM_WIDTH_PX = 294;

	type Mode = 'signin' | 'signup';

	let mode = $state<Mode>('signin');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let fieldErrors = $state<SignupFieldErrors>({});
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

	const title = $derived(mode === 'signin' ? 'Sign in' : 'Sign up');
	const actionLabel = $derived(mode === 'signin' ? 'SIGN IN' : 'SIGN UP');
	const successTitle = $derived(mode === 'signin' ? 'Signed in' : 'Account created');

	function setMode(next: Mode) {
		mode = next;
		fieldErrors = {};
		formError = null;
		success = false;
		password = '';
		confirmPassword = '';
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		success = false;
		formError = null;

		if (mode === 'signin') {
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
			return;
		}

		const parsed = validateSignup({ name, email, password, confirmPassword });
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
		toast.success('Account created', {
			description: `Welcome, ${parsed.data.name}`,
		});
	}

	function resetStatus() {
		success = false;
		formError = null;
		fieldErrors = {};
	}
</script>

<form
	class="mx-auto grid w-full justify-items-center"
	style="max-width: {FORM_WIDTH_PX}px; gap: {FIELD_GAP_PX}px;"
	aria-labelledby="login-title"
	aria-busy={pending || undefined}
	onsubmit={onSubmit}
	novalidate
>
	<div class="grid w-full gap-3 text-center">
		<p
			class="m-0 font-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[rgb(0,153,255)]"
		>
			Access
		</p>
		<h1
			id="login-title"
			class="m-0 font-display text-[clamp(1.5rem,4vw,2rem)] font-bold tracking-tight text-white"
		>
			{title}
		</h1>

		<div
			class="mx-auto flex w-full border border-white/25 font-mono text-[12px] uppercase tracking-[0.12em]"
			role="tablist"
			aria-label="Auth mode"
		>
			<button
				type="button"
				role="tab"
				aria-selected={mode === 'signin'}
				class="flex-1 border-0 px-3 py-2 transition {mode === 'signin'
					? 'bg-[rgb(16,16,16)] text-white'
					: 'bg-transparent text-white/45 hover:text-white/75'}"
				onclick={() => setMode('signin')}
			>
				Sign in
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={mode === 'signup'}
				class="flex-1 border-0 border-l border-white/25 px-3 py-2 transition {mode === 'signup'
					? 'bg-[rgb(16,16,16)] text-white'
					: 'bg-transparent text-white/45 hover:text-white/75'}"
				onclick={() => setMode('signup')}
			>
				Sign up
			</button>
		</div>
	</div>

	{#if view === 'loading'}
		<AsyncStatus
			tone="info"
			title={mode === 'signin' ? 'Signing in…' : 'Creating account…'}
			busy
			class="w-full border-white/20 bg-white/5 text-white"
		/>
	{:else if view === 'error' && formError}
		<AsyncStatus
			tone="danger"
			title="Could not continue"
			description={formError}
			actionLabel="Dismiss"
			onAction={resetStatus}
			class="w-full border-white/20 bg-white/5 text-white"
		/>
	{:else if view === 'success'}
		<AsyncStatus
			tone="success"
			title={successTitle}
			description="Demo only — nothing is stored yet."
			actionLabel="Continue"
			onAction={resetStatus}
			class="w-full border-white/20 bg-white/5 text-white"
		/>
	{/if}

	{#if mode === 'signup'}
		<div class="grid w-full gap-1 justify-items-center">
			<NeuroField
				id="auth-name"
				name="name"
				type="text"
				placeholder="ENTER YOUR NAME"
				bind:value={name}
				disabled={pending}
				invalid={Boolean(fieldErrors.name)}
				describedBy={fieldErrors.name ? 'auth-name-error' : undefined}
			/>
			{#if fieldErrors.name}
				<p id="auth-name-error" class="m-0 w-full font-mono text-[0.7rem] text-[#f07c00]" role="alert">
					{fieldErrors.name}
				</p>
			{/if}
		</div>
	{/if}

	<div class="grid w-full gap-1 justify-items-center">
		<NeuroField
			id="auth-email"
			name="email"
			type="email"
			placeholder="ENTER YOUR EMAIL"
			bind:value={email}
			disabled={pending}
			invalid={Boolean(fieldErrors.email)}
			describedBy={fieldErrors.email ? 'auth-email-error' : undefined}
		/>
		{#if fieldErrors.email}
			<p id="auth-email-error" class="m-0 w-full font-mono text-[0.7rem] text-[#f07c00]" role="alert">
				{fieldErrors.email}
			</p>
		{/if}
	</div>

	<div class="grid w-full gap-1 justify-items-center">
		<NeuroField
			id="auth-password"
			name="password"
			type="password"
			placeholder="ENTER YOUR PASSWORD"
			bind:value={password}
			disabled={pending}
			invalid={Boolean(fieldErrors.password)}
			describedBy={fieldErrors.password ? 'auth-password-error' : undefined}
		/>
		{#if fieldErrors.password}
			<p
				id="auth-password-error"
				class="m-0 w-full font-mono text-[0.7rem] text-[#f07c00]"
				role="alert"
			>
				{fieldErrors.password}
			</p>
		{/if}
	</div>

	{#if mode === 'signup'}
		<div class="grid w-full gap-1 justify-items-center">
			<NeuroField
				id="auth-confirm"
				name="confirmPassword"
				type="password"
				placeholder="CONFIRM PASSWORD"
				bind:value={confirmPassword}
				disabled={pending}
				invalid={Boolean(fieldErrors.confirmPassword)}
				describedBy={fieldErrors.confirmPassword ? 'auth-confirm-error' : undefined}
			/>
			{#if fieldErrors.confirmPassword}
				<p
					id="auth-confirm-error"
					class="m-0 w-full font-mono text-[0.7rem] text-[#f07c00]"
					role="alert"
				>
					{fieldErrors.confirmPassword}
				</p>
			{/if}
		</div>
	{/if}

	<!-- Same shell as fields — SIGN IN / SIGN UP centered full width -->
	<NeuroField
		id="auth-submit"
		name="auth-submit"
		type="text"
		actionLabel={pending ? '…' : actionLabel}
		actionType="submit"
		actionOnly
		disabled={pending}
		busy={pending}
	/>
</form>
