#!/usr/bin/env tsx

/**
 * Evaluation Runner
 *
 * CLI entry point for running MCP server evaluations.
 * Runs scenarios in parallel with a live dashboard display.
 *
 * Usage:
 *   yarn eval:quick                             # Single scenario, verbose
 *   yarn eval:all                               # All scenarios (parallel)
 *   yarn eval -s login-screen,navigation -v     # Custom selection
 *   yarn eval -m sonnet -s login-screen         # Different model
 *   yarn eval --skip-supervisor                  # Heuristic only
 *   yarn eval --type component                  # Only component scenarios
 *   yarn eval --compare                          # Show delta vs last run
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { runAgentLoop, type AgentProgress } from "./agent.js";
import { gradeConversation } from "./grading/index.js";
import { scenarios, getScenariosByType } from "./scenarios/index.js";
import { scaffoldWorkspace } from "./workspace.js";
import { scaffoldProjectWorkspace } from "./project-workspace.js";
import { runTypecheck } from "./typecheck.js";
import { runSupervisorEvaluation, runPlaywrightSupervisorEvaluation } from "./supervisor.js";
import { DEFAULT_CRITERIA } from "./criteria.js";
import { tryOpenDatabase, type EvalDatabase } from "./db.js";
import { ScenarioLogger } from "./logger.js";
import {
  scaffoldGoldenProject,
  copyGoldenWorkspace,
  type GoldenProjectInfo,
} from "./golden-project.js";
import { startServers } from "./serve.js";
import type {
  EvalReport,
  EvalScenario,
  ScenarioResult,
  ToolUsageStat,
  RunOptions,
  FrameworkIssue,
  ScenarioType,
} from "./types.js";

// ---------------------------------------------------------------------------
// Golden Project (lazily initialized)
// ---------------------------------------------------------------------------

let goldenProject: GoldenProjectInfo | null = null;
let goldenProjectPromise: Promise<GoldenProjectInfo> | null = null;

async function getGoldenProject(): Promise<GoldenProjectInfo> {
  if (goldenProject) return goldenProject;
  if (!goldenProjectPromise) {
    goldenProjectPromise = scaffoldGoldenProject()
      .then((info) => { goldenProject = info; return info; })
      .catch((err) => { goldenProjectPromise = null; throw err; });
  }
  return goldenProjectPromise;
}

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
    // Strip surrounding quotes
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
// Live Display
// ============================================================================

const isTTY = process.stdout.isTTY === true;

interface ScenarioDisplay {
  scenario: EvalScenario;
  progress: AgentProgress | null;
  result: ScenarioResult | null;
  error: string | null;
}

export function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m${s % 60}s`;
}

function progressBar(turns: number, maxTurns: number, width: number = 5): string {
  const filled = maxTurns > 0 ? Math.min(width, Math.round((turns / maxTurns) * width)) : 0;
  const empty = width - filled;
  return "\u2593".repeat(filled) + "\u2591".repeat(empty);
}

function renderRow(display: ScenarioDisplay): string {
  const id = display.scenario.id.padEnd(18);

  // Completed — show final score
  if (display.result) {
    const { log, grade, supervisorEval } = display.result;
    const score = String(grade.overallScore).padStart(3);
    const bar = progressBar(log.totalTurns, display.scenario.maxTurns);
    const dur = formatDuration(log.totalDurationMs);
    const status = log.agentStoppedReason === "completed" ? "\u2713" : "\u2717";
    const tsc = log.typecheckResult
      ? log.typecheckResult.success
        ? "tsc:\u2713"
        : `tsc:\u2717(${log.typecheckResult.errorCount})`
      : "tsc:-";
    const files = log.writtenFiles.length > 0 ? `files:${log.writtenFiles.length}` : "";
    const sup = supervisorEval ? `sup:${supervisorEval.qualitativeScore}` : "";
    return `  ${id} [${bar}] ${score}/100  turns: ${String(log.totalTurns).padStart(2)}  tools: ${String(log.totalToolCalls).padStart(2)}  ${tsc}  ${files}  ${sup}  ${dur.padStart(6)}  ${status}`;
  }

  // Error
  if (display.error) {
    return `  ${id} FAILED: ${display.error.slice(0, 60)}`;
  }

  // In progress
  if (display.progress) {
    const p = display.progress;
    const bar = progressBar(p.turns, p.maxTurns);
    const dur = formatDuration(p.elapsedMs);
    const last = p.lastToolCall ? `  last: ${p.lastToolCall}` : "";
    return `  ${id} [${bar}] turn ${String(p.turns).padStart(2)}/${p.maxTurns}  tools: ${String(p.toolCalls).padStart(2)}  msgs: ${String(p.messages).padStart(2)}${last}  ${dur.padStart(6)}`;
  }

  // Waiting
  return `  ${id} [ ... ] waiting...`;
}

class LiveDisplay {
  private displays: ScenarioDisplay[];
  private lineCount = 0;

  constructor(selectedScenarios: EvalScenario[]) {
    this.displays = selectedScenarios.map((scenario) => ({
      scenario,
      progress: null,
      result: null,
      error: null,
    }));
  }

  updateProgress(scenarioId: string, progress: AgentProgress): void {
    const d = this.displays.find((d) => d.scenario.id === scenarioId);
    if (d) {
      d.progress = progress;
      this.render();
    }
  }

  setResult(scenarioId: string, result: ScenarioResult): void {
    const d = this.displays.find((d) => d.scenario.id === scenarioId);
    if (d) {
      d.result = result;
      this.render();
    }
  }

  setError(scenarioId: string, error: string): void {
    const d = this.displays.find((d) => d.scenario.id === scenarioId);
    if (d) {
      d.error = error;
      this.render();
    }
  }

  render(): void {
    if (!isTTY) return; // Non-TTY: don't rewrite lines

    // Move cursor up to overwrite previous lines
    if (this.lineCount > 0) {
      process.stdout.write(`\x1B[${this.lineCount}A`);
    }

    const lines = this.displays.map(renderRow);
    const output = lines.map((l) => l + "\x1B[K").join("\n") + "\n";
    process.stdout.write(output);
    this.lineCount = lines.length;
  }

  /** Initial render to claim the lines */
  init(): void {
    if (isTTY) {
      this.render();
    } else {
      // Non-TTY: print header
      for (const d of this.displays) {
        console.log(`  ${d.scenario.id}: starting...`);
      }
    }
  }

  /** Print final non-interactive summary (for non-TTY or after live display) */
  printFinalSummary(): void {
    if (!isTTY) {
      // For non-TTY, print each result
      console.log("");
      for (const d of this.displays) {
        console.log(renderRow(d));
      }
    }
  }

  getDisplays(): ScenarioDisplay[] {
    return this.displays;
  }
}

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseArgs(): RunOptions {
  const args = process.argv.slice(2);
  const options: RunOptions = {
    model: "claude-opus-4-6",
    scenarios: ["login-screen"],
    maxTokens: 16384,
    outputDir: path.resolve(__dirname, "../output"),
    verbose: false,
    skipSupervisor: false,
    supervisorModel: "",
    dbPath: path.resolve(__dirname, "../data/eval-history.sqlite3"),
    compare: false,
    scenarioType: "all",
    concurrency: 5,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case "--scenarios":
      case "-s":
        if (next) {
          options.scenarios = next.split(",").map((s) => s.trim());
          i++;
        }
        break;
      case "--model":
      case "-m":
        if (next) {
          options.model = next;
          i++;
        }
        break;
      case "--max-tokens":
        if (next) {
          options.maxTokens = parseInt(next, 10);
          i++;
        }
        break;
      case "--output-dir":
      case "-o":
        if (next) {
          options.outputDir = path.resolve(next);
          i++;
        }
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--skip-supervisor":
        options.skipSupervisor = true;
        break;
      case "--supervisor-model":
        if (next) {
          options.supervisorModel = next;
          i++;
        }
        break;
      case "--db-path":
        if (next) {
          options.dbPath = path.resolve(next);
          i++;
        }
        break;
      case "--compare":
        options.compare = true;
        break;
      case "--type":
        if (next && (next === "component" || next === "project" || next === "all")) {
          options.scenarioType = next;
          i++;
        }
        break;
      case "--concurrency":
      case "-j":
        if (next) {
          options.concurrency = Math.max(1, parseInt(next, 10) || 5);
          i++;
        }
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
      case "--list":
      case "-l":
        listScenarios();
        process.exit(0);
    }
  }

  // Default supervisor model to task model
  if (!options.supervisorModel) {
    options.supervisorModel = options.model;
  }

  return options;
}

