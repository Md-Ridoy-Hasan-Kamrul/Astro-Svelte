<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { createAppQueryClient } from '../../lib/query/queryClient';
	import FeedbackFormPanel from './FeedbackFormPanel.svelte';
	import RepoStatusCard from './RepoStatusCard.svelte';

	const queryClient = createAppQueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<div class="grid gap-6">
		<RepoStatusCard />
		<hr class="m-0 border-0 border-t border-line" />
		<FeedbackFormPanel />
	</div>
</QueryClientProvider>
