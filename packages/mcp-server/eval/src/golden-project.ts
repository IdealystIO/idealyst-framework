/**
 * Golden Project Management
 *
 * Scaffolds a fully-installed Idealyst project once (the "golden project"),
 * then provides fast copies for individual eval scenarios. This avoids
 * re-running `yarn install` for every scenario.
 *
 * Key design:
 * - Install happens normally with npm versions of @idealyst/*
 * - After install, @idealyst/* in node_modules are replaced with symlinks
 *   to the local monorepo packages, so code changes are reflected without
 *   pushing to npm.
 * - Per-scenario copies symlink node_modules from the golden copy.
 */

import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../..");

// @idealyst packages in the monorepo
const IDEALYST_PACKAGES = [
  "components",
  "navigation",
  "theme",
  "storage",
  "translate",
  "camera",
  "audio",
  "files",
  "animate",
  "charts",
  "config",
  "datagrid",
  "datepicker",
  "markdown",
  "oauth-client",
  "lottie",
  "svg",
  "tooling",
];

export interface GoldenProjectInfo {
  /** Absolute path to the golden project root */
  path: string;
  /** Hash identifying this golden project version */
  hash: string;
}

export interface ProjectWorkspaceCopy {
  /** Absolute path to the copied project root */
  path: string;
  /** Cleanup function to remove the workspace */
  cleanup: () => void;
}

// ============================================================================
// Golden Project Scaffolding
// ============================================================================

/**
 * Compute a hash based on the CLI version so we re-scaffold when the CLI changes.
 */
function computeGoldenHash(): string {
  const cliPkgPath = path.join(REPO_ROOT, "packages/cli/package.json");
  let version = "unknown";
  try {
    const pkg = JSON.parse(fs.readFileSync(cliPkgPath, "utf-8"));
    version = pkg.version || "unknown";
  } catch {
    // fallback
  }
  return crypto.createHash("md5").update(version).digest("hex").slice(0, 8);
}

/**
 * Resolve the CLI path — prefer the locally built copy.
 */
function resolveCliPath(): string {
  const candidates = [
    path.join(REPO_ROOT, "packages/cli/dist/index.js"),
    path.join(REPO_ROOT, "node_modules/.bin/idealyst"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      if (candidate.endsWith(".js")) {
        return `node "${candidate}"`;
      }
      return `"${candidate}"`;
    }
  }

  return "npx idealyst";
}

/**
 * Replace @idealyst/* packages in node_modules with symlinks to the local
 * monorepo packages. This is done AFTER yarn install so there are no
 * dependency resolution conflicts.
 *
 * Handles both root node_modules and hoisted workspace node_modules.
 */
function symlinkIdealystPackages(projectDir: string): void {
  const nodeModulesDir = path.join(projectDir, "node_modules", "@idealyst");

  if (!fs.existsSync(nodeModulesDir)) {
    fs.mkdirSync(nodeModulesDir, { recursive: true });
  }

  for (const pkg of IDEALYST_PACKAGES) {
    const localPkgPath = path.join(REPO_ROOT, "packages", pkg);
    if (!fs.existsSync(localPkgPath)) continue;

    const targetPath = path.join(nodeModulesDir, pkg);

    // Remove existing npm-installed package
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }

    // Create symlink to local monorepo package
    fs.symlinkSync(localPkgPath, targetPath, "dir");
  }
}

/**
 * Patch the Vite config to add @idealyst/* aliases pointing to the project's
 * node_modules. This is needed because when Vite follows symlinks into the
 * monorepo source, cross-package imports (e.g., @idealyst/navigation from
 * @idealyst/components) can't resolve without explicit aliases.
 */
