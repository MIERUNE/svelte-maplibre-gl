import { expect, test } from '@playwright/test';

test('user layers keep their following base-layer anchor across style swaps', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/style-swap-layer-order/');
	await page.waitForFunction(() => (window as unknown as { __map?: unknown }).__map);
	await page.waitForFunction(() => {
		const map = (window as unknown as { __map: { getStyle(): { layers: { id: string }[] } } }).__map;
		const ids = map.getStyle().layers.map((layer) => layer.id);
		return ids.includes('user-before-a') && ids.includes('user-before-b');
	});

	await page.evaluate(() => {
		(window as unknown as { __setStyleVariant: (next: 'a' | 'b') => void }).__setStyleVariant('b');
	});

	await page.waitForFunction(() => {
		const map = (window as unknown as { __map: { getStyle(): { layers: { id: string }[] } } }).__map;
		const ids = map.getStyle().layers.map((layer) => layer.id);
		return ids.includes('base-b-top') && ids.includes('user-before-a') && ids.includes('user-before-b');
	});

	const layers = await page.evaluate(() =>
		(window as unknown as { __map: { getStyle(): { layers: { id: string }[] } } }).__map
			.getStyle()
			.layers.map((layer) => layer.id)
	);

	expect(errors).toEqual([]);

	const idx = (id: string) => layers.indexOf(id);
	for (const id of [
		'base-b-top',
		'anchor-b',
		'base-b-middle',
		'anchor-a',
		'base-b-bottom',
		'user-before-a',
		'user-before-b'
	]) {
		expect(idx(id), `layer "${id}" missing from style.layers`).toBeGreaterThanOrEqual(0);
	}

	expect(idx('user-before-a')).toBe(idx('anchor-a') - 1);
	expect(idx('user-before-b')).toBe(idx('anchor-b') - 1);
	expect(idx('user-before-b')).toBeLessThan(idx('base-b-middle'));
	expect(idx('user-before-a')).toBeGreaterThan(idx('base-b-middle'));
});
