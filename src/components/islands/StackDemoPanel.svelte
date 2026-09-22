<script lang="ts">
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { fetchAstroRepo } from '../../lib/api/github';
	import { queryKeys } from '../../lib/query/queryClient';
	import { getQueryViewState, getCacheLabel } from '../../lib/query/queryUi';
	import { getAxiosErrorMessage } from '../../lib/api/axios';
	import { appStore } from '../../stores/appStore';
	import { httpStore } from '../../stores/httpStore';
	import { useZustandStore } from '../../lib/utils/useZustandStore.svelte';
	import { toast } from 'svelte-sonner';
	import Icon from '../ui/Icon.svelte';

	const ui = useZustandStore(appStore);
	const http = useZustandStore(httpStore);
	const queryClient = useQueryClient();

	const repoQuery = createQuery(() => ({
		queryKey: queryKeys.astroRepo,
		queryFn: ({ signal }) => fetchAstroRepo(signal),
	}));

	const view = $derived(
		getQueryViewState({
			isPending: repoQuery.isPending,
			isError: repoQuery.isError,
			isFetching: repoQuery.isFetching,
			isStale: repoQuery.isStale,
			data: repoQuery.data,
			dataUpdatedAt: repoQuery.dataUpdatedAt,
		}),
	);
	const cacheLabel = $derived(
		getCacheLabel({
			dataUpdatedAt: repoQuery.dataUpdatedAt,
			isStale: repoQuery.isStale,
		}),
	);
	const queryError = $derived(
		repoQuery.isError ? getAxiosErrorMessage(repoQuery.error) : null,
	);
	const hasCachedData = $derived(repoQuery.data != null);

	function countVisit() {
		ui.state.incrementVisits();
		toast.success('Visit counted', {
			description: `Total visits: ${appStore.getState().visits}`,
		});
	}

	function retryFetch() {
		ui.state.setLastAction('retried github fetch');
		http.state.setLastError(null);
		toast.message('Retrying GitHub fetch…');
		void repoQuery.refetch().then((result) => {
			if (result.error) {
				toast.error('Retry failed', {
					description: getAxiosErrorMessage(result.error),
				});
				return;
			}
			toast.success('GitHub data refreshed');
		});
	}

	function refreshCache() {
		ui.state.setLastAction('cache invalidated');
		toast.message('Refreshing cache…');
		void queryClient.invalidateQueries({ queryKey: queryKeys.astroRepo }).then(() => {
			toast.success('Cache refreshed');
		});
	}
</script>

<div class="grid gap-6 md:grid-cols-2">
	<div class="border border-ink/10 bg-paper/80 p-5">
		<h3 class="mb-2 inline-flex items-center gap-2 font-display text-lg font-bold text-ink">
			<Icon name="database" class="size-5" />
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
			onclick={countVisit}
		>
			Count visit
		</button>
	</div>

	<div class="border border-ink/10 bg-paper/80 p-5" aria-busy={repoQuery.isFetching}>
		<h3 class="mb-2 inline-flex items-center gap-2 font-display text-lg font-bold text-ink">
			<Icon name="cloud" class="size-5" />
			Axios + TanStack Query
		</h3>

		<p class="mb-3 text-sm text-ink-soft" aria-live="polite">
			State: <strong class="text-ink">{view}</strong>
			<span class="mx-2 text-ink/30">·</span>
			Cache: <strong class="text-ink">{cacheLabel}</strong>
			{#if view === 'refetching'}
				<span class="mx-2 text-ink/30">·</span>
				Updating…
			{/if}
		</p>

		{#if view === 'loading'}
			<p class="inline-flex items-center gap-2 text-ink-soft">
				<Icon name="spinner" class="size-4 animate-spin" />
				Loading via Axios…
			</p>
		{:else if view === 'error'}
			<div class="text-accent" role="alert">
				<p class="mb-3 inline-flex items-center gap-2 font-semibold">
					<Icon name="warning" class="size-5" />
					Request failed
				</p>
				<p class="mb-4 text-sm">{queryError}</p>
				<button
					type="button"
					class="min-h-11 bg-accent px-4 font-bold text-paper transition hover:-translate-y-px"
					onclick={retryFetch}
				>
					Try again
				</button>
			</div>
		{:else}
			{#if repoQuery.isError && hasCachedData}
				<div class="mb-4 border border-accent/30 bg-sand/40 p-3 text-sm text-accent" role="status">
					<p class="mb-2">
						Refresh failed — showing cached data. {queryError}
					</p>
					<button
						type="button"
						class="min-h-10 bg-accent px-3 font-bold text-paper"
						onclick={retryFetch}
					>
						Try again
					</button>
				</div>
			{/if}

			{#if repoQuery.data}
				<p class="mb-2 font-semibold text-ink">{repoQuery.data.full_name}</p>
				<p class="mb-3 text-sm text-ink-soft">{repoQuery.data.description}</p>
				<p class="mb-1 text-ink-soft">
					★ {repoQuery.data.stargazers_count.toLocaleString()} stars
				</p>
				{#if repoQuery.data.language}
					<p class="mb-4 text-sm text-ink-soft">Language: {repoQuery.data.language}</p>
				{/if}
				<div class="flex flex-wrap items-center gap-3">
					<a
						class="font-bold text-sea underline-offset-2 hover:underline"
						href={repoQuery.data.html_url}
						target="_blank"
						rel="noopener noreferrer"
						onclick={() => ui.state.setLastAction('opened github')}
					>
						View on GitHub
					</a>
					<button
						type="button"
						class="min-h-11 border border-ink/15 bg-mist px-4 font-bold text-ink transition hover:-translate-y-px"
						onclick={refreshCache}
						disabled={repoQuery.isFetching}
					>
						Refresh cache
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>