function printHelp(): void {
  console.log(`
Idealyst MCP Server Evaluation Agent

Runs Claude Code agents against evaluation scenarios to test
how well the MCP server enables framework understanding.
Scenarios run in parallel with a live progress dashboard.

Usage:
  tsx eval/src/run-eval.ts [options]

Options:
  --scenarios, -s <ids>       Comma-separated scenario IDs or "all" (default: login-screen)
  --model, -m <model>         Model to use (default: claude-opus-4-6)
  --max-tokens <n>            Max tokens per response (default: 16384)
  --output-dir, -o <dir>      Output directory (default: eval/output/)
  --verbose, -v               Print detailed progress (disables live dashboard)
  --skip-supervisor           Skip supervisor evaluation (heuristic only)
  --supervisor-model <model>  Model for supervisor (default: same as task model)
  --db-path <path>            SQLite database path (default: eval/data/eval-history.sqlite3)
  --compare                   Show comparison with previous run
  --concurrency, -j N         Max concurrent scenarios (default: 5)
  --type <component|project|all>  Filter scenarios by type (default: all)
  --list, -l                  List all available scenarios
  --help, -h                  Show this help

Available scenarios:
${Object.entries(scenarios)
  .map(([id, s]) => `  ${id.padEnd(22)} ${s.type.padEnd(10)} ${s.difficulty.padEnd(14)} ${s.name}`)
  .join("\n")}

Prerequisites:
  - Claude Code CLI must be installed and authenticated
  - MCP server must be built: yarn build (in packages/mcp-server)
  - .mcp.json must exist in repo root (already present)

Examples:
  yarn eval:quick                           # login-screen scenario, verbose
  yarn eval -s all                          # All scenarios (parallel)
  yarn eval -s login-screen,navigation -v   # Custom selection, verbose
  yarn eval -m sonnet -s login-screen       # Use Sonnet model
  yarn eval --skip-supervisor               # Heuristic grading only
  yarn eval --type component                # Only component scenarios
  yarn eval --compare                       # Show delta vs last run
`);
}

