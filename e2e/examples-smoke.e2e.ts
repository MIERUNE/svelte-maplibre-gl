import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

// Discover example slugs at test-collection time.
const examplesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/examples');
const slugs = fs
	.readdirSync(examplesDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name)
	.sort();
const [maplibreMajor, maplibreMinor] = (process.env.MAPLIBRE_GL_VERSION ?? '')
	.split('.')
	.map((part) => Number.parseInt(part, 10));
const lacksWebGLStyleImages =
	Number.isFinite(maplibreMajor) && (maplibreMajor < 6 || (maplibreMajor === 6 && maplibreMinor < 3));

// Smoke check: visit each example and assert the page does not raise any
// uncaught errors. This catches addLayer/addSource crashes, missing imports,
// and similar regressions across the example surface. External-tile failures
// (AJAX errors logged to the console) are not page-level errors and don't
// fail the test.
test.describe('examples smoke', () => {
	test.describe.configure({ mode: 'parallel' });

	for (const slug of slugs) {
		test(slug, async ({ page }) => {
			test.skip(
				lacksWebGLStyleImages && slug === 'dynamic-image',
				'GPU-rendered style images require MapLibre GL JS 6.3 or later'
			);

			const errors: string[] = [];
			page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

			await page.goto(`/examples/${slug}/`, { waitUntil: 'domcontentloaded' });
			// Wait for network to settle, but bound the wait so examples that
			// keep network busy (e.g. animate-images cycles through frames;
			// especially in CI without warm caches) still proceed.
			await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

			expect(errors, `pageerrors on /examples/${slug}/`).toEqual([]);
		});
	}
});
