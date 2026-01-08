/**
 * Shell command execution utilities
 */

import { spawn } from 'child_process';
import { DEFAULT_TIMEOUT } from '../constants';
import { logger } from './logger';

export interface CommandOptions {
  cwd?: string;
  timeout?: number;
  silent?: boolean;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Run a shell command and return the result
 */
export async function runCommand(
  command: string,
  args: string[],
  options: CommandOptions = {}
): Promise<CommandResult> {
  const { cwd, timeout = DEFAULT_TIMEOUT, silent = false } = options;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: true,
      stdio: silent ? 'pipe' : 'inherit',
    });

    let stdout = '';
    let stderr = '';

    if (silent && child.stdout) {
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }

    if (silent && child.stderr) {
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    // Set up timeout
    const timeoutId = setTimeout(() => {
      child.kill();
      reject(new Error(`Command timed out after ${timeout}ms`));
    }, timeout);

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0,
      });
    });

    child.on('error', (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });

    // Close stdin to prevent hanging on interactive prompts
    if (child.stdin) {
      child.stdin.end();
    }
  });
}

/**
 * Run yarn install in a directory
 */
export async function installDependencies(
  directory: string,
  options: { silent?: boolean } = {}
): Promise<void> {
  const { silent = false } = options;

  if (!silent) {
    logger.info('Installing dependencies...');
  }

  const result = await runCommand('yarn', ['install'], {
    cwd: directory,
    silent,
    timeout: DEFAULT_TIMEOUT,
  });

  if (result.exitCode !== 0) {
    throw new Error('Failed to install dependencies');
  }
}

/**
 * Check if a command exists
 */
export async function commandExists(command: string): Promise<boolean> {
  try {
    const result = await runCommand('which', [command], { silent: true });
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

/**
 * Get the current yarn version
 */
export async function getYarnVersion(): Promise<string | null> {
  try {
    const result = await runCommand('yarn', ['--version'], { silent: true });
    return result.stdout.trim();
  } catch {
    return null;
  }
}

/**
 * Get the current node version
 */
export async function getNodeVersion(): Promise<string | null> {
  try {
    const result = await runCommand('node', ['--version'], { silent: true });
    return result.stdout.trim().replace('v', '');
  } catch {
    return null;
  }
}
