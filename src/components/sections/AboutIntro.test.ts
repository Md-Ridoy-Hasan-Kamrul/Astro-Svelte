import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import AboutIntro from './AboutIntro.astro';

test('AboutIntro explains the about route', async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(AboutIntro);

	expect(result).toContain('id="about-intro"');
	expect(result).toContain('/about');
	expect(result).toContain('second route');
});
