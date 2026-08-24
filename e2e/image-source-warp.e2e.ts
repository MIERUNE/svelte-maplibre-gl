import { expect, test } from '@playwright/test';

test('image source warp is reactive and survives style swaps', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

	await page.goto('/test/image-source-warp/');
	await page.waitForFunction(() => (window as unknown as { __getImageWarp?: unknown }).__getImageWarp);

	const supported = await page.evaluate(
		() => (window as unknown as { __getImageWarp: () => string }).__getImageWarp() !== 'unsupported'
	);

	if (supported) {
		await page.waitForFunction(
			() => (window as unknown as { __getImageWarp: () => string }).__getImageWarp() === 'perspective'
		);
	}

	await page.evaluate(() => {
		(window as unknown as { __setImageWarp: (warp: string) => void }).__setImageWarp('flat');
	});
	if (supported) {
		await page.waitForFunction(
			() => (window as unknown as { __getImageWarp: () => string }).__getImageWarp() === 'flat'
		);
	}

	await page.evaluate(() => {
		(window as unknown as { __setImageWarp: (warp: undefined) => void }).__setImageWarp(undefined);
	});
	if (supported) {
		await page.waitForFunction(
			() => (window as unknown as { __getImageWarp: () => string }).__getImageWarp() === 'auto'
		);
	}

	await page.evaluate(() => {
		const win = window as unknown as {
			__setImageWarp: (warp: string) => void;
			__swapImageWarpStyle: () => void;
		};
		win.__setImageWarp('perspective');
		win.__swapImageWarpStyle();
	});
	await page.waitForFunction(() => {
		const map = (window as unknown as { __map?: { getLayer(id: string): unknown } }).__map;
		return map?.getLayer('background-b');
	});

	if (supported) {
		await page.waitForFunction(
			() => (window as unknown as { __getImageWarp: () => string }).__getImageWarp() === 'perspective'
		);
	} else {
		expect(await page.evaluate(() => (window as unknown as { __getImageWarp: () => string }).__getImageWarp())).toBe(
			'unsupported'
		);
	}

	expect(errors).toEqual([]);
});
