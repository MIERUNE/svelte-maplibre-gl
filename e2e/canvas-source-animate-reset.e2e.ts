import { expect, test } from '@playwright/test';

test('canvas source animate can be reset to the default', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/canvas-source-animate-reset/');
	await page.waitForFunction(() => (window as unknown as { __resetCanvasAnimate?: unknown }).__resetCanvasAnimate);
	await page.waitForFunction(() => {
		const source = (window as unknown as { __source: { animate: boolean } }).__source;
		return source.animate === false;
	});

	await page.evaluate(() => {
		(window as unknown as { __resetCanvasAnimate: () => void }).__resetCanvasAnimate();
	});

	await page.waitForFunction(() => {
		const source = (window as unknown as { __source: { animate: boolean; hasTransition(): boolean } }).__source;
		return source.animate === true && source.hasTransition() === true;
	});

	expect(errors).toEqual([]);
});
