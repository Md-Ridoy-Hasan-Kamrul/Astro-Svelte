import { expect, test } from '@playwright/test';

test.describe('Home landing page', () => {
	test('has brand title and main sections', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/Astro Svelte/);
		await expect(page.getByRole('banner')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Static speed. Interactive islands.' })).toBeVisible();
		await expect(page.locator('#features')).toBeVisible();
		await expect(page.locator('#how')).toBeVisible();
		await expect(page.locator('#live-repo')).toBeVisible();
		await expect(page.locator('#stack')).toBeVisible();
		await expect(page.locator('#cta')).toBeVisible();
		await expect(page.getByRole('contentinfo')).toBeVisible();
	});

	test('navbar links to features', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' }).click();
		await expect(page).toHaveURL(/#features/);
	});
});
