import { expect, test } from '@playwright/test';
import type { Map as MapLibreMap } from 'maplibre-gl';

type TestWindow = Window & { __map: MapLibreMap };

test('reconciles initial global state changed before an asynchronous style loads', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	let releaseStyle!: () => void;
	const styleGate = new Promise<void>((resolve) => {
		releaseStyle = resolve;
	});
	await page.route('**/delayed-global-state-style.json', async (route) => {
		await styleGate;
		await route.fulfill({ json: { version: 8, sources: {}, layers: [] } });
	});
	try {
		await page.goto('/test/global-state-initial/', { waitUntil: 'domcontentloaded' });
		await page.waitForFunction(() => Boolean((window as unknown as TestWindow).__map));
		await page.getByRole('button', { name: 'Update state' }).click();
		await expect(page.locator('[data-global-state]')).toHaveText(
			JSON.stringify({ kept: 'same', changed: 'after', added: 'new' })
		);
		releaseStyle();
		await expect
			.poll(() =>
				page.evaluate(() => {
					const state = (window as unknown as TestWindow).__map.getGlobalState();
					return { removed: state.removed ?? null, kept: state.kept, changed: state.changed, added: state.added };
				})
			)
			.toEqual({ removed: null, kept: 'same', changed: 'after', added: 'new' });
		expect(errors).toEqual([]);
	} finally {
		releaseStyle();
	}
});
