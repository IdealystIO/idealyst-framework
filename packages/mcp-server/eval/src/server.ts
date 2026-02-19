#!/usr/bin/env tsx

/**
 * Eval HTTP Server
 *
 * Wraps the eval pipeline behind a simple HTTP API so the convergence
 * engineer agent (running inside Claude Code) can trigger and monitor
 * eval runs via `curl` / `WebFetch` without spawning nested claude sessions.
 *
 * Start in a separate terminal:
 *   yarn eval:server              # port 4242 (default)
 *   PORT=5000 yarn eval:server    # custom port
 *
 * Endpoints:
 *   GET  /health              — liveness check
 *   GET  /scenarios           — list available scenarios
 *   POST /runs                — start a new eval run (async)
 *   GET  /runs                — list all tracked runs
 *   GET  /runs/:id            — run status + live progress
 *   GET  /runs/:id/report     — full report JSON (when complete)
 *   GET  /history             — query SQLite for historical runs + issues
 */

import http from "http";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
import { runAgentLoop } from "./agent.js";
import { gradeConversation } from "./grading/index.js";
import { scenarios, getScenariosByType } from "./scenarios/index.js";
import { scaffoldWorkspace } from "./workspace.js";
import { scaffoldProjectWorkspace } from "./project-workspace.js";
import { runTypecheck } from "./typecheck.js";
import { runSupervisorEvaluation } from "./supervisor.js";
import { tryOpenDatabase } from "./db.js";
import { ScenarioLogger } from "./logger.js";
import {
  computeToolStats,
  computeAggregateScores,
  computeSupervisorAggregateScores,
  collectAllFrameworkIssues,
  generateMarkdownSummary,
  generateCompareResults,
  formatDuration,
} from "./run-eval.js";
import type {
  EvalReport,
  EvalScenario,
  ScenarioResult,
  ScenarioType,
} from "./types.js";

// ---------------------------------------------------------------------------
// Load .env file (packages/mcp-server/.env) if present
// ---------------------------------------------------------------------------
function loadEnvFile(): void {
  const envPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../.env"
  );
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// Cached CLI Version (resolved once at startup to avoid blocking the event loop)
// ============================================================================

let cachedCliVersion = "unknown";

async function resolveCliVersion(): Promise<void> {
  try {
    const { stdout } = await execAsync("claude --version 2>/dev/null", {
      encoding: "utf-8",
      timeout: 5_000,
    });
    cachedCliVersion = stdout.trim();
  } catch {
    // CLI not found or timed out — keep "unknown"
  }
}

// Fire on startup (non-blocking)
resolveCliVersion();

// ============================================================================
// Run State
// ============================================================================

type RunStatus = "pending" | "running" | "completed" | "failed";

interface ScenarioProgress {
  scenarioId: string;
  status: "waiting" | "running" | "completed" | "failed";
  turns: number;
  maxTurns: number;
  toolCalls: number;
  lastToolCall: string | null;
  elapsedMs: number;
  heuristicScore?: number;
  supervisorScore?: number;
  error?: string;
}

interface RunState {
  id: string;
  status: RunStatus;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  options: {
    scenarios: string[];
    model: string;
    concurrency: number;
    skipSupervisor: boolean;
    verbose: boolean;
  };
  scenarioProgress: ScenarioProgress[];
  report: EvalReport | null;
  error: string | null;
}

const runs = new Map<string, RunState>();

// ============================================================================
// Run Execution
// ============================================================================

