<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { createAppQueryClient } from '../../lib/query/queryClient';
	import FeedbackFormPanel from './FeedbackFormPanel.svelte';

	const queryClient = createAppQueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<FeedbackFormPanel />
</QueryClientProvider>
