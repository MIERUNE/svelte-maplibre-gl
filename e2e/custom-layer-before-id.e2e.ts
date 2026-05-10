import { expect, test } from '@playwright/test';

test('custom layer reacts to beforeId changes', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/custom-layer-before-id/');
	await page.waitForFunction(() => (window as unknown as { __map?: unknown }).__map);
	await page.waitForFunction(() => {
		const map = (window as unknown as { __map: { getLayer(id: string): unknown } }).__map;
		return map.getLayer('custom');
	});

	async function layerIds() {
		return page.evaluate(() => (window as unknown as { __map: { style: { _order: string[] } } }).__map.style._order);
	}

	let layers = await layerIds();
	let idx = (id: string) => layers.indexOf(id);
	expect(idx('custom')).toBe(idx('anchor-a') - 1);

	await page.evaluate(() => {
		(window as unknown as { __setCustomLayerBeforeId: (next: string | undefined) => void }).__setCustomLayerBeforeId(
			'anchor-b'
		);
	});
	await page.waitForFunction(() => {
		const ids = (window as unknown as { __map: { style: { _order: string[] } } }).__map.style._order;
		return ids.indexOf('custom') === ids.indexOf('anchor-b') - 1;
	});

	layers = await layerIds();
	idx = (id: string) => layers.indexOf(id);
	expect(idx('custom')).toBe(idx('anchor-b') - 1);

	await page.evaluate(() => {
		(window as unknown as { __setCustomLayerBeforeId: (next: string | undefined) => void }).__setCustomLayerBeforeId(
			undefined
		);
	});
	await page.waitForFunction(() => {
		const ids = (window as unknown as { __map: { style: { _order: string[] } } }).__map.style._order;
		return ids.at(-1) === 'custom';
	});

	expect(errors).toEqual([]);
});
