import { expect, test } from '@playwright/test';
import type { Map as MapLibreMap, ImageSource } from 'maplibre-gl';

type TestWindow = Window & { __map: MapLibreMap };

test('camera bindings and an initially empty image source work with current MapLibre', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/test/camera-compat/');
	await page.waitForFunction(() => (window as unknown as TestWindow).__map?.getSource('empty-image'));
	await page.getByRole('button', { name: 'Set camera' }).click();
	await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__map.getZoom())).toBeCloseTo(4);
	await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__map.getBearing())).toBeCloseTo(45);
	await page.evaluate(() => (window as unknown as TestWindow).__map.jumpTo({ zoom: 3, bearing: 20 }));
	await expect(page.locator('[data-camera]')).toHaveText('3.0 / 20.0');
	await page.getByRole('button', { name: 'Set image' }).click();
	await expect
		.poll(() =>
			page.evaluate(
				() => (window as unknown as TestWindow).__map.getSource<ImageSource>('empty-image')?.serialize().url
			)
		)
		.toContain('favicon.png');
	expect(errors).toEqual([]);
});