function listScenarios(): void {
  console.log("\nAvailable evaluation scenarios:\n");
  for (const [id, scenario] of Object.entries(scenarios)) {
    console.log(`  ${id}`);
    console.log(`    ${scenario.name} (${scenario.type}, ${scenario.difficulty})`);
    console.log(`    ${scenario.description}`);
    console.log(`    Tags: ${scenario.tags.join(", ")}`);
    console.log(`    Max turns: ${scenario.maxTurns}`);
    console.log(
      `    Expected tools: ${scenario.expectedToolUsage.join(", ")}`
    );
    console.log();
  }
}

// ============================================================================
// Report Generation
// ============================================================================

export function computeToolStats(
  results: ScenarioResult[]
): Record<string, ToolUsageStat> {
  const stats: Record<
    string,
    { calls: number; errors: number; totalMs: number }
  > = {};

  for (const result of results) {
    for (const tc of result.log.toolCalls) {
      if (!stats[tc.toolName]) {
        stats[tc.toolName] = { calls: 0, errors: 0, totalMs: 0 };
      }
      stats[tc.toolName].calls++;
    }
    for (const tr of result.log.toolResults) {
      if (!stats[tr.toolName]) {
        stats[tr.toolName] = { calls: 0, errors: 0, totalMs: 0 };
      }
      stats[tr.toolName].totalMs += tr.durationMs;
      if (tr.response.isError) {
        stats[tr.toolName].errors++;
      }
    }
  }

  const output: Record<string, ToolUsageStat> = {};
  for (const [name, s] of Object.entries(stats)) {
    output[name] = {
      callCount: s.calls,
      errorCount: s.errors,
      avgResponseTimeMs:
        s.calls > 0 ? Math.round(s.totalMs / s.calls) : 0,
    };
  }
  return output;
}

export function computeAggregateScores(
  results: ScenarioResult[]
): Record<string, number> {
  if (results.length === 0) return {};

  const scores: Record<string, number[]> = {
    overall: [],
    toolDiscovery: [],
    informationGathering: [],
    codeCorrectness: [],
    typecheckPasses: [],
    codeCompleteness: [],
    efficiency: [],
    errorHandling: [],
  };

  for (const result of results) {
    scores.overall.push(result.grade.overallScore);
    for (const [key, dim] of Object.entries(result.grade.dimensions)) {
      if (scores[key]) {
        scores[key].push(dim.score);
      }
    }
  }

  const output: Record<string, number> = {};
  for (const [key, values] of Object.entries(scores)) {
    if (values.length === 0) continue;
    output[`${key}_mean`] = Math.round(
      values.reduce((a, b) => a + b, 0) / values.length
    );
    output[`${key}_min`] = Math.min(...values);
    output[`${key}_max`] = Math.max(...values);
  }

  return output;
}

export function computeSupervisorAggregateScores(
  results: ScenarioResult[]
): Record<string, number> | null {
  const withSupervisor = results.filter((r) => r.supervisorEval !== null);
  if (withSupervisor.length === 0) return null;

  const scores: Record<string, number[]> = {
    qualitativeScore: [],
  };

  // Initialize per-criterion arrays
  for (const criterion of DEFAULT_CRITERIA) {
    scores[criterion.id] = [];
  }

  for (const result of withSupervisor) {
    const sup = result.supervisorEval!;
    scores.qualitativeScore.push(sup.qualitativeScore);

    for (const cr of sup.criteria) {
      if (scores[cr.criterionId]) {
        scores[cr.criterionId].push(cr.score);
      }
    }
  }

  const output: Record<string, number> = {};
  for (const [key, values] of Object.entries(scores)) {
    if (values.length === 0) continue;
    output[`${key}_mean`] = Math.round(
      values.reduce((a, b) => a + b, 0) / values.length
    );
    output[`${key}_min`] = Math.min(...values);
    output[`${key}_max`] = Math.max(...values);
  }

  return output;
}

export function collectAllFrameworkIssues(results: ScenarioResult[]): FrameworkIssue[] {
  const issues: FrameworkIssue[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (!result.supervisorEval) continue;
    for (const issue of result.supervisorEval.frameworkIssues) {
      if (!seen.has(issue.issueId)) {
        seen.add(issue.issueId);
        issues.push(issue);
      }
    }
  }

  return issues;
}

