#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , requestedVersion = '5', ...command] = process.argv;

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

function signalExitCode(signal) {
	return signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : 1;
}

class InterruptedError extends Error {
	constructor(signal) {
		super(`Interrupted by ${signal}`);
		this.signal = signal;
	}
}

let interruptedSignal;
function markInterrupted(signal) {
	interruptedSignal ??= signal;
	process.exitCode = signalExitCode(interruptedSignal);
}

function throwIfInterrupted() {
	if (interruptedSignal) {
		throw new InterruptedError(interruptedSignal);
	}
}

function run(command, args, options = {}) {
	const { allowAfterInterrupt = false, ...spawnOptions } = options;
	if (interruptedSignal && !allowAfterInterrupt) {
		return signalExitCode(interruptedSignal);
	}

	const result = spawnSync(command, args, {
		stdio: 'inherit',
		shell: process.platform === 'win32',
		...spawnOptions
	});

	if (result.error) {
		throw result.error;
	}

	if (result.signal) {
		markInterrupted(result.signal);
		return signalExitCode(result.signal);
	}

	return result.status ?? 1;
}

function getOutput(command, args) {
	throwIfInterrupted();

	const result = spawnSync(command, args, {
		encoding: 'utf8',
		shell: process.platform === 'win32'
	});

	if (result.error) {
		throw result.error;
	}

	if (result.signal) {
		markInterrupted(result.signal);
		throw new InterruptedError(result.signal);
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
	return run('pnpm', ['install'], { allowAfterInterrupt: true });
}

let restored = false;
function restoreOnce() {
	if (restored) return;
	restored = true;
	restoreFiles();
}

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		markInterrupted(signal);
	});
}

try {
	const versionOutput = getOutput('npm', ['view', `maplibre-gl@${requestedVersion}`, 'version']);
	const resolvedVersion = versionOutput.match(/\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?/g)?.at(-1);

	throwIfInterrupted();

	if (!resolvedVersion) {
		throw new Error(`Could not resolve maplibre-gl@${requestedVersion}`);
	}

	console.log(`maplibre-gl: requested '${requestedVersion}' -> resolved '${resolvedVersion}'`);

	const catalogEntry = /^(\s*maplibre-gl:\s*).*$/m;
	if (!catalogEntry.test(originalWorkspace)) {
		throw new Error('maplibre-gl catalog entry not found in pnpm-workspace.yaml');
	}

	writeFileSync(workspacePath, originalWorkspace.replace(catalogEntry, `$1${resolvedVersion}`));
	throwIfInterrupted();

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
	process.exitCode = error instanceof InterruptedError ? signalExitCode(error.signal) : 1;
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
