import { expect, test } from '@playwright/test';

test('popup leaves pointer tracking when trackPointer becomes false', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/popup-track-pointer/');
	await page.waitForFunction(() => (window as unknown as { __setTrackPointer?: unknown }).__setTrackPointer);
	await expect(page.locator('.maplibregl-canvas-container')).toHaveClass(/maplibregl-track-pointer/);
	await expect(page.locator('.maplibregl-popup')).toHaveClass(/maplibregl-popup-track-pointer/);

	await page.evaluate(() => {
		(window as unknown as { __setTrackPointer: (next: boolean) => void }).__setTrackPointer(false);
	});

	await expect(page.locator('.maplibregl-canvas-container')).not.toHaveClass(/maplibregl-track-pointer/);
	await expect(page.locator('.maplibregl-popup')).not.toHaveClass(/maplibregl-popup-track-pointer/);
	expect(errors).toEqual([]);
});