async function executeRun(runId: string): Promise<void> {
  const state = runs.get(runId)!;
  state.status = "running";
  state.startedAt = new Date().toISOString();

  const outputDir = path.resolve(__dirname, "../output");
  const dbPath = path.resolve(__dirname, "../data/eval-history.sqlite3");

  try {
    // Resolve scenarios
    let selectedScenarios: EvalScenario[];

    if (state.options.scenarios.includes("all")) {
      selectedScenarios = Object.values(scenarios);
    } else {
      selectedScenarios = state.options.scenarios
        .map((id) => scenarios[id])
        .filter(Boolean);
    }

    if (selectedScenarios.length === 0) {
      throw new Error(
        `No valid scenarios found: ${state.options.scenarios.join(", ")}`
      );
    }

    // Initialize progress tracking
    state.scenarioProgress = selectedScenarios.map((s) => ({
      scenarioId: s.id,
      status: "waiting",
      turns: 0,
      maxTurns: s.maxTurns,
      toolCalls: 0,
      lastToolCall: null,
      elapsedMs: 0,
    }));

    const evalRunId = `eval-${Date.now()}`;
    const concurrency = Math.min(
      state.options.concurrency,
      selectedScenarios.length
    );

    // Run scenarios with concurrency limit
    const queue = [...selectedScenarios];
    const results: ScenarioResult[] = [];
    const running = new Set<Promise<void>>();

    while (queue.length > 0 || running.size > 0) {
      while (running.size < concurrency && queue.length > 0) {
        const scenario = queue.shift()!;
        const p = runSingleScenario(
          scenario,
          state,
          evalRunId,
          outputDir
        ).then((result) => {
          if (result) results.push(result);
          running.delete(p);
        });
        running.add(p);
      }
      if (running.size > 0) {
        await Promise.race(running);
      }
    }

    if (results.length === 0) {
      throw new Error("All scenarios failed. No report generated.");
    }

    // Build report
    const allFrameworkIssues = collectAllFrameworkIssues(results);
    const supervisorAggregateScores =
      computeSupervisorAggregateScores(results);

    const report: EvalReport = {
      runId: evalRunId,
      timestamp: new Date().toISOString(),
      model: state.options.model,
      mcpServerVersion: "1.2.102",
      scenarios: results,
      aggregateScores: computeAggregateScores(results),
      toolUsageStats: computeToolStats(results),
      supervisorAggregateScores,
      allFrameworkIssues,
    };

    // Write output files
    fs.mkdirSync(outputDir, { recursive: true });
    const reportPath = path.join(outputDir, `${report.runId}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    const summaryPath = path.join(outputDir, `${report.runId}.summary.md`);
    fs.writeFileSync(summaryPath, generateMarkdownSummary(report));

    // Save to database
    const db = tryOpenDatabase(dbPath);
    if (db) {
      try {
        db.saveRun(report);
        if (allFrameworkIssues.length > 0) {
          db.saveFrameworkIssues(report.runId, allFrameworkIssues);
        }
        const compareResultsPath = path.resolve(
          __dirname,
          "../COMPARE_RESULTS.md"
        );
        fs.writeFileSync(compareResultsPath, generateCompareResults(db));
        db.close();
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[server] Database save failed: ${msg}`);
        db.close();
      }
    }

    state.report = report;
    state.status = "completed";
    state.completedAt = new Date().toISOString();
    console.log(
      `[server] Run ${runId} completed — heuristic mean: ${report.aggregateScores.overall_mean ?? "-"}/100`
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    state.status = "failed";
    state.error = msg;
    state.completedAt = new Date().toISOString();
    console.error(`[server] Run ${runId} failed: ${msg}`);
  }
}

