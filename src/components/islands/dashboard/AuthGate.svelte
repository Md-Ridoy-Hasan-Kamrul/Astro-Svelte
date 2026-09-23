<script lang="ts">
	/** Redirects to /login when the admin demo session is missing. */
	import { onMount } from 'svelte';
	import { readAdminSession } from '../../../lib/auth/session';

	onMount(() => {
		if (!readAdminSession()) {
			window.location.replace('/login');
		}
	});
</script>