function patchViteConfig(projectDir: string): void {
  const viteConfigPath = path.join(projectDir, "packages/web/vite.config.ts");
  if (!fs.existsSync(viteConfigPath)) return;

  let content = fs.readFileSync(viteConfigPath, "utf-8");

  // Build alias entries for all @idealyst packages
  const aliasLines = IDEALYST_PACKAGES
    .map(
      (pkg) =>
        `      '@idealyst/${pkg}': path.resolve(monorepoRoot, 'node_modules/@idealyst/${pkg}'),`
    )
    .join("\n");

  // Insert aliases after the existing @mdi/js alias line.
  // Guard: check the alias object doesn't already have @idealyst/components as a key
  // (not just referenced in babel config or autoProcessPaths).
  const hasIdealystAlias = /'@idealyst\/components'\s*:/.test(content);
  if (content.includes("'@mdi/js':") && !hasIdealystAlias) {
    // Match the entire @mdi/js line (handles commas inside path.resolve())
    content = content.replace(
      /([ \t]*'@mdi\/js':.*\),?\s*\n)/,
      `$1      // @idealyst packages — resolve from project node_modules (symlinked to monorepo)\n${aliasLines}\n`
    );
  }

  // Also allow filesystem access to the monorepo for symlinked packages
  if (!content.includes("fs:")) {
    content = content.replace(
      /server:\s*\{[^}]*\}/,
      (match) =>
        match.replace(
          /\}$/,
          `  fs: {\n      allow: ['${REPO_ROOT}', monorepoRoot],\n    },\n  }`
        )
    );
  }

  fs.writeFileSync(viteConfigPath, content);
}

/**
 * Generate Prisma client and push the schema to create the SQLite database.
 * Both steps are needed so the API server can start.
 */
function generatePrismaClient(projectDir: string): void {
  const prismaDir = path.join(projectDir, "packages/database");
  if (!fs.existsSync(prismaDir)) return;

  try {
    execSync("npx prisma generate 2>&1", {
      cwd: prismaDir,
      timeout: 60_000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      shell: "/bin/bash",
      env: { ...process.env, CI: "true" },
    });
  } catch {
    console.warn(`[golden] Prisma generate failed (non-fatal)`);
    return;
  }

  // Push schema to create the SQLite database file + tables
  try {
    execSync("npx prisma db push --accept-data-loss 2>&1", {
      cwd: prismaDir,
      timeout: 60_000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      shell: "/bin/bash",
      env: { ...process.env, CI: "true" },
    });
  } catch {
    console.warn(`[golden] Prisma db push failed (non-fatal)`);
  }
}

/**
 * Patch the database package's PrismaClient instantiation for Prisma 7.
 * Prisma 7's generated client requires non-empty constructor options.
 */
function patchPrismaClient(projectDir: string): void {
  const dbIndexPath = path.join(projectDir, "packages/database/src/index.ts");
  if (!fs.existsSync(dbIndexPath)) return;

  let content = fs.readFileSync(dbIndexPath, "utf-8");

  // Fix: `new PrismaClient()` → `new PrismaClient({})`
  if (content.includes("new PrismaClient()")) {
    content = content.replace(/new PrismaClient\(\)/g, "new PrismaClient({})");
    fs.writeFileSync(dbIndexPath, content);
  }
}

/**
 * Scaffold the golden project. This runs once at eval server startup.
 *
 * 1. Runs `idealyst init` with `--skip-install`
 * 2. Runs `yarn install` (installs @idealyst/* from npm + all other deps)
 * 3. Generates Prisma client
 * 4. Replaces @idealyst/* in node_modules with symlinks to local monorepo
 * 5. Patches Vite config for proper @idealyst/* resolution
 */
