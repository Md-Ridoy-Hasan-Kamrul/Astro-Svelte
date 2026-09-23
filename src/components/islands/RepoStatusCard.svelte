<script lang="ts">
	/**
	 * Compact TanStack Query demo: loading / error / empty / success + cache refresh.
	 * Axios fetches; Query owns cache; Zustand only tracks HTTP pending/lastError.
	 */
	import { onMount } from 'svelte';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { fetchAstroRepo } from '../../lib/api/github';
	import { getAxiosErrorMessage } from '../../lib/api/axios';
	import { getCacheLabel, getQueryViewState } from '../../lib/query/queryUi';
	import { queryKeys } from '../../lib/query/queryClient';
	import { httpStore } from '../../stores/httpStore';
	import AsyncStatus from '../ui/AsyncStatus.svelte';

	const queryClient = useQueryClient();

	const repoQuery = createQuery(() => ({
		queryKey: queryKeys.astroRepo,
		queryFn: ({ signal }) => fetchAstroRepo(signal),
	}));

	let pendingHttp = $state(0);
	let lastHttpError = $state<string | null>(null);

	onMount(() =>
		httpStore.subscribe((state) => {
			pendingHttp = state.pendingRequests;
			lastHttpError = state.lastError;
		}),
	);

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

	const errorMessage = $derived(
		repoQuery.error ? getAxiosErrorMessage(repoQuery.error) : (lastHttpError ?? 'Request failed'),
	);

	function retry() {
		void repoQuery.refetch();
	}

	function refreshCache() {
		void queryClient.invalidateQueries({ queryKey: queryKeys.astroRepo });
	}
</script>

<section class="grid gap-3" aria-labelledby="repo-status-title">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<h3 id="repo-status-title" class="m-0 text-sm font-semibold text-ink">
			Live repo status
		</h3>
		<p class="m-0 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-soft">
			cache {cacheLabel}
			{#if pendingHttp > 0}
				· http…
			{/if}
		</p>
	</div>

	{#if view === 'loading'}
		<AsyncStatus tone="info" title="Loading repository…" busy />
	{:else if view === 'error'}
		<AsyncStatus
			tone="danger"
			title="Could not load repository"
			description={errorMessage}
			actionLabel="Try again"
			onAction={retry}
			busy={repoQuery.isFetching}
		/>
	{:else if !repoQuery.data}
		<AsyncStatus
			tone="neutral"
			title="No repository data"
			description="The query finished without a payload."
			actionLabel="Try again"
			onAction={retry}
		/>
	{:else}
		{#if view === 'refetching'}
			<AsyncStatus tone="info" title="Updating…" description="Showing cached data." busy />
		{/if}

		<article class="grid gap-1.5 rounded-lg border border-line bg-paper px-3.5 py-3">
			<a
				href={repoQuery.data.html_url}
				class="font-semibold text-ink no-underline hover:text-sea"
				target="_blank"
				rel="noopener noreferrer"
			>
				{repoQuery.data.full_name}
			</a>
			<p class="m-0 text-sm text-ink-soft">
				{repoQuery.data.description ?? 'No description yet.'}
			</p>
			<p class="m-0 text-xs text-ink-soft">
				★ {repoQuery.data.stargazers_count.toLocaleString()}
				{#if repoQuery.data.language}
					· {repoQuery.data.language}
				{/if}
			</p>
			<button
				type="button"
				class="mt-1 justify-self-start rounded-full border border-line bg-mist/60 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-mist disabled:opacity-60"
				disabled={repoQuery.isFetching}
				onclick={refreshCache}
			>
				Refresh cache
			</button>
		</article>
	{/if}
</section>
