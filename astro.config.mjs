// @ts-check
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, memoryCache } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [svelte()],
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
	},
});
