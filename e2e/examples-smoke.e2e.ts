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

// Smoke check: visit each example and assert the page does not raise any
// uncaught errors. This catches addLayer/addSource crashes, missing imports,
// and similar regressions across the example surface. External-tile failures
// (AJAX errors logged to the console) are not page-level errors and don't
// fail the test.
test.describe('examples smoke', () => {
	for (const slug of slugs) {
		test(slug, async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (err) => errors.push(err.message.split('\n')[0]));

			await page.goto(`/examples/${slug}/`, { waitUntil: 'domcontentloaded' });
			// Wait for network to settle, with a fallback for examples that keep
			// network busy (e.g. animate-images cycles through frames; in CI
			// without warm caches the gap is too small to reach networkidle).
			await Promise.race([
				page.waitForLoadState('networkidle').catch(() => {}),
				page.waitForTimeout(3000)
			]);

			expect(errors, `pageerrors on /examples/${slug}/`).toEqual([]);
		});
	}
});
