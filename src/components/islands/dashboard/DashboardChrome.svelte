<script lang="ts">
	/**
	 * Crextio top chrome — persists across dashboard soft navigations.
	 * Active tab follows the current path (no remount shake).
	 */
	import { onMount } from 'svelte';
	import { DASHBOARD_NAV, type DashboardNavId } from '../../../lib/dashboard/nav';

	let active = $state<DashboardNavId>('dashboard');

	function pathToActive(pathname: string): DashboardNavId {
		const path = pathname.replace(/\/$/, '') || '/';
		const match = DASHBOARD_NAV.find(
			(item) => item.href !== '/dashboard' && (path === item.href || path.startsWith(`${item.href}/`)),
		);
		return match?.id ?? 'dashboard';
	}

	function syncActive() {
		active = pathToActive(window.location.pathname);
	}

	onMount(() => {
		syncActive();
		document.addEventListener('astro:page-load', syncActive);
		window.addEventListener('popstate', syncActive);
		return () => {
			document.removeEventListener('astro:page-load', syncActive);
			window.removeEventListener('popstate', syncActive);
		};
	});
</script>

<header
	class="cx-chrome grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"
>
	<a
		href="/dashboard"
		data-astro-prefetch
		class="inline-flex h-9 shrink-0 items-center rounded-full border border-[#1c1c1c] px-4 text-sm font-medium tracking-tight text-[#1c1c1c] no-underline"
	>
		Crextio
	</a>

	<nav
		class="cx-chrome__nav mx-auto flex h-11 max-w-full items-center gap-0.5 overflow-x-auto overscroll-x-contain rounded-full bg-white/70 p-1 shadow-[0_10px_30px_rgb(28_28_28_/0.05)] backdrop-blur [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		aria-label="Dashboard"
	>
		{#each DASHBOARD_NAV as item}
			<a
				href={item.href}
				data-astro-prefetch
				aria-current={item.id === active ? 'page' : undefined}
				class="inline-flex h-9 shrink-0 items-center justify-center rounded-full px-3 text-[0.8rem] font-medium whitespace-nowrap no-underline transition-colors min-[1100px]:px-3.5 {item.id ===
				active
					? 'bg-[#1c1c1c] text-white'
					: 'text-[#1c1c1c]/75 hover:text-[#1c1c1c]'}"
			>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="flex h-11 shrink-0 items-center justify-end gap-2">
		<button
			type="button"
			class="inline-flex h-9 items-center gap-2 rounded-full border border-[#1c1c1c]/20 bg-white/80 px-3 text-sm font-medium text-[#1c1c1c]"
		>
			<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
				<path
					d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z
					M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.2.6.7 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="hidden min-[520px]:inline">Setting</span>
		</button>
		<button
			type="button"
			class="grid size-9 place-items-center rounded-full border border-[#1c1c1c]/15 bg-white/80"
			aria-label="Notifications"
		>
			<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
				<path
					d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Zm6 13a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Z"
					stroke-linecap="round"
				/>
			</svg>
		</button>
		<a
			href="/login"
			class="size-9 overflow-hidden rounded-full border border-[#1c1c1c]/15 no-underline"
			title="Sign out"
		>
			<img
				src="/dashboard/lora.jpg"
				alt="Admin"
				class="size-full object-cover"
				width="36"
				height="36"
			/>
		</a>
	</div>
</header>
