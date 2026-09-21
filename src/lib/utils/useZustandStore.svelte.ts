import type { StoreApi } from 'zustand/vanilla';

/**
 * Subscribe a Zustand vanilla store to Svelte 5 runes.
 * Use inside `.svelte` / `.svelte.ts` files only.
 */
export function useZustandStore<T>(store: StoreApi<T>) {
	let snapshot = $state.raw(store.getState());

	$effect(() => {
		return store.subscribe((next) => {
			snapshot = next;
		});
	});

	return {
		get state() {
			return snapshot;
		},
		setState: store.setState.bind(store),
		getState: store.getState.bind(store),
	};
}
