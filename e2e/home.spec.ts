import { expect, test } from '@playwright/test';

test.describe('Home landing page', () => {
	test('has brand title and main sections', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/Astro Svelte/);
		await expect(page.getByRole('banner')).toBeVisible();
		await expect(page.getByText('Astro Svelte').first()).toBeVisible();
		await expect(page.getByRole('heading', { name: /Static\s+speed\.\s+Interactive\s+islands\./i })).toBeVisible();
		await expect(page.locator('#features')).toBeVisible();
		await expect(page.locator('#how')).toBeVisible();
		await expect(page.locator('#live-repo')).toBeVisible();
		await expect(page.locator('#stack')).toBeVisible();
		await expect(page.locator('#cta')).toBeVisible();
		await expect(page.getByRole('contentinfo')).toBeVisible();
	});

	test('navbar links to features on the home page', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' }).click();
		await expect(page).toHaveURL(/\/#features/);
	});

	test('navbar navigates to the about route', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' }).click();
		await expect(page).toHaveURL(/\/about\/?$/);
		await expect(page.getByRole('heading', { name: /second route/i })).toBeVisible();
	});
});

test.describe('About feedback form', () => {
	test('shows validation errors for invalid input', async ({ page }) => {
		await page.goto('/about');

		await page.getByLabel('Name').fill('Ada');
		await page.getByLabel('Email').fill('not-an-email');
		await page.getByLabel('Message').fill('too short');
		await page.getByRole('button', { name: 'Send feedback' }).click();

		await expect(page.getByText('Enter a valid email')).toBeVisible();
		await expect(page.getByText(/Message must be at least/)).toBeVisible();
		await expect(page.getByText('Please fix the form')).toBeVisible();
	});

	test('submits feedback and shows a success toast', async ({ page }) => {
		await page.goto('/about');

		await page.getByLabel('Name').fill('Ada Lovelace');
		await page.getByLabel('Email').fill('ada@example.com');
		await page.getByLabel('Message').fill('Routing plus mutation toast feels solid for learning.');
		await page.getByRole('button', { name: 'Send feedback' }).click();

		await expect(page.getByText('Feedback sent')).toBeVisible();
		await expect(page.getByLabel('Name')).toHaveValue('');
	});
});
