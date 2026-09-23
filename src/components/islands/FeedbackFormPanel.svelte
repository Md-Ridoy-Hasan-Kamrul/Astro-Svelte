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
	import LiquidGlassButton from '../ui/LiquidGlassButton.svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let fieldErrors = $state<FeedbackFieldErrors>({});

	const feedbackMutation = createMutation(() => ({
		mutationFn: (input: FeedbackInput) => submitFeedback(input),
		onSuccess: (result) => {
			if (!result.ok) {
				fieldErrors = result.errors ?? {};
				toast.error('Please fix the form', {
					description: result.message ?? 'Check the highlighted fields.',
				});
				return;
			}

			fieldErrors = {};
			name = '';
			email = '';
			message = '';
			toast.success('Feedback sent', {
				description: 'Thanks — we saved your message.',
			});
		},
		onError: (error) => {
			toast.error('Could not send feedback', {
				description: getAxiosErrorMessage(error),
			});
		},
	}));

	function onSubmit(event: Event) {
		event.preventDefault();

		const parsed = validateFeedback({ name, email, message });
		if (!parsed.ok) {
			fieldErrors = parsed.errors;
			toast.error('Please fix the form');
			return;
		}

		fieldErrors = {};
		feedbackMutation.mutate(parsed.data);
	}
</script>

<form
	class="grid gap-4"
	aria-labelledby="feedback-title"
	onsubmit={onSubmit}
	novalidate
>
	<div class="grid gap-1.5">
		<label class="text-sm font-semibold text-ink" for="feedback-name">Name</label>
		<input
			id="feedback-name"
			name="name"
			type="text"
			autocomplete="name"
			maxlength={FEEDBACK_NAME_MAX}
			class="min-h-11 rounded-[0.35rem] border border-line bg-paper px-3 text-ink outline-none focus:border-sea"
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
			class="min-h-11 rounded-[0.35rem] border border-line bg-paper px-3 text-ink outline-none focus:border-sea"
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
			class="rounded-[0.35rem] border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-sea"
			bind:value={message}
			aria-invalid={fieldErrors.message ? 'true' : undefined}
			aria-describedby={fieldErrors.message ? 'feedback-message-error' : undefined}
		></textarea>
		{#if fieldErrors.message}
			<p id="feedback-message-error" class="m-0 text-sm text-accent" role="alert">
				{fieldErrors.message}
			</p>
		{/if}
	</div>

	<LiquidGlassButton
		type="submit"
		label={feedbackMutation.isPending ? 'Sending…' : 'Send feedback'}
		disabled={feedbackMutation.isPending}
		class="justify-self-start"
	/>
</form>
