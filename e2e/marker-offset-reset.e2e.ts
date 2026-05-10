import { expect, test } from '@playwright/test';

test('marker offset can be reset to the default', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/marker-offset-reset/');
	await page.waitForFunction(() => (window as unknown as { __setMarkerOffset?: unknown }).__setMarkerOffset);
	const marker = page.locator('.offset-marker');
	await expect(marker).toBeVisible();

	const initialX = await marker.evaluate((el) => el.getBoundingClientRect().x);

	await page.evaluate(() => {
		(window as unknown as { __setMarkerOffset: (next: [number, number] | undefined) => void }).__setMarkerOffset([
			40, 0
		]);
	});
	await expect.poll(async () => marker.evaluate((el) => el.getBoundingClientRect().x)).toBeGreaterThan(initialX + 30);

	await page.evaluate(() => {
		(window as unknown as { __setMarkerOffset: (next: [number, number] | undefined) => void }).__setMarkerOffset(
			undefined
		);
	});
	await expect.poll(async () => marker.evaluate((el) => el.getBoundingClientRect().x)).toBeCloseTo(initialX, 0);

	expect(errors).toEqual([]);
});
