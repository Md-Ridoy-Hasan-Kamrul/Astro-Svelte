import { QueryClient } from '@tanstack/svelte-query';

export function createAppQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60_000,
				retry: 1,
				// Astro islands only run queries in the browser.
				enabled: typeof window !== 'undefined',
			},
			mutations: {
				retry: 0,
			},
		},
	});
}

/** Query keys — keep Axios calls behind these keys in components. */
export const queryKeys = {
	astroRepo: ['github', 'repo', 'withastro', 'astro'] as const,
	repo: (owner: string, name: string) => ['github', 'repo', owner, name] as const,
};
