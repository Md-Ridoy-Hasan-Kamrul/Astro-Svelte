// @ts-check
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, memoryCache } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-svelte.example.com',
	adapter: vercel(),
	integrations: [svelte(), sitemap()],
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	image: {
		domains: ['images.unsplash.com'],
	},
	cache: {
		provider: memoryCache(),
	},
	routeRules: {
		'/_server-islands/[...path]': {
			maxAge: 300,
			swr: 60,
			tags: ['server-islands'],
		},
	},
	vite: {
		plugins: [tailwindcss()],
		ssr: {
			noExternal: ['svelte-sonner'],
		},
	},
});
