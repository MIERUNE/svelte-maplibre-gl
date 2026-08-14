import { expect, test } from '@playwright/test';

test('swapping a custom control removes the previous one', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/custom-control-swap/');

	await expect(page.getByTestId('custom-control-a')).toBeVisible();
	await expect(page.getByTestId('custom-control-b')).toHaveCount(0);

	await page.getByTestId('swap-custom-control').click();

	await expect(page.getByTestId('custom-control-b')).toBeVisible();
	// The previously added control must be removed, not left behind on the map.
	await expect(page.getByTestId('custom-control-a')).toHaveCount(0);

	expect(errors).toEqual([]);
});