async function runSingleScenario(
  scenario: EvalScenario,
  state: RunState,
  evalRunId: string,
  outputDir: string
): Promise<ScenarioResult | null> {
  const progress = state.scenarioProgress.find(
    (p) => p.scenarioId === scenario.id
  )!;
  progress.status = "running";

  let workspace: { path: string; srcDir?: string; cleanup: () => void } | null =
    null;

  const logger = state.options.verbose
    ? new ScenarioLogger(outputDir, evalRunId, scenario.id)
    : undefined;

  try {
    const runId = `${scenario.id}-${Date.now()}`;

    // Scaffold workspace
    if (scenario.type === "project") {
      const projectWorkspace = scaffoldProjectWorkspace(scenario, runId);
      workspace = {
        path: projectWorkspace.projectRoot,
        cleanup: projectWorkspace.cleanup,
      };
    } else {
      workspace = scaffoldWorkspace(runId);
    }

    const log = await runAgentLoop(scenario, {
      model: state.options.model,
      maxTurns: scenario.maxTurns,
      verbose: state.options.verbose,
      workspacePath: workspace.path,
      logger,
      onProgress: (agentProgress) => {
        progress.turns = agentProgress.turns;
        progress.toolCalls = agentProgress.toolCalls;
        progress.lastToolCall = agentProgress.lastToolCall;
        progress.elapsedMs = agentProgress.elapsedMs;
      },
    });

    // TypeScript validation
    if (log.writtenFiles.length > 0) {
      log.typecheckResult = await runTypecheck(workspace.path);
    }

    // Heuristic grading
    const grade = gradeConversation(log, scenario);

    // Supervisor evaluation
    let supervisorEval = null;
    if (!state.options.skipSupervisor) {
      try {
        supervisorEval = await runSupervisorEvaluation(log, scenario, {
          model: state.options.model,
          verbose: state.options.verbose,
          logger,
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger?.warn(`Supervisor failed: ${msg.slice(0, 200)}`);
      }
    }

    const result: ScenarioResult = { log, grade, supervisorEval };

    progress.status = "completed";
    progress.heuristicScore = grade.overallScore;
    progress.supervisorScore = supervisorEval?.qualitativeScore;

    // Cleanup workspace (unless verbose)
    if (!state.options.verbose && workspace) {
      workspace.cleanup();
    }
    logger?.close();
    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    progress.status = "failed";
    progress.error = msg;
    logger?.error(`FAILED: ${msg}`);
    logger?.close();

    if (!state.options.verbose && workspace) {
      workspace.cleanup();
    }
    return null;
  }
}

// ============================================================================
// HTTP Helpers
// ============================================================================

function json(res: http.ServerResponse, data: unknown, status = 200): void {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(body);
}

function error(
  res: http.ServerResponse,
  message: string,
  status = 400
): void {
  json(res, { error: message }, status);
}

async function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

// ============================================================================
// Route Handlers
// ============================================================================

function handleHealth(
  _req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  json(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    cliVersion: cachedCliVersion,
    scenarioCount: Object.keys(scenarios).length,
    activeRuns: [...runs.values()].filter((r) => r.status === "running").length,
  });
}

function handleListScenarios(
  _req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const list = Object.entries(scenarios).map(([id, s]) => ({
    id,
    name: s.name,
    type: s.type,
    difficulty: s.difficulty,
    description: s.description,
    maxTurns: s.maxTurns,
    tags: s.tags,
    expectedToolUsage: s.expectedToolUsage,
  }));
  json(res, { scenarios: list, total: list.length });
}

async function handleCreateRun(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  let body: Record<string, unknown> = {};
  try {
    const raw = await readBody(req);
    if (raw.trim()) {
      body = JSON.parse(raw);
    }
  } catch {
    error(res, "Invalid JSON body");
    return;
  }

  // Parse options with defaults
  const scenarioIds = Array.isArray(body.scenarios)
    ? (body.scenarios as string[])
    : ["login-screen"];
  const model = typeof body.model === "string" ? body.model : "claude-opus-4-6";
  const concurrency =
    typeof body.concurrency === "number"
      ? Math.max(1, body.concurrency)
      : 5;
  const skipSupervisor =
    typeof body.skipSupervisor === "boolean" ? body.skipSupervisor : false;
  const verbose =
    typeof body.verbose === "boolean" ? body.verbose : true;

  // Validate scenario IDs
  const invalid = scenarioIds.filter(
    (id) => id !== "all" && !scenarios[id]
  );
  if (invalid.length > 0) {
    error(
      res,
      `Unknown scenarios: ${invalid.join(", ")}. Use GET /scenarios for available IDs.`
    );
    return;
  }

  const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const state: RunState = {
    id: runId,
    status: "pending",
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    options: { scenarios: scenarioIds, model, concurrency, skipSupervisor, verbose },
    scenarioProgress: [],
    report: null,
    error: null,
  };

  runs.set(runId, state);

  // Fire and forget — don't await
  executeRun(runId).catch((err) => {
    console.error(`[server] Unhandled error in run ${runId}:`, err);
  });

  console.log(
    `[server] Started run ${runId}: scenarios=${scenarioIds.join(",")}, model=${model}`
  );

  json(res, { runId, status: "pending", pollUrl: `/runs/${runId}` }, 202);
}

function handleListRuns(
  _req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const list = [...runs.values()].map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.createdAt,
    startedAt: r.startedAt,
    completedAt: r.completedAt,
    scenarios: r.options.scenarios,
    model: r.options.model,
    error: r.error,
    heuristicMean: r.report?.aggregateScores.overall_mean ?? null,
    supervisorMean:
      r.report?.supervisorAggregateScores?.qualitativeScore_mean ?? null,
  }));
  json(res, { runs: list, total: list.length });
}

