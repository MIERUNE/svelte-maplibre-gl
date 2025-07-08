import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { searchForWorkspaceRoot } from "vite";
import svelteDocgenPlugin from "vite-plugin-svelte-docgen";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [svelteDocgenPlugin(), tailwindcss(), sveltekit()],

	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd())],
		},
	},

	resolve: {
		alias: {
			path: "pathe",
		},
	},

	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
});
