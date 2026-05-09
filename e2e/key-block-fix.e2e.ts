import { expect, test } from '@playwright/test';

// Regression test for #137: a source/layer pair declared inside a `{#key}`
// block must survive repeated key bumps without colliding with the previous
// mount (e.g. "Source 'source-1' already exists.").
test('source/layer inside {#key} block survives 20 re-renders', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message));

	await page.goto('/test/key-block-repro/');
	await page.waitForLoadState('networkidle');

	const button = page.getByTestId('rerender');
	for (let i = 0; i < 20; i++) {
		await button.click();
		await page.waitForTimeout(50);
	}
	await page.waitForTimeout(500);

	expect(errors).toEqual([]);
});
