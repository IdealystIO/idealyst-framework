/**
 * Dev Server Management
 *
 * Handles starting web (Vite) + API dev servers on free ports
 * for Playwright-based runtime verification of eval scenarios.
 */

import net from "net";
import fs from "fs";
import path from "path";
import { spawn, type ChildProcess } from "child_process";
import http from "http";

export interface ServerHandles {
  /** URL for the web dev server (e.g., http://localhost:5173) */
  webUrl: string;
  /** URL for the API server (e.g., http://localhost:3000) */
  apiUrl: string;
  /** Web server port */
  webPort: number;
  /** API server port */
  apiPort: number;
  /** Web server process */
  webProcess: ChildProcess;
  /** API server process */
  apiProcess: ChildProcess;
  /** Kill both servers and clean up */
  cleanup: () => void;
}

export interface StartServersOptions {
  /** Timeout for waiting for servers to be ready (default: 30_000 ms) */
  readyTimeoutMs?: number;
  /** Whether to log server output */
  verbose?: boolean;
  /** Logger function */
  log?: (msg: string) => void;
}

// ============================================================================
// Port Discovery
// ============================================================================

/**
 * Find a free port by binding to port 0 and reading the assigned port.
 */
export function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        server.close();
        reject(new Error("Could not determine free port"));
        return;
      }
      const port = addr.port;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

// ============================================================================
// Health Checks
// ============================================================================

/**
 * Poll a URL until it returns a 2xx response or times out.
 */
async function waitForReady(
  url: string,
  timeoutMs: number,
  label: string,
  log?: (msg: string) => void
): Promise<void> {
  const start = Date.now();
  const pollInterval = 500;

  while (Date.now() - start < timeoutMs) {
    try {
      const ok = await checkHttp(url);
      if (ok) {
        log?.(`[serve] ${label} ready at ${url} (${Date.now() - start}ms)`);
        return;
      }
    } catch {
      // server not ready yet
    }
    await sleep(pollInterval);
  }

  throw new Error(`${label} did not become ready within ${timeoutMs}ms at ${url}`);
}

/**
 * Make a simple HTTP GET and return true if status is 2xx.
 */
function checkHttp(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume(); // consume body
      resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Server Management
// ============================================================================

/**
 * Write or update a .env file with key-value pairs.
 * Creates the file if it doesn't exist; updates existing keys or appends new ones.
 */
function writeEnvVars(envPath: string, vars: Record<string, string>): void {
  let content = "";
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf-8");
  }

  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `${content.endsWith("\n") || content === "" ? "" : "\n"}${key}=${value}\n`;
    }
  }

  fs.writeFileSync(envPath, content);
}

/**
 * Start the web and API dev servers for a project workspace.
 *
 * Finds free ports, configures env files, starts both servers,
 * and waits for them to be ready.
 */
export async function startServers(
  workspacePath: string,
  options: StartServersOptions = {}
): Promise<ServerHandles> {
  const readyTimeout = options.readyTimeoutMs ?? 30_000;
  const log = options.log;

  // Find two free ports
  const [webPort, apiPort] = await Promise.all([findFreePort(), findFreePort()]);

  log?.(`[serve] Ports: web=${webPort}, api=${apiPort}`);

  // Configure API .env
  const apiEnvPath = path.join(workspacePath, "packages/api/.env");
  writeEnvVars(apiEnvPath, {
    PORT: String(apiPort),
    CORS_ORIGIN: `http://localhost:${webPort}`,
  });

  // Configure web/shared .env for API URL
  const webEnvPath = path.join(workspacePath, "packages/web/.env");
  writeEnvVars(webEnvPath, {
    VITE_API_URL: `http://localhost:${apiPort}`,
  });

  const sharedEnvPath = path.join(workspacePath, "packages/shared/.env");
  if (fs.existsSync(path.dirname(sharedEnvPath))) {
    writeEnvVars(sharedEnvPath, {
      API_URL: `http://localhost:${apiPort}`,
    });
  }

  // Start API server
  log?.(`[serve] Starting API server on port ${apiPort}...`);

  // Read DATABASE_URL from database package .env if it exists
  const dbEnvPath = path.join(workspacePath, "packages/database/.env");
  let databaseUrl = "file:./dev.db";
  if (fs.existsSync(dbEnvPath)) {
    const dbEnv = fs.readFileSync(dbEnvPath, "utf-8");
    const match = dbEnv.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (match) databaseUrl = match[1];
  }

  const apiProcess = spawn(
    "npx",
    ["tsx", "packages/api/src/server.ts"],
    {
      cwd: workspacePath,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        PORT: String(apiPort),
        CORS_ORIGIN: `http://localhost:${webPort}`,
        DATABASE_URL: databaseUrl,
        NODE_ENV: "development",
      },
    }
  );

  // Start Web server
  log?.(`[serve] Starting web server on port ${webPort}...`);
  const webProcess = spawn(
    "npx",
    ["vite", "--port", String(webPort), "--host", "localhost"],
    {
      cwd: path.join(workspacePath, "packages/web"),
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        VITE_API_URL: `http://localhost:${apiPort}`,
        NODE_ENV: "development",
      },
    }
  );

  // Capture output for debugging
  if (options.verbose) {
    apiProcess.stdout?.on("data", (chunk: Buffer) => {
      log?.(`[api-stdout] ${chunk.toString().trim()}`);
    });
    apiProcess.stderr?.on("data", (chunk: Buffer) => {
      log?.(`[api-stderr] ${chunk.toString().trim()}`);
    });
    webProcess.stdout?.on("data", (chunk: Buffer) => {
      log?.(`[web-stdout] ${chunk.toString().trim()}`);
    });
    webProcess.stderr?.on("data", (chunk: Buffer) => {
      log?.(`[web-stderr] ${chunk.toString().trim()}`);
    });
  }

  const webUrl = `http://localhost:${webPort}`;
  const apiUrl = `http://localhost:${apiPort}`;

  const cleanup = () => {
    try { apiProcess.kill("SIGTERM"); } catch { /* ignore */ }
    try { webProcess.kill("SIGTERM"); } catch { /* ignore */ }

    // Force kill after 3 seconds if still alive
    setTimeout(() => {
      try { apiProcess.kill("SIGKILL"); } catch { /* ignore */ }
      try { webProcess.kill("SIGKILL"); } catch { /* ignore */ }
    }, 3000);
  };

  // Handle early process death
  let apiDied = false;
  let webDied = false;
  apiProcess.on("exit", () => { apiDied = true; });
  webProcess.on("exit", () => { webDied = true; });

  try {
    // Web server is required; API server is optional (Prisma issues may prevent it from starting)
    const apiTimeout = Math.min(readyTimeout, 15_000); // API gets max 15s
    const webReady = waitForReady(webUrl, readyTimeout, "Web server", log);
    const apiReady = waitForReady(`${apiUrl}/health`, apiTimeout, "API server", log)
      .catch(() =>
        // Fallback: try the root URL if /health doesn't exist
        waitForReady(apiUrl, apiTimeout, "API server (root)", log)
      )
      .catch(() => {
        log?.(`[serve] API server failed to start (non-fatal — web-only verification will proceed)`);
      });

    await webReady;
    await apiReady;

    if (webDied) throw new Error("Web server process exited during startup");
    // API death is non-fatal — web server is sufficient for Playwright verification
    if (apiDied) {
      log?.(`[serve] API server process exited (non-fatal)`);
    }
  } catch (error) {
    cleanup();
    throw error;
  }

  return {
    webUrl,
    apiUrl,
    webPort,
    apiPort,
    webProcess,
    apiProcess,
    cleanup,
  };
}
