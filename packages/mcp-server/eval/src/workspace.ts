/**
 * Workspace Scaffolding
 *
 * Creates temporary project workspaces for eval scenarios.
 * Each workspace has a proper tsconfig and node_modules with
 * symlinks to the monorepo's @idealyst packages, so `tsc --noEmit`
 * can validate agent-written code.
 */

import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../..");
const TEMPLATE_DIR = path.resolve(__dirname, "../workspace-template");

/** @idealyst packages to symlink from packages/ */
const IDEALYST_PACKAGES = [
  "components",
  "navigation",
  "theme",
  "storage",
  "translate",
  "camera",
  "audio",
  "files",
];

/**
 * Peer dependencies to symlink.
 * Each entry is [packageName, searchPaths] where searchPaths
 * are checked in order until the package is found.
 */
const PEER_DEPS: Array<[string, string[]]> = [
  ["react", ["node_modules"]],
  ["@types/react", ["node_modules"]],
  ["@types/node", ["node_modules"]],
  ["react-native", ["node_modules"]],
  ["react-native-unistyles", ["node_modules"]],
  [
    "react-native-mmkv",
    ["packages/storage/node_modules", "node_modules"],
  ],
  [
    "react-native-nitro-modules",
    ["packages/storage/node_modules", "node_modules"],
  ],
  ["i18next", ["packages/translate/node_modules", "node_modules"]],
  [
    "react-i18next",
    ["packages/translate/node_modules", "node_modules"],
  ],
  // Camera package peer deps
  [
    "react-native-vision-camera",
    ["packages/camera/node_modules", "node_modules"],
  ],
  // Audio package peer deps
  [
    "react-native-audio-api",
    ["packages/audio/node_modules", "node_modules"],
  ],
  // Files package peer deps (optional — may not be installed)
  [
    "react-native-blob-util",
    ["packages/files/node_modules", "node_modules"],
  ],
  [
    "react-native-document-picker",
    ["packages/files/node_modules", "node_modules"],
  ],
  [
    "react-native-image-picker",
    ["packages/files/node_modules", "node_modules"],
  ],
];

export interface WorkspaceInfo {
  /** Absolute path to the workspace root */
  path: string;
  /** Absolute path to the workspace src/ directory */
  srcDir: string;
  /** Remove the workspace */
  cleanup: () => void;
}

export function scaffoldWorkspace(runId: string): WorkspaceInfo {
  const tmpDir = path.join(os.tmpdir(), `eval-workspace-${runId}`);

  // Clean any previous run
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  // Copy template
  fs.cpSync(TEMPLATE_DIR, tmpDir, { recursive: true });

  // Ensure src directory exists
  const srcDir = path.join(tmpDir, "src");
  fs.mkdirSync(srcDir, { recursive: true });

  // Create node_modules/@idealyst/ with symlinks to monorepo packages
  const idealystDir = path.join(tmpDir, "node_modules", "@idealyst");
  fs.mkdirSync(idealystDir, { recursive: true });

  for (const pkg of IDEALYST_PACKAGES) {
    const target = path.join(REPO_ROOT, "packages", pkg);
    const link = path.join(idealystDir, pkg);
    if (fs.existsSync(target)) {
      fs.symlinkSync(target, link, "dir");
    }
  }

  // Symlink peer dependencies
  for (const [dep, searchPaths] of PEER_DEPS) {
    let source: string | null = null;
    for (const searchPath of searchPaths) {
      const candidate = path.join(REPO_ROOT, searchPath, dep);
      if (fs.existsSync(candidate)) {
        source = candidate;
        break;
      }
    }

    if (!source) continue;

    const link = path.join(tmpDir, "node_modules", dep);
    if (fs.existsSync(link)) continue;

    // Ensure parent scope directory exists for scoped packages
    const parentDir = path.dirname(link);
    fs.mkdirSync(parentDir, { recursive: true });

    fs.symlinkSync(source, link, "dir");
  }

  return {
    path: tmpDir,
    srcDir,
    cleanup: () => {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    },
  };
}

/** Recursively collect all .ts/.tsx files in a directory (relative paths) */
export function collectWrittenFiles(srcDir: string): string[] {
  const files: string[] = [];

  function walk(dir: string, prefix: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), rel);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name) && entry.name !== ".gitkeep") {
        files.push(rel);
      }
    }
  }

  walk(srcDir, "");
  return files;
}
