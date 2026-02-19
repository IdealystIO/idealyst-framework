/**
 * TypeScript Validation
 *
 * Runs `tsc --noEmit` on a workspace and parses the output
 * into structured error information for grading.
 */

import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../..");

export interface TypecheckError {
  file: string;
  line: number;
  column: number;
  code: string;
  message: string;
}

export interface TypecheckResult {
  /** Whether tsc exited with code 0 */
  success: boolean;
  /** Total number of TypeScript errors */
  errorCount: number;
  /** Parsed individual errors */
  errors: TypecheckError[];
  /** Raw tsc output */
  rawOutput: string;
}

export function runTypecheck(workspacePath: string): TypecheckResult {
  // Use tsc from the repo's node_modules
  const tscPath = findTsc();
  const tsconfigPath = path.join(workspacePath, "tsconfig.json");

  try {
    const output = execSync(
      `"${tscPath}" --noEmit --project "${tsconfigPath}" --pretty false 2>&1`,
      {
        encoding: "utf-8",
        timeout: 30000,
        cwd: workspacePath,
        shell: "/bin/bash",
      }
    );
    return { success: true, errorCount: 0, errors: [], rawOutput: output };
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; status?: number };
    const output = err.stdout || err.stderr || "";
    const errors = parseTscErrors(output, workspacePath);
    // If all errors are from external files (symlinked deps), treat as success
    return {
      success: errors.length === 0,
      errorCount: errors.length,
      errors,
      rawOutput: output,
    };
  }
}

function findTsc(): string {
  const candidates = [
    path.join(REPO_ROOT, "node_modules", ".bin", "tsc"),
    path.join(REPO_ROOT, "node_modules", "typescript", "bin", "tsc"),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch {
      // continue
    }
  }

  // Fall back to PATH
  return "tsc";
}

function parseTscErrors(
  output: string,
  workspacePath: string
): TypecheckError[] {
  // tsc --pretty false output format: file(line,col): error TSxxxx: message
  const errorRegex =
    /^(.+)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$/gm;
  const errors: TypecheckError[] = [];
  let match: RegExpExecArray | null;

  while ((match = errorRegex.exec(output)) !== null) {
    const filePath = match[1];
    // Skip errors from node_modules
    if (filePath.includes("node_modules")) continue;

    // Resolve relative paths against workspace cwd
    const resolved = path.resolve(workspacePath, filePath);
    // Only include errors from files inside the workspace (skip symlinked deps)
    if (!resolved.startsWith(workspacePath + path.sep)) continue;

    errors.push({
      file: path.relative(workspacePath, resolved),
      line: parseInt(match[2], 10),
      column: parseInt(match[3], 10),
      code: match[4],
      message: match[5],
    });
  }

  return errors;
}
