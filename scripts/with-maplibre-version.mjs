#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , requestedVersion = 'next', ...command] = process.argv;

const workspacePath = resolve('pnpm-workspace.yaml');
const lockfilePath = resolve('pnpm-lock.yaml');

let originalWorkspace;
try {
	originalWorkspace = readFileSync(workspacePath, 'utf8');
} catch {
	console.error('pnpm-workspace.yaml not found. Run this command from the repository root.');
	process.exit(1);
}

let originalLockfile;
try {
	originalLockfile = readFileSync(lockfilePath, 'utf8');
} catch {
	originalLockfile = undefined;
}

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		stdio: 'inherit',
		shell: process.platform === 'win32',
		...options
	});

	if (result.error) {
		throw result.error;
	}

	return result.status ?? 1;
}

function getOutput(command, args) {
	const result = spawnSync(command, args, {
		encoding: 'utf8',
		shell: process.platform === 'win32'
	});

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		process.stderr.write(result.stderr);
		throw new Error(`${command} ${args.join(' ')} failed`);
	}

	return result.stdout.trim();
}

function restoreFiles() {
	writeFileSync(workspacePath, originalWorkspace);
	if (originalLockfile !== undefined) {
		writeFileSync(lockfilePath, originalLockfile);
	} else if (existsSync(lockfilePath)) {
		rmSync(lockfilePath);
	}
}

function restoreInstall() {
	console.log('Restoring dependencies from the original lockfile...');
	return run('pnpm', ['install']);
}

let restored = false;
function restoreOnce() {
	if (restored) return;
	restored = true;
	restoreFiles();
}

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.once(signal, () => {
		restoreOnce();
		process.kill(process.pid, signal);
	});
}

try {
	const resolvedVersion = getOutput('npm', ['view', `maplibre-gl@${requestedVersion}`, 'version'])
		.split('\n')
		.at(-1)
		?.replace(/["'\s]/g, '');

	if (!resolvedVersion) {
		throw new Error(`Could not resolve maplibre-gl@${requestedVersion}`);
	}

	console.log(`maplibre-gl: requested '${requestedVersion}' -> resolved '${resolvedVersion}'`);

	const catalogEntry = /^(\s*maplibre-gl:\s*).*$/m;
	if (!catalogEntry.test(originalWorkspace)) {
		throw new Error('maplibre-gl catalog entry not found in pnpm-workspace.yaml');
	}

	writeFileSync(workspacePath, originalWorkspace.replace(catalogEntry, `$1${resolvedVersion}`));

	const installStatus = run('pnpm', ['install', '--no-frozen-lockfile']);
	if (installStatus !== 0) {
		process.exitCode = installStatus;
	} else if (command.length > 0) {
		process.exitCode = run(command[0], command.slice(1));
	} else {
		console.log(`Installed maplibre-gl@${resolvedVersion}. No command was provided.`);
	}
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
} finally {
	restoreOnce();
	console.log(
		originalLockfile === undefined
			? 'Restored pnpm-workspace.yaml and removed the generated pnpm-lock.yaml.'
			: 'Restored pnpm-workspace.yaml and pnpm-lock.yaml.'
	);
	if (process.env.WITH_MAPLIBRE_SKIP_RESTORE_INSTALL !== '1') {
		const restoreStatus = restoreInstall();
		if (restoreStatus !== 0 && !process.exitCode) {
			process.exitCode = restoreStatus;
		}
	}
}
