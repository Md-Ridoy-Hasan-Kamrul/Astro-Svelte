import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/svelte';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Services from './Services.astro';

describe('Services section', () => {
	it('renders accordion heading and service titles', async () => {
		const renderers = await loadRenderers([getContainerRenderer()]);
		const container = await AstroContainer.create({ renderers });
		const result = await container.renderToString(Services);

		expect(result).toContain('id="services"');
		expect(result).toContain('What we ship');
		expect(result).toContain('Astro pages');
		expect(result).toContain('Svelte islands');
		expect(result).toContain('Data &amp; feedback');
		expect(result).toContain('astro-island');
	});
});