function handleGetRun(
  res: http.ServerResponse,
  runId: string
): void {
  const state = runs.get(runId);
  if (!state) {
    error(res, `Run not found: ${runId}`, 404);
    return;
  }

  json(res, {
    id: state.id,
    status: state.status,
    createdAt: state.createdAt,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    options: state.options,
    scenarioProgress: state.scenarioProgress,
    error: state.error,
    heuristicMean: state.report?.aggregateScores.overall_mean ?? null,
    supervisorMean:
      state.report?.supervisorAggregateScores?.qualitativeScore_mean ?? null,
  });
}

function handleGetRunReport(
  res: http.ServerResponse,
  runId: string
): void {
  const state = runs.get(runId);
  if (!state) {
    error(res, `Run not found: ${runId}`, 404);
    return;
  }

  if (state.status === "pending" || state.status === "running") {
    json(
      res,
      {
        status: state.status,
        message: "Run is still in progress. Poll GET /runs/:id for progress.",
        scenarioProgress: state.scenarioProgress,
      },
      202
    );
    return;
  }

  if (state.status === "failed") {
    error(res, `Run failed: ${state.error}`, 500);
    return;
  }

  json(res, state.report);
}

function handleHistory(
  _req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const dbPath = path.resolve(__dirname, "../data/eval-history.sqlite3");
  const db = tryOpenDatabase(dbPath);
  if (!db) {
    error(res, "Database not available (better-sqlite3 not installed)", 503);
    return;
  }

  try {
    const runHistory = db.getRunHistory(20);
    const openIssues = db.getOpenIssues();

    // Get latest run's scenario breakdown
    let latestBreakdown: unknown[] = [];
    if (runHistory.length > 0) {
      latestBreakdown = db.getLastRunScenarioResults(runHistory[0].id);
    }

    db.close();

    json(res, {
      runs: runHistory,
      openIssues,
      latestBreakdown,
    });
  } catch (err) {
    db.close();
    const msg = err instanceof Error ? err.message : String(err);
    error(res, `Database query failed: ${msg}`, 500);
  }
}

// ============================================================================
// Router
// ============================================================================

function route(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const method = req.method || "GET";
  const url = new URL(req.url || "/", `http://localhost`);
  const pathname = url.pathname;

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // GET /health
  if (method === "GET" && pathname === "/health") {
    handleHealth(req, res);
    return;
  }

  // GET /scenarios
  if (method === "GET" && pathname === "/scenarios") {
    handleListScenarios(req, res);
    return;
  }

  // POST /runs
  if (method === "POST" && pathname === "/runs") {
    handleCreateRun(req, res).catch((err) => {
      const msg = err instanceof Error ? err.message : String(err);
      error(res, `Internal error: ${msg}`, 500);
    });
    return;
  }

  // GET /runs
  if (method === "GET" && pathname === "/runs") {
    handleListRuns(req, res);
    return;
  }

  // GET /runs/:id/report
  const reportMatch = pathname.match(/^\/runs\/([^/]+)\/report$/);
  if (method === "GET" && reportMatch) {
    handleGetRunReport(res, reportMatch[1]);
    return;
  }

  // GET /runs/:id
  const runMatch = pathname.match(/^\/runs\/([^/]+)$/);
  if (method === "GET" && runMatch) {
    handleGetRun(res, runMatch[1]);
    return;
  }

  // GET /history
  if (method === "GET" && pathname === "/history") {
    handleHistory(req, res);
    return;
  }

  // 404
  error(res, `Not found: ${method} ${pathname}`, 404);
}

// ============================================================================
// Server Start
// ============================================================================

const PORT = parseInt(process.env.PORT || "4242", 10);

const server = http.createServer(route);

server.listen(PORT, () => {
  console.log(`
  Idealyst Eval Server
  ====================
  Port:       ${PORT}
  Scenarios:  ${Object.keys(scenarios).length} available
  Database:   eval/data/eval-history.sqlite3

  Endpoints:
    GET  /health              — liveness check
    GET  /scenarios           — list available scenarios
    POST /runs                — start eval run (async)
    GET  /runs                — list all runs
    GET  /runs/:id            — run status + progress
    GET  /runs/:id/report     — full report (when complete)
    GET  /history             — historical runs from SQLite

  Example:
    curl http://localhost:${PORT}/health
    curl -X POST http://localhost:${PORT}/runs -H "Content-Type: application/json" \\
      -d '{"scenarios":["login-screen"],"verbose":true}'
`);
});
