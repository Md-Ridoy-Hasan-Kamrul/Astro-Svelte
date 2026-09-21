/** UI states for a TanStack Query result — keep payload in Query, not Zustand. */
export type QueryViewState = 'loading' | 'refetching' | 'error' | 'success';

export type QueryViewInput = {
	isPending: boolean;
	isError: boolean;
	isFetching: boolean;
	isStale: boolean;
	data: unknown;
	dataUpdatedAt: number;
};

export function getQueryViewState(query: QueryViewInput): QueryViewState {
	if (query.isPending) {
		return 'loading';
	}

	if (query.isError && query.data == null) {
		return 'error';
	}

	if (query.isFetching) {
		return 'refetching';
	}

	return 'success';
}

export function getCacheLabel(query: Pick<QueryViewInput, 'dataUpdatedAt' | 'isStale'>): string {
	if (!query.dataUpdatedAt) {
		return 'empty';
	}

	return query.isStale ? 'stale' : 'fresh';
}
