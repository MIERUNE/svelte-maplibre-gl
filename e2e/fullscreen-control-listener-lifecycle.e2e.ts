import { expect, test } from '@playwright/test';

test('fullscreen listeners survive control recreation', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/fullscreen-control-listener-lifecycle/');

	const initialFullscreenButton = page.locator('.maplibregl-ctrl-fullscreen');
	await expect(initialFullscreenButton).toBeVisible();
	const initialHandle = await initialFullscreenButton.elementHandle();

	await page.getByTestId('recreate-fullscreen-control').click();
	if (initialHandle) {
		await page.waitForFunction((el) => !el.isConnected, initialHandle);
	}

	const fullscreenButton = page.locator('.maplibregl-ctrl-fullscreen');
	await expect(fullscreenButton).toBeVisible();
	await fullscreenButton.click();
	await expect(page.getByTestId('fullscreen-events')).toHaveText('1:0');

	await page.locator('.maplibregl-ctrl-shrink').click();
	await expect(page.getByTestId('fullscreen-events')).toHaveText('1:1');

	expect(errors).toEqual([]);
});
