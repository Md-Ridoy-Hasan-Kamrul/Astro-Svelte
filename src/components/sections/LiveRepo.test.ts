import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, vi } from 'vitest';

vi.mock('../../lib/api/github', () => ({
	fetchAstroRepoCached: vi.fn(async () => ({
		full_name: 'withastro/astro',
		description: 'The web framework for content-driven websites.',
		stargazers_count: 1,
		html_url: 'https://github.com/withastro/astro',
		language: 'TypeScript',
	})),
}));

import LiveRepo from './LiveRepo.astro';

test('LiveRepo renders the GitHub snapshot', async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(LiveRepo);

	expect(result).toContain('id="live-repo"');
	expect(result).toContain('withastro/astro');
	expect(result).toContain('TypeScript');
});
