/**
 * Project Workspace Scaffolding
 *
 * For project-type scenarios, scaffolds a real project using the
 * idealyst CLI (instead of the minimal symlinked workspace used
 * for component scenarios).
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import type { ProjectScenario, ScaffoldCommand } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../..");

export interface ProjectWorkspaceInfo {
  /** Root of the temp directory */
  tempDir: string;
  /** Root of the scaffolded project (inside tempDir) */
  projectRoot: string;
  /** Cleanup function to remove the workspace */
  cleanup: () => void;
}

/**
 * Scaffold a project workspace by running CLI commands.
 *
 * Creates a temp directory and executes each scaffold command in sequence.
 * The idealyst CLI must be built and accessible.
 */
export function scaffoldProjectWorkspace(
  scenario: ProjectScenario,
  runId: string
): ProjectWorkspaceInfo {
  const tempDir = path.join("/tmp", `eval-project-${runId}`);

  // Create temp directory
  fs.mkdirSync(tempDir, { recursive: true });

  // Resolve the CLI path — prefer the built local copy
  const cliPath = resolveCliPath();

  // Execute each scaffold command
  for (const cmd of scenario.scaffoldCommands) {
    const cwd = cmd.cwd
      ? path.isAbsolute(cmd.cwd)
        ? cmd.cwd
        : path.join(tempDir, cmd.cwd)
      : tempDir;

    const timeoutMs = cmd.timeoutMs ?? 60_000;

    // Replace 'idealyst' or 'npx idealyst' with the resolved CLI path
    const resolvedCommand = resolveCommand(cmd.command, cliPath);

    try {
      execSync(resolvedCommand, {
        cwd,
        timeout: timeoutMs,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
        shell: "/bin/bash",
        env: {
          ...process.env,
          // Ensure the CLI doesn't prompt for input
          CI: "true",
        },
      });
    } catch (error) {
      const err = error as { stderr?: string; stdout?: string };
      throw new Error(
        `Scaffold command failed: ${cmd.command}\n` +
          `CWD: ${cwd}\n` +
          `stderr: ${err.stderr?.slice(0, 500) || ""}\n` +
          `stdout: ${err.stdout?.slice(0, 500) || ""}`
      );
    }
  }

  // Find the project root — look for the first directory created in tempDir
  const projectRoot = findProjectRoot(tempDir);

  return {
    tempDir,
    projectRoot,
    cleanup: () => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    },
  };
}

/**
 * Collect all .ts and .tsx files written inside a project directory.
 */
export function collectProjectFiles(projectRoot: string): string[] {
  const files: string[] = [];

  function walk(dir: string, prefix: string = ""): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      // Skip node_modules, .git, dist, build
      if (
        entry.name === "node_modules" ||
        entry.name === ".git" ||
        entry.name === "dist" ||
        entry.name === "build"
      ) {
        continue;
      }

      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), relPath);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        files.push(relPath);
      }
    }
  }

  walk(projectRoot);
  return files;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Find the CLI executable. Prefers the locally built copy in the monorepo.
 */
function resolveCliPath(): string {
  const candidates = [
    path.join(REPO_ROOT, "packages/cli/dist/index.js"),
    path.join(REPO_ROOT, "node_modules/.bin/idealyst"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      // If it's a JS file, run with node
      if (candidate.endsWith(".js")) {
        return `node "${candidate}"`;
      }
      return `"${candidate}"`;
    }
  }

  // Fall back to npx
  return "npx idealyst";
}

/**
 * Replace `idealyst` or `npx idealyst` in a command with the resolved CLI path.
 */
function resolveCommand(command: string, cliPath: string): string {
  return command
    .replace(/^npx\s+idealyst/, cliPath)
    .replace(/^idealyst/, cliPath);
}

/**
 * Find the project root directory inside a temp dir.
 * Looks for the first directory that contains a package.json.
 */
function findProjectRoot(tempDir: string): string {
  // Check if tempDir itself has a package.json (e.g., --current-dir)
  if (fs.existsSync(path.join(tempDir, "package.json"))) {
    return tempDir;
  }

  // Look for a subdirectory with package.json
  const entries = fs.readdirSync(tempDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const candidate = path.join(tempDir, entry.name);
      if (fs.existsSync(path.join(candidate, "package.json"))) {
        return candidate;
      }
    }
  }

  // No package.json found — just return tempDir
  return tempDir;
}