export function generateMarkdownSummary(report: EvalReport): string {
  const lines: string[] = [];

  lines.push("# MCP Server Evaluation Report");
  lines.push("");
  lines.push(`**Run ID:** ${report.runId}`);
  lines.push(`**Date:** ${report.timestamp}`);
  lines.push(`**Model:** ${report.model}`);
  lines.push(`**MCP Server:** ${report.mcpServerVersion}`);
  lines.push(`**Scenarios:** ${report.scenarios.length}`);
  lines.push("");

  // Aggregate heuristic scores
  lines.push("## Heuristic Scores");
  lines.push("");
  if (report.aggregateScores.overall_mean !== undefined) {
    lines.push(`| Metric | Mean | Min | Max |`);
    lines.push(`|--------|------|-----|-----|`);

    const metrics = [
      "overall",
      "toolDiscovery",
      "informationGathering",
      "codeCorrectness",
      "typecheckPasses",
      "codeCompleteness",
      "efficiency",
      "errorHandling",
    ];

    for (const metric of metrics) {
      const mean = report.aggregateScores[`${metric}_mean`] ?? "-";
      const min = report.aggregateScores[`${metric}_min`] ?? "-";
      const max = report.aggregateScores[`${metric}_max`] ?? "-";
      lines.push(`| ${metric} | ${mean} | ${min} | ${max} |`);
    }
    lines.push("");
  }

  // Supervisor aggregate scores
  if (report.supervisorAggregateScores) {
    lines.push("## Supervisor Scores");
    lines.push("");
    lines.push("| Criterion | Mean | Min | Max |");
    lines.push("|-----------|------|-----|-----|");

    const supScores = report.supervisorAggregateScores;
    lines.push(
      `| **Qualitative Overall** | ${supScores.qualitativeScore_mean ?? "-"} | ${supScores.qualitativeScore_min ?? "-"} | ${supScores.qualitativeScore_max ?? "-"} |`
    );

    for (const criterion of DEFAULT_CRITERIA) {
      const mean = supScores[`${criterion.id}_mean`] ?? "-";
      const min = supScores[`${criterion.id}_min`] ?? "-";
      const max = supScores[`${criterion.id}_max`] ?? "-";
      lines.push(`| ${criterion.label} | ${mean} | ${min} | ${max} |`);
    }
    lines.push("");
  }

  // Tool usage stats
  lines.push("## Tool Usage");
  lines.push("");
  lines.push("| Tool | Calls | Errors | Avg Response |");
  lines.push("|------|-------|--------|-------------|");
  for (const [tool, stat] of Object.entries(report.toolUsageStats)) {
    lines.push(
      `| ${tool} | ${stat.callCount} | ${stat.errorCount} | ${stat.avgResponseTimeMs}ms |`
    );
  }
  lines.push("");

  // Per-scenario details
  lines.push("## Scenario Results");
  lines.push("");
  for (const result of report.scenarios) {
    lines.push(result.grade.summary);
    lines.push("");

    // Supervisor details
    if (result.supervisorEval) {
      const sup = result.supervisorEval;
      lines.push(`**Supervisor Score:** ${sup.qualitativeScore}/100`);
      lines.push("");
      lines.push(`> ${sup.summary}`);
      lines.push("");

      lines.push("| Criterion | Score | Severity |");
      lines.push("|-----------|-------|----------|");
      for (const cr of sup.criteria) {
        lines.push(`| ${cr.label} | ${cr.score} | ${cr.severity} |`);
      }
      lines.push("");

      if (sup.frameworkIssues.length > 0) {
        lines.push("**Framework Issues:**");
        for (const issue of sup.frameworkIssues) {
          lines.push(`- [${issue.source}/${issue.severity}] ${issue.description}`);
        }
        lines.push("");
      }
    }

    lines.push("---");
    lines.push("");
  }

  // All framework issues
  if (report.allFrameworkIssues.length > 0) {
    lines.push("## Framework Issues (All Scenarios)");
    lines.push("");

    const bySource: Record<string, FrameworkIssue[]> = {};
    for (const issue of report.allFrameworkIssues) {
      if (!bySource[issue.source]) bySource[issue.source] = [];
      bySource[issue.source].push(issue);
    }

    for (const [source, issues] of Object.entries(bySource)) {
      lines.push(`### ${source} (${issues.length})`);
      for (const issue of issues) {
        lines.push(`- **[${issue.severity}]** ${issue.description}`);
        if (issue.suggestedFix) {
          lines.push(`  - Fix: ${issue.suggestedFix}`);
        }
      }
      lines.push("");
    }
  }

  // All heuristic issues
  const allIssues = report.scenarios.flatMap((r) => r.grade.issues);
  if (allIssues.length > 0) {
    lines.push("## Heuristic Issues");
    lines.push("");

    const byCategory: Record<string, typeof allIssues> = {};
    for (const issue of allIssues) {
      if (!byCategory[issue.category]) byCategory[issue.category] = [];
      byCategory[issue.category].push(issue);
    }

    for (const [category, issues] of Object.entries(byCategory)) {
      lines.push(`### ${category} (${issues.length})`);
      for (const issue of issues) {
        lines.push(`- **${issue.severity}**: ${issue.description}`);
        if (issue.evidence) {
          lines.push(`  > ${issue.evidence.slice(0, 200)}`);
        }
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ============================================================================
// COMPARE_RESULTS.md Generation
// ============================================================================

export function generateCompareResults(db: EvalDatabase): string {
  const runs = db.getRunHistory(10);
  if (runs.length === 0) return "# Evaluation Comparison\n\nNo runs recorded yet.\n";

  const lines: string[] = [];
  lines.push("# Evaluation Comparison");
  lines.push("");
  lines.push("Last 10 evaluation runs, most recent first.");
  lines.push("");

  // Summary table
  lines.push("| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |");
  lines.push("|---|--------|------|-------|-----------|----------------|-----------------|");

  for (let i = 0; i < runs.length; i++) {
    const run = runs[i];
    const date = run.timestamp.split("T")[0];
    const supMean = run.overallSupervisorMean !== null ? String(run.overallSupervisorMean) : "-";
    const heurMean = run.overallHeuristicMean !== null ? String(run.overallHeuristicMean) : "-";
    const delta = i > 0 && runs[i - 1].overallHeuristicMean !== null && run.overallHeuristicMean !== null
      ? ` (${run.overallHeuristicMean >= runs[i - 1].overallHeuristicMean ? "+" : ""}${(run.overallHeuristicMean - runs[i - 1].overallHeuristicMean).toFixed(0)})`
      : "";
    lines.push(
      `| ${i + 1} | ${run.id.slice(0, 16)} | ${date} | ${run.model} | ${run.scenarioCount} | ${heurMean}${delta} | ${supMean} |`
    );
  }
  lines.push("");

  // Per-scenario trend for the most recent run
  if (runs.length > 0) {
    const latest = runs[0];
    const latestResults = db.getLastRunScenarioResults(latest.id);

    if (latestResults.length > 0) {
      lines.push("## Latest Run Scenario Breakdown");
      lines.push("");
      lines.push("| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |");
      lines.push("|----------|------|-----------|------------|-------|-------|-----|----------|------|");

      for (const sr of latestResults) {
        const sup = sr.supervisorScore !== null ? String(sr.supervisorScore) : "-";
        const tsc = sr.typecheckPass ? "\u2713" : `\u2717(${sr.typecheckErrorCount})`;
        const dur = formatDuration(sr.durationMs);
        lines.push(
          `| ${sr.scenarioId} | ${sr.scenarioType} | ${sr.heuristicScore} | ${sup} | ${sr.turnCount} | ${sr.toolCallCount} | ${tsc} | ${dur} | ${sr.stopReason} |`
        );
      }
      lines.push("");
    }

    // Delta table vs previous run
    if (runs.length >= 2) {
      const previous = runs[1];
      const prevResults = db.getLastRunScenarioResults(previous.id);

      const prevMap = new Map(prevResults.map((r) => [r.scenarioId, r]));

      lines.push("## Delta vs Previous Run");
      lines.push("");
      lines.push(`Comparing **${latest.id.slice(0, 16)}** vs **${previous.id.slice(0, 16)}**`);
      lines.push("");
      lines.push("| Scenario | Heuristic | Supervisor | Turns | Duration |");
      lines.push("|----------|-----------|------------|-------|----------|");

      for (const sr of latestResults) {
        const prev = prevMap.get(sr.scenarioId);
        if (!prev) {
          lines.push(`| ${sr.scenarioId} | ${sr.heuristicScore} (new) | - | ${sr.turnCount} | ${formatDuration(sr.durationMs)} |`);
          continue;
        }

        const hDelta = sr.heuristicScore - prev.heuristicScore;
        const hStr = `${sr.heuristicScore} (${hDelta >= 0 ? "+" : ""}${hDelta})`;

        let sStr = "-";
        if (sr.supervisorScore !== null && prev.supervisorScore !== null) {
          const sDelta = sr.supervisorScore - prev.supervisorScore;
          sStr = `${sr.supervisorScore} (${sDelta >= 0 ? "+" : ""}${sDelta})`;
        } else if (sr.supervisorScore !== null) {
          sStr = `${sr.supervisorScore} (new)`;
        }

        const tDelta = sr.turnCount - prev.turnCount;
        const tStr = `${sr.turnCount} (${tDelta >= 0 ? "+" : ""}${tDelta})`;

        const dDelta = sr.durationMs - prev.durationMs;
        const dStr = `${formatDuration(sr.durationMs)} (${dDelta >= 0 ? "+" : ""}${formatDuration(Math.abs(dDelta))})`;

        lines.push(`| ${sr.scenarioId} | ${hStr} | ${sStr} | ${tStr} | ${dStr} |`);
      }
      lines.push("");
    }
  }

  // Open framework issues
  const openIssues = db.getOpenIssues();
  if (openIssues.length > 0) {
    lines.push("## Open Framework Issues");
    lines.push("");
    lines.push("| Issue | Source | Severity | Occurrences | First Seen | Last Seen |");
    lines.push("|-------|--------|----------|-------------|------------|-----------|");

    for (const issue of openIssues.slice(0, 20)) {
      const firstDate = issue.firstSeenAt.split("T")[0];
      const lastDate = issue.lastSeenAt.split("T")[0];
      lines.push(
        `| ${issue.description.slice(0, 60)} | ${issue.source} | ${issue.severity} | ${issue.occurrenceCount} | ${firstDate} | ${lastDate} |`
      );
    }
    lines.push("");
  }

  lines.push(`\n*Generated at ${new Date().toISOString()}*\n`);
  return lines.join("\n");
}

// ============================================================================
// Main
// ============================================================================

async function runScenario(
  scenario: EvalScenario,
  options: RunOptions,
  display: LiveDisplay,
  evalRunId: string
): Promise<ScenarioResult | null> {
  let workspace: { path: string; srcDir?: string; cleanup: () => void } | null = null;
  /** For Playwright scenarios, the full project root (may differ from workspace.path) */
  let projectRoot: string | null = null;

  // Create per-scenario logger (always — used for file output)
  const logger = options.verbose
    ? new ScenarioLogger(options.outputDir, evalRunId, scenario.id)
    : undefined;

  try {
    const runId = `${scenario.id}-${Date.now()}`;

    // Scaffold workspace based on scenario type
    if (scenario.type === "project") {
      if (scenario.playwrightVerification) {
        // Use golden project copy for Playwright scenarios
        try {
          const golden = await getGoldenProject();
          logger?.log(`Using golden project copy from ${golden.path}`);
          const copy = copyGoldenWorkspace(golden.path, runId);
          projectRoot = copy.path;
          const sharedDir = path.join(copy.path, "packages/shared");
          workspace = { path: sharedDir, cleanup: copy.cleanup };
        } catch (goldenErr) {
          const msg = goldenErr instanceof Error ? goldenErr.message : String(goldenErr);
          logger?.warn(`Golden project unavailable (${msg.slice(0, 100)}), falling back`);
          const projectWorkspace = scaffoldProjectWorkspace(scenario, runId);
          workspace = {
            path: projectWorkspace.projectRoot,
            cleanup: projectWorkspace.cleanup,
          };
        }
      } else {
        logger?.log(`Scaffolding project workspace...`);
        const projectWorkspace = scaffoldProjectWorkspace(scenario, runId);
        workspace = {
          path: projectWorkspace.projectRoot,
          cleanup: projectWorkspace.cleanup,
        };
      }
      logger?.log(`Project workspace: ${workspace.path}`);
    } else {
      // Component scenario — use symlinked workspace
      const componentWorkspace = scaffoldWorkspace(runId);
      workspace = componentWorkspace;
      logger?.log(`Workspace: ${componentWorkspace.path}`);
    }

    const log = await runAgentLoop(scenario, {
      model: options.model,
      maxTurns: scenario.maxTurns,
      verbose: options.verbose,
      workspacePath: workspace.path,
      logger,
      onProgress: (progress) => display.updateProgress(scenario.id, progress),
    });

    // Run TypeScript compilation on the workspace
    if (log.writtenFiles.length > 0) {
      logger?.log(`Written files: ${log.writtenFiles.join(", ")}`);
      logger?.log(`Running tsc --noEmit...`);
      log.typecheckResult = await runTypecheck(workspace.path);
      if (log.typecheckResult.success) {
        logger?.log(`TypeScript: PASS (0 errors)`);
      } else {
        logger?.log(`TypeScript: FAIL (${log.typecheckResult.errorCount} errors)`);
        for (const err of log.typecheckResult.errors.slice(0, 5)) {
          logger?.log(`  ${err.file}:${err.line} - ${err.code}: ${err.message}`);
        }
        if (log.typecheckResult.errors.length > 5) {
          logger?.log(`  ... and ${log.typecheckResult.errors.length - 5} more`);
        }
      }
    } else {
      logger?.log(`No files written — skipping typecheck`);
    }

    // Heuristic grading
    const grade = gradeConversation(log, scenario);

    // Supervisor evaluation
    let supervisorEval = null;
    if (!options.skipSupervisor) {
      // Playwright-enhanced supervisor for scenarios with playwrightVerification
      if (scenario.playwrightVerification && scenario.type === "project") {
        let serverCleanup: (() => void) | null = null;
        try {
          const serveDir = projectRoot || workspace.path;
          logger?.log(`Starting dev servers for Playwright verification at ${serveDir}...`);
          const serverHandles = await startServers(serveDir, {
            verbose: options.verbose,
            log: (msg) => logger?.log(msg),
          });
          serverCleanup = serverHandles.cleanup;
          logger?.log(`Servers ready: web=${serverHandles.webUrl}, api=${serverHandles.apiUrl}`);

          supervisorEval = await runPlaywrightSupervisorEvaluation(
            log,
            scenario,
            {
              model: options.supervisorModel,
              verbose: options.verbose,
              logger,
              webUrl: serverHandles.webUrl,
              apiUrl: serverHandles.apiUrl,
              playwrightInstructions: scenario.playwrightInstructions,
            }
          );
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          logger?.warn(`Playwright supervisor failed: ${msg.slice(0, 200)}`);
          logger?.warn(`Falling back to static supervisor...`);
          try {
            supervisorEval = await runSupervisorEvaluation(log, scenario, {
              model: options.supervisorModel,
              verbose: options.verbose,
              logger,
            });
          } catch (fallbackErr) {
            const fbMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
            logger?.warn(`Static supervisor also failed: ${fbMsg.slice(0, 200)}`);
          }
        } finally {
          if (serverCleanup) {
            logger?.log(`Stopping dev servers...`);
            serverCleanup();
          }
        }
      } else {
        logger?.log(`Running supervisor evaluation...`);
        try {
          supervisorEval = await runSupervisorEvaluation(log, scenario, {
            model: options.supervisorModel,
            verbose: options.verbose,
            logger,
          });
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          logger?.warn(`Supervisor failed: ${msg.slice(0, 200)}`);
        }
      }
    }

    const result: ScenarioResult = { log, grade, supervisorEval };
    display.setResult(scenario.id, result);

    // Log summary to file
    logger?.log(`Heuristic score: ${grade.overallScore}/100`);
    if (supervisorEval) {
      logger?.log(`Supervisor score: ${supervisorEval.qualitativeScore}/100`);
      logger?.log(`Framework issues: ${supervisorEval.frameworkIssues.length}`);
    }
    logger?.log(
      `Turns: ${log.totalTurns}, Tool calls: ${log.totalToolCalls}, Messages: ${log.messages.length}`
    );
    logger?.log(
      `Issues: ${grade.issues.length} (${grade.issues.filter((i) => i.severity === "critical").length} critical)`
    );
    logger?.log(`Duration: ${(log.totalDurationMs / 1000).toFixed(1)}s`);
    logger?.log(`Stop: ${log.agentStoppedReason}`);

    if (
      log.agentStoppedReason === "error" ||
      log.agentStoppedReason === "timeout"
    ) {
      const output = log.finalOutput || "";
      if (
        output.toLowerCase().includes("api key") ||
        output.toLowerCase().includes("auth")
      ) {
        logger?.error(`Auth error: ${output}`);
        logger?.error(
          `Set ANTHROPIC_API_KEY in packages/mcp-server/.env or ensure Claude Code is authenticated.`
        );
      } else if (output) {
        logger?.error(`Error output: ${output.slice(0, 300)}`);
      }
    }

    // Cleanup workspace (unless verbose — preserve for debugging)
    if (!options.verbose && workspace) {
      workspace.cleanup();
    } else if (workspace) {
      logger?.log(`Workspace preserved for debugging: ${workspace.path}`);
    }

    logger?.close();
    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    display.setError(scenario.id, msg);

    logger?.error(`FAILED: ${msg}`);
    logger?.close();

    // Cleanup even on error (unless verbose)
    if (!options.verbose && workspace) {
      workspace.cleanup();
    }

    if (msg.includes("Claude CLI not found")) {
      process.exit(1);
    }
    return null;
  }
}

async function main() {
  const options = parseArgs();

  // Verify claude CLI is available
  console.log("Checking Claude Code CLI...");
  try {
    const version = execSync("claude --version 2>/dev/null", {
      encoding: "utf-8",
    }).trim();
    console.log(`Found: ${version}`);
  } catch {
    console.error("Error: `claude` CLI not found.");
    console.error(
      "Install Claude Code: https://docs.anthropic.com/en/docs/claude-code"
    );
    process.exit(1);
  }

  console.log("");
  console.log("Idealyst MCP Server Evaluation");
  console.log("==============================");
  console.log(`Model: ${options.model}`);
  console.log(`Supervisor: ${options.skipSupervisor ? "disabled" : options.supervisorModel}`);
  console.log(`Scenarios: ${options.scenarios.join(", ")}`);
  console.log(`Type filter: ${options.scenarioType}`);
  const authSource = process.env.ANTHROPIC_API_KEY
    ? "API key (env/dotenv)"
    : process.env.ANTHROPIC_ACCESS_TOKEN
      ? "Access token (env/dotenv)"
      : "Claude Code (your login)";
  console.log(`Auth: ${authSource}`);

  // Resolve scenarios
  let selectedScenarios: EvalScenario[];

  if (options.scenarios.includes("all")) {
    if (options.scenarioType !== "all") {
      selectedScenarios = getScenariosByType(options.scenarioType as ScenarioType);
    } else {
      selectedScenarios = Object.values(scenarios);
    }
  } else {
    selectedScenarios = options.scenarios
      .map((id) => {
        const s = scenarios[id];
        if (!s) {
          console.warn(`Warning: Unknown scenario '${id}', skipping.`);
        }
        return s;
      })
      .filter(Boolean);

    // Apply type filter even for named scenarios
    if (options.scenarioType !== "all") {
      selectedScenarios = selectedScenarios.filter(
        (s) => s.type === options.scenarioType
      );
    }
  }

  if (selectedScenarios.length === 0) {
    console.error("No valid scenarios selected.");
    process.exit(1);
  }

  const parallel = selectedScenarios.length > 1;
  const concurrency = Math.min(options.concurrency, selectedScenarios.length);
  console.log(`Mode: ${parallel ? `parallel (concurrency: ${concurrency})` : "sequential"}`);
  if (options.verbose) {
    console.log(`Verbose: per-scenario logs → ${options.outputDir}/logs/`);
  }
  console.log("");

  // Generate a run ID for log files
  const evalRunId = `eval-${Date.now()}`;

  // Create live display
  const display = new LiveDisplay(selectedScenarios);

  // Run evaluations
  let results: ScenarioResult[];

  if (parallel) {
    // Parallel with concurrency limit to avoid API rate limits
    const CONCURRENCY = concurrency;
    display.init();

    const queue = [...selectedScenarios];
    const allResults: (ScenarioResult | null)[] = [];
    const running = new Set<Promise<void>>();

    while (queue.length > 0 || running.size > 0) {
      while (running.size < CONCURRENCY && queue.length > 0) {
        const scenario = queue.shift()!;
        const p = runScenario(scenario, options, display, evalRunId).then(
          (result) => {
            allResults.push(result);
            running.delete(p);
          }
        );
        running.add(p);
      }
      if (running.size > 0) {
        await Promise.race(running);
      }
    }
    results = allResults.filter((r): r is ScenarioResult => r !== null);

    // Final render
    display.printFinalSummary();
  } else {
    // Sequential (single scenario)
    results = [];
    display.init();
    for (const scenario of selectedScenarios) {
      const result = await runScenario(scenario, options, display, evalRunId);
      if (result) results.push(result);
    }
    display.printFinalSummary();
  }

  if (options.verbose) {
    const logDir = path.join(options.outputDir, "logs", evalRunId);
    console.log(`\nVerbose logs: ${logDir}/`);
  }

  if (results.length === 0) {
    console.error("All scenarios failed. No report generated.");
    process.exit(1);
  }

  // Build report
  const allFrameworkIssues = collectAllFrameworkIssues(results);
  const supervisorAggregateScores = computeSupervisorAggregateScores(results);

  const report: EvalReport = {
    runId: `eval-${Date.now()}`,
    timestamp: new Date().toISOString(),
    model: options.model,
    mcpServerVersion: "1.2.101",
    scenarios: results,
    aggregateScores: computeAggregateScores(results),
    toolUsageStats: computeToolStats(results),
    supervisorAggregateScores,
    allFrameworkIssues,
  };

  // Write output
  fs.mkdirSync(options.outputDir, { recursive: true });

  const reportPath = path.join(options.outputDir, `${report.runId}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  const summaryPath = path.join(
    options.outputDir,
    `${report.runId}.summary.md`
  );
  fs.writeFileSync(summaryPath, generateMarkdownSummary(report));

  // Save to SQLite database
  const db = tryOpenDatabase(options.dbPath);
  if (db) {
    try {
      db.saveRun(report);
      if (allFrameworkIssues.length > 0) {
        db.saveFrameworkIssues(report.runId, allFrameworkIssues);
      }
      console.log(`Database: saved to ${options.dbPath}`);

      // Generate COMPARE_RESULTS.md
      const compareResultsPath = path.resolve(__dirname, "../COMPARE_RESULTS.md");
      const compareContent = generateCompareResults(db);
      fs.writeFileSync(compareResultsPath, compareContent);
      console.log(`Comparison: ${compareResultsPath}`);

      // Print trend comparison if requested or if there's a previous run
      if (options.compare) {
        const lastRun = db.getRunHistory(2);
        if (lastRun.length >= 2) {
          const current = lastRun[0];
          const previous = lastRun[1];
          console.log("");
          console.log("Trend vs Previous Run");
          console.log("---------------------");
          const hDelta = (current.overallHeuristicMean ?? 0) - (previous.overallHeuristicMean ?? 0);
          console.log(`  Heuristic: ${current.overallHeuristicMean ?? "-"} (${hDelta >= 0 ? "+" : ""}${hDelta.toFixed(0)})`);
          if (current.overallSupervisorMean !== null && previous.overallSupervisorMean !== null) {
            const sDelta = current.overallSupervisorMean - previous.overallSupervisorMean;
            console.log(`  Supervisor: ${current.overallSupervisorMean} (${sDelta >= 0 ? "+" : ""}${sDelta.toFixed(0)})`);
          }
        }
      }

      db.close();
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`Database save failed: ${msg}`);
      db.close();
    }
  }

  // Print final summary
  console.log("");
  console.log("==============================");
  console.log("Evaluation Complete");
  console.log(
    `Heuristic mean: ${report.aggregateScores.overall_mean ?? "-"}/100`
  );
  if (supervisorAggregateScores) {
    console.log(
      `Supervisor mean: ${supervisorAggregateScores.qualitativeScore_mean ?? "-"}/100`
    );
  }
  if (allFrameworkIssues.length > 0) {
    console.log(`Framework issues: ${allFrameworkIssues.length}`);
  }
  console.log("");
  console.log(`Report: ${reportPath}`);
  console.log(`Summary: ${summaryPath}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
