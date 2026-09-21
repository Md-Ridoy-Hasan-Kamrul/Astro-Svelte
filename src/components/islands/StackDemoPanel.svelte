<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { fetchAstroRepo } from '../../lib/api/github';
	import { queryKeys } from '../../lib/query/queryClient';
	import { getAxiosErrorMessage } from '../../lib/api/axios';
	import { appStore } from '../../stores/appStore';
	import { httpStore } from '../../stores/httpStore';
	import { useZustandStore } from '../../lib/utils/useZustandStore.svelte';

	const ui = useZustandStore(appStore);
	const http = useZustandStore(httpStore);

	// Axios → TanStack Query (server state). Zustand only tracks HTTP status / UI.
	const repoQuery = createQuery(() => ({
		queryKey: queryKeys.astroRepo,
		queryFn: fetchAstroRepo,
	}));

	const queryError = $derived(
		repoQuery.isError ? getAxiosErrorMessage(repoQuery.error) : null,
	);
</script>

<div class="grid gap-6 md:grid-cols-2">
	<div class="border border-ink/10 bg-paper/80 p-5">
		<h3 class="mb-2 font-display text-lg font-bold text-ink">
			<i class="las la-database" aria-hidden="true"></i>
			Zustand (client)
		</h3>
		<p class="mb-2 text-ink-soft">
			Visits: <strong class="text-ink">{ui.state.visits}</strong>
			<span class="mx-2 text-ink/30">·</span>
			Last: {ui.state.lastAction}
		</p>
		<p class="mb-4 text-sm text-ink-soft">
			HTTP pending: <strong class="text-ink">{http.state.pendingRequests}</strong>
			{#if http.state.lastError}
				<span class="mx-2 text-ink/30">·</span>
				<span class="text-accent">Error: {http.state.lastError}</span>
			{/if}
		</p>
		<button
			type="button"
			class="min-h-11 bg-sea px-4 font-bold text-paper transition hover:-translate-y-px hover:bg-sea-deep"
			onclick={() => ui.state.incrementVisits()}
		>
			Count visit
		</button>
	</div>

	<div class="border border-ink/10 bg-paper/80 p-5">
		<h3 class="mb-2 font-display text-lg font-bold text-ink">
			<i class="las la-cloud" aria-hidden="true"></i>
			Axios + TanStack Query
		</h3>
		{#if repoQuery.isPending}
			<p class="text-ink-soft">Loading via Axios…</p>
		{:else if repoQuery.isError}
			<p class="text-accent">Error: {queryError}</p>
		{:else if repoQuery.isSuccess}
			<p class="mb-2 font-semibold text-ink">{repoQuery.data.full_name}</p>
			<p class="mb-3 text-sm text-ink-soft">{repoQuery.data.description}</p>
			<p class="mb-1 text-ink-soft">
				★ {repoQuery.data.stargazers_count.toLocaleString()} stars
			</p>
			{#if repoQuery.data.language}
				<p class="mb-4 text-sm text-ink-soft">Language: {repoQuery.data.language}</p>
			{/if}
			<a
				class="font-bold text-sea underline-offset-2 hover:underline"
				href={repoQuery.data.html_url}
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => ui.state.setLastAction('opened github')}
			>
				View on GitHub
			</a>
		{/if}
	</div>
</div>
