import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts'],
		rules: {
			// suppress "Expected an assignment or function call and instead saw an expression"
			'@typescript-eslint/no-unused-expressions': 'off',
			// false positives with $bindable() default values
			'no-useless-assignment': 'off'
			// 'svelte/require-each-key': 'off'
		},
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['**/build/', '**/.svelte-kit/', '**/dist/']
	}
);
