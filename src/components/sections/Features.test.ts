import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Features from './Features.astro';

test('Features section renders titles', async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Features);

	expect(result).toContain('id="features"');
	expect(result).toContain('What this stack is for');
	expect(result).toContain('Astro pages');
	expect(result).toContain('Svelte islands');
});
