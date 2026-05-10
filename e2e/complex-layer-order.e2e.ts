import { expect, test } from '@playwright/test';

// Regression test for the markup-order layer placement that broke when
// addLayer was moved into $effect (post-order DFS): siblings interleaving
// RasterLayer + BackgroundLayer anchors + source-bound layers must end up
// in style.layers in their markup order so that beforeId references and
// z-ordering remain intuitive.
test('layers are inserted in markup order with beforeId resolution', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/complex-layer-order/');
	await page.waitForFunction(() => (window as unknown as { __map?: unknown }).__map);
	// Allow the queued mount microtasks to flush.
	await page.waitForTimeout(200);

	const layers = await page.evaluate(() =>
		(window as unknown as { __map: { getStyle(): { layers: { id: string }[] } } }).__map
			.getStyle()
			.layers.map((l) => l.id)
	);

	expect(errors).toEqual([]);

	const idx = (id: string) => layers.indexOf(id);
	for (const id of ['raster', 'dummy1', 'dummy2', 'dummy3', 'line', 'fill', 'circles']) {
		expect(idx(id), `layer "${id}" missing from style.layers`).toBeGreaterThanOrEqual(0);
	}

	// raster has no beforeId and is first in markup → bottom of the stack
	expect(idx('raster')).toBeLessThan(idx('dummy1'));

	// fill has beforeId="dummy2" → fill comes immediately before dummy2
	expect(idx('fill')).toBeLessThan(idx('dummy2'));

	// line and circles both have beforeId="dummy3" → both come before dummy3
	expect(idx('line')).toBeLessThan(idx('dummy3'));
	expect(idx('circles')).toBeLessThan(idx('dummy3'));

	// markup order between line (declared first) and circles is preserved
	expect(idx('line')).toBeLessThan(idx('circles'));

	// dummy1 < dummy2 < dummy3 (BackgroundLayer markup order)
	expect(idx('dummy1')).toBeLessThan(idx('dummy2'));
	expect(idx('dummy2')).toBeLessThan(idx('dummy3'));
});