export async function scaffoldGoldenProject(): Promise<GoldenProjectInfo> {
  const hash = computeGoldenHash();
  const goldenDir = path.join(os.tmpdir(), `eval-golden-${hash}`);
  const projectDir = path.join(goldenDir, "eval-golden");

  // If the golden project already exists and looks valid, reuse it
  if (
    fs.existsSync(projectDir) &&
    fs.existsSync(path.join(projectDir, "node_modules")) &&
    fs.existsSync(path.join(projectDir, "package.json"))
  ) {
    // Re-symlink in case monorepo packages changed
    console.log(`[golden] Reusing existing golden project at ${projectDir}`);
    symlinkIdealystPackages(projectDir);
    return { path: projectDir, hash };
  }

  // Clean up any partial previous attempt
  if (fs.existsSync(goldenDir)) {
    fs.rmSync(goldenDir, { recursive: true, force: true });
  }
  fs.mkdirSync(goldenDir, { recursive: true });

  const cli = resolveCliPath();

  console.log(`[golden] Scaffolding golden project at ${goldenDir}...`);

  // Step 1: Run idealyst init
  const initCmd = [
    cli,
    "init eval-golden",
    "--no-interactive",
    "--org-domain com.eval",
    '--app-name "Eval Golden"',
    "--with-api",
    "--with-trpc",
    "--with-prisma",
    "--blank",
    "--skip-install",
  ].join(" ");

  execSync(initCmd, {
    cwd: goldenDir,
    timeout: 120_000,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
    shell: "/bin/bash",
    env: { ...process.env, CI: "true" },
  });

  if (!fs.existsSync(projectDir)) {
    throw new Error(
      `Golden project directory not created at ${projectDir}. ` +
      `Contents of ${goldenDir}: ${fs.readdirSync(goldenDir).join(", ")}`
    );
  }

  console.log(`[golden] Running yarn install (this may take a while)...`);

  // Step 2: Install dependencies normally from npm
  execSync("yarn install --no-immutable 2>&1", {
    cwd: projectDir,
    timeout: 600_000, // 10 min
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
    shell: "/bin/bash",
    env: { ...process.env, CI: "true" },
  });

  console.log(`[golden] Generating Prisma client...`);

  // Step 3: Generate Prisma client + push schema
  generatePrismaClient(projectDir);

  // Step 3b: Fix Prisma 7 PrismaClient constructor (requires non-empty options)
  patchPrismaClient(projectDir);

  console.log(`[golden] Symlinking @idealyst/* to local monorepo...`);

  // Step 4: Replace @idealyst/* in node_modules with symlinks to local packages
  symlinkIdealystPackages(projectDir);

  console.log(`[golden] Patching Vite config for @idealyst/* resolution...`);

  // Step 5: Patch Vite config to resolve @idealyst/* through project node_modules
  patchViteConfig(projectDir);

  console.log(`[golden] Golden project ready at ${projectDir}`);

  return { path: projectDir, hash };
}

// ============================================================================
// Workspace Copying
// ============================================================================

/**
 * Recursively copy a directory, skipping node_modules.
 */
function copyDirExcludeNodeModules(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name === "node_modules") {
      continue; // Skip node_modules — will be symlinked
    }

    if (entry.isDirectory()) {
      copyDirExcludeNodeModules(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const target = fs.readlinkSync(srcPath);
      fs.symlinkSync(target, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Find all node_modules directories in the golden project (non-recursive into node_modules).
 * Returns paths relative to the golden project root.
 */
function findNodeModulesDirs(goldenPath: string): string[] {
  const dirs: string[] = [];

  // Root node_modules
  if (fs.existsSync(path.join(goldenPath, "node_modules"))) {
    dirs.push("node_modules");
  }

  // packages/*/node_modules
  const packagesDir = path.join(goldenPath, "packages");
  if (fs.existsSync(packagesDir)) {
    for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const nmPath = path.join("packages", entry.name, "node_modules");
        if (fs.existsSync(path.join(goldenPath, nmPath))) {
          dirs.push(nmPath);
        }
      }
    }
  }

  return dirs;
}

/**
 * Create a fast copy of the golden workspace for a specific scenario run.
 *
 * - Deep-copies all files except node_modules
 * - Symlinks node_modules from the golden copy
 */
export function copyGoldenWorkspace(
  goldenPath: string,
  scenarioRunId: string
): ProjectWorkspaceCopy {
  const copyDir = path.join(os.tmpdir(), `eval-project-${scenarioRunId}`);

  // Clean any previous run
  if (fs.existsSync(copyDir)) {
    fs.rmSync(copyDir, { recursive: true, force: true });
  }

  // Deep copy files (excluding node_modules)
  copyDirExcludeNodeModules(goldenPath, copyDir);

  // Symlink all node_modules directories
  const nmDirs = findNodeModulesDirs(goldenPath);
  for (const nmDir of nmDirs) {
    const goldenNm = path.join(goldenPath, nmDir);
    const copyNm = path.join(copyDir, nmDir);

    // Ensure parent directory exists
    fs.mkdirSync(path.dirname(copyNm), { recursive: true });

    fs.symlinkSync(goldenNm, copyNm, "dir");
  }

  return {
    path: copyDir,
    cleanup: () => {
      try {
        fs.rmSync(copyDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    },
  };
}
