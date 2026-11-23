import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './e2e',
	testMatch: '**/*.e2e.ts',
	outputDir: process.env.DEV_RUNNER_ARTIFACTS,
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL,
		channel: 'chrome',
		headless: false,
		launchOptions: { args: ['--ozone-platform=x11', `--class=${process.env.DEV_RUNNER_CHROME_CLASS}`] }
	}
});
