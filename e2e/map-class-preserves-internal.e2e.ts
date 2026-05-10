import { expect, test } from '@playwright/test';

test('map class updates preserve MapLibre internal class', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/map-class-preserves-internal/');
	await page.waitForFunction(() => (window as unknown as { __setMapClass?: unknown }).__setMapClass);
	await expect(page.locator('.initial-map')).toHaveClass(/maplibregl-map/);

	await page.evaluate(() => {
		(window as unknown as { __setMapClass: (next: string) => void }).__setMapClass('updated-map h-[200px] w-full');
	});

	await expect(page.locator('.updated-map')).toHaveClass(/maplibregl-map/);
	await expect(page.locator('.initial-map')).toHaveCount(0);
	expect(errors).toEqual([]);
});
