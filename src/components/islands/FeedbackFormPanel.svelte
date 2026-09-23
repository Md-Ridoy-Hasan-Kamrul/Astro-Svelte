<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import {
		FEEDBACK_MESSAGE_MAX,
		FEEDBACK_NAME_MAX,
		type FeedbackFieldErrors,
		type FeedbackInput,
		validateFeedback,
	} from '../../lib/feedback/validateFeedback';
	import { submitFeedback } from '../../lib/feedback/submitFeedback';
	import { getAxiosErrorMessage } from '../../lib/api/axios';
	import { getMutationViewState } from '../../lib/query/queryUi';
	import AsyncStatus from '../ui/AsyncStatus.svelte';
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let fieldErrors = $state<FeedbackFieldErrors>({});
	let formError = $state<string | null>(null);
	let justSent = $state(false);

	const feedbackMutation = createMutation(() => ({
		mutationFn: (input: FeedbackInput) => submitFeedback(input),
		onSuccess: (result) => {
			if (!result.ok) {
				fieldErrors = result.errors ?? {};
				formError = result.message ?? 'Check the highlighted fields.';
				justSent = false;
				toast.error('Please fix the form', {
					description: formError,
				});
				return;
			}

			fieldErrors = {};
			formError = null;
			name = '';
			email = '';
			message = '';
			justSent = true;
			toast.success('Feedback sent', {
				description: 'Thanks — we saved your message.',
			});
		},
		onError: (error) => {
			justSent = false;
			formError = getAxiosErrorMessage(error);
			toast.error('Could not send feedback', {
				description: formError,
			});
		},
	}));

	const mutationView = $derived(
		getMutationViewState({
			isPending: feedbackMutation.isPending,
			isError: Boolean(formError) || feedbackMutation.isError,
			isSuccess: justSent && !feedbackMutation.isPending,
		}),
	);

	const isBusy = $derived(feedbackMutation.isPending);

	function onSubmit(event: Event) {
		event.preventDefault();
		justSent = false;
		formError = null;

		const parsed = validateFeedback({ name, email, message });
		if (!parsed.ok) {
			fieldErrors = parsed.errors;
			formError = 'Please fix the highlighted fields.';
			toast.error('Please fix the form');
			return;
		}

		fieldErrors = {};
		feedbackMutation.mutate(parsed.data);
	}

	function clearStatus() {
		formError = null;
		justSent = false;
		feedbackMutation.reset();
	}
</script>

<form
	class="grid gap-4"
	aria-labelledby="feedback-title"
	aria-busy={isBusy || undefined}
	onsubmit={onSubmit}
	novalidate
>
	{#if mutationView === 'loading'}
		<AsyncStatus tone="info" title="Sending feedback…" busy />
	{:else if mutationView === 'error' && formError}
		<AsyncStatus
			tone="danger"
			title="Could not send feedback"
			description={formError}
			actionLabel="Dismiss"
			onAction={clearStatus}
		/>
	{:else if mutationView === 'success'}
		<AsyncStatus
			tone="success"
			title="Feedback sent"
			description="Thanks — your message was saved."
			actionLabel="Send another"
			onAction={clearStatus}
		/>
	{/if}

	<div class="grid gap-1.5">
		<label class="text-sm font-semibold text-ink" for="feedback-name">Name</label>
		<input
			id="feedback-name"
			name="name"
			type="text"
			autocomplete="name"
			maxlength={FEEDBACK_NAME_MAX}
			disabled={isBusy}
			class="min-h-11 rounded-[0.35rem] border border-line bg-paper px-3 text-ink outline-none focus:border-sea disabled:cursor-not-allowed disabled:opacity-60"
			bind:value={name}
			aria-invalid={fieldErrors.name ? 'true' : undefined}
			aria-describedby={fieldErrors.name ? 'feedback-name-error' : undefined}
		/>
		{#if fieldErrors.name}
			<p id="feedback-name-error" class="m-0 text-sm text-accent" role="alert">
				{fieldErrors.name}
			</p>
		{/if}
	</div>

	<div class="grid gap-1.5">
		<label class="text-sm font-semibold text-ink" for="feedback-email">Email</label>
		<input
			id="feedback-email"
			name="email"
			type="email"
			autocomplete="email"
			disabled={isBusy}
			class="min-h-11 rounded-[0.35rem] border border-line bg-paper px-3 text-ink outline-none focus:border-sea disabled:cursor-not-allowed disabled:opacity-60"
			bind:value={email}
			aria-invalid={fieldErrors.email ? 'true' : undefined}
			aria-describedby={fieldErrors.email ? 'feedback-email-error' : undefined}
		/>
		{#if fieldErrors.email}
			<p id="feedback-email-error" class="m-0 text-sm text-accent" role="alert">
				{fieldErrors.email}
			</p>
		{/if}
	</div>

	<div class="grid gap-1.5">
		<label class="text-sm font-semibold text-ink" for="feedback-message">Message</label>
		<textarea
			id="feedback-message"
			name="message"
			rows="4"
			maxlength={FEEDBACK_MESSAGE_MAX}
			disabled={isBusy}
			class="rounded-[0.35rem] border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-sea disabled:cursor-not-allowed disabled:opacity-60"
			bind:value={message}
			aria-invalid={fieldErrors.message ? 'true' : undefined}
			aria-describedby={fieldErrors.message ? 'feedback-message-error' : undefined}
		></textarea>
		{#if fieldErrors.message}
			<p id="feedback-message-error" class="m-0 text-sm text-accent" role="alert">
				{fieldErrors.message}
			</p>
		{:else if !message.trim()}
			<p class="m-0 text-sm text-ink-soft">Share what worked, what broke, or what to try next.</p>
		{/if}
	</div>

	<LiquidGlassButton
		type="submit"
		label={isBusy ? 'Sending…' : 'Send feedback'}
		disabled={isBusy}
		class="justify-self-start"
	/>
</form>
