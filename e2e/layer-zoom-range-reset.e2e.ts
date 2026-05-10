import { expect, test } from '@playwright/test';

test('layer minzoom and maxzoom can be reset to defaults', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/layer-zoom-range-reset/');
	await page.waitForFunction(() => (window as unknown as { __clearLayerZoomRange?: unknown }).__clearLayerZoomRange);
	await page.waitForFunction(() => {
		const layer = (
			window as unknown as {
				__map: {
					getLayer(id: string): { minzoom?: number; maxzoom?: number } | undefined;
				};
			}
		).__map.getLayer('zoom-range-layer');
		return layer?.minzoom === 4 && layer.maxzoom === 8;
	});
	await page.waitForFunction(() => {
		const map = (
			window as unknown as {
				__map: { queryRenderedFeatures(options: { layers: string[] }): unknown[] };
			}
		).__map;
		return map.queryRenderedFeatures({ layers: ['zoom-range-layer'] }).length === 0;
	});

	await page.evaluate(() => {
		(window as unknown as { __clearLayerZoomRange: () => void }).__clearLayerZoomRange();
	});

	await page.waitForFunction(() => {
		const map = (
			window as unknown as {
				__map: {
					getLayer(id: string): { minzoom?: number; maxzoom?: number } | undefined;
				};
			}
		).__map;
		const layer = map.getLayer('zoom-range-layer');
		return layer && layer.minzoom === 0 && layer.maxzoom === 24;
	});
	await page.waitForFunction(() => {
		const map = (
			window as unknown as {
				__map: { queryRenderedFeatures(options: { layers: string[] }): unknown[] };
			}
		).__map;
		return map.queryRenderedFeatures({ layers: ['zoom-range-layer'] }).length > 0;
	});

	expect(errors).toEqual([]);
});
