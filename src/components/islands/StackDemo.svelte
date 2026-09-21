<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { createAppQueryClient } from '../../lib/query/queryClient';
	import StackDemoPanel from './StackDemoPanel.svelte';

	const queryClient = createAppQueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<section
		id="stack"
		class="mx-auto w-[min(100%-2rem,72rem)] py-14 md:py-20"
		aria-labelledby="stack-title"
	>
		<p class="mb-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-sea">
			Stack demo
		</p>
		<h2
			id="stack-title"
			class="mb-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl"
		>
			Axios · Zustand · TanStack · TypeScript
		</h2>
		<p class="mb-8 max-w-xl text-lg text-ink-soft">
			Axios handles HTTP, TanStack Query owns loading / error / cache, Zustand keeps client UI /
			request status. Failed fetches stay on screen with retry — hydrated with
			<code class="rounded bg-foam/70 px-1.5 py-0.5 text-[0.95em]">client:visible</code>.
		</p>

		<StackDemoPanel />
	</section>
</QueryClientProvider>
