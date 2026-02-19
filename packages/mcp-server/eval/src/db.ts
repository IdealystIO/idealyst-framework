/**
 * Evaluation Database
 *
 * SQLite storage for tracking eval results over time.
 * Uses better-sqlite3 for synchronous, zero-config operation.
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import type {
  EvalReport,
  FrameworkIssue,
  DbEvalRun,
  DbScenarioResult,
  DbFrameworkIssue,
} from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.resolve(__dirname, "../data/eval-history.sqlite3");

// ============================================================================
// Schema
// ============================================================================

const SCHEMA_SQL = `
-- Eval runs
CREATE TABLE IF NOT EXISTS eval_runs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  model TEXT NOT NULL,
  mcp_server_version TEXT NOT NULL,
  overall_heuristic_mean REAL,
  overall_supervisor_mean REAL,
  scenario_count INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Per-scenario results
CREATE TABLE IF NOT EXISTS scenario_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES eval_runs(id),
  scenario_id TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  heuristic_score REAL NOT NULL,
  supervisor_score REAL,
  typecheck_pass INTEGER NOT NULL,
  typecheck_error_count INTEGER NOT NULL,
  turn_count INTEGER NOT NULL,
  tool_call_count INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  stop_reason TEXT NOT NULL,
  heuristic_dimensions TEXT,
  supervisor_criteria TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Per-criterion supervisor scores (for trending)
CREATE TABLE IF NOT EXISTS supervisor_criteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES eval_runs(id),
  scenario_id TEXT NOT NULL,
  criterion_id TEXT NOT NULL,
  score REAL NOT NULL,
  severity TEXT NOT NULL,
  reasoning TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Framework issues (deduplicated by issue_id)
CREATE TABLE IF NOT EXISTS framework_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_fix TEXT,
  first_seen_run_id TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_run_id TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  resolved INTEGER DEFAULT 0,
  resolved_at TEXT,
  resolved_in_run_id TEXT
);

-- Issue occurrences (link table)
CREATE TABLE IF NOT EXISTS issue_occurrences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue_id TEXT NOT NULL,
  run_id TEXT NOT NULL REFERENCES eval_runs(id),
  scenario_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(issue_id, run_id, scenario_id)
);

-- Score history (denormalized for fast trend queries)
CREATE TABLE IF NOT EXISTS score_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES eval_runs(id),
  timestamp TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scenario_results_run ON scenario_results(run_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_criteria_run ON supervisor_criteria(run_id);
CREATE INDEX IF NOT EXISTS idx_score_history_metric ON score_history(metric_name, timestamp);
CREATE INDEX IF NOT EXISTS idx_issue_occurrences_issue ON issue_occurrences(issue_id);
`;

// ============================================================================
// Database Class
// ============================================================================

/**
 * Evaluation database backed by SQLite.
 *
 * Wraps better-sqlite3 with typed methods for saving and querying eval results.
 * Handles schema creation on first open.
 */
export class EvalDatabase {
  private db: import("better-sqlite3").Database;

  constructor(dbPath: string = DEFAULT_DB_PATH) {
    // Use createRequire for ESM compat with native better-sqlite3
    const esmRequire = createRequire(import.meta.url);
    const Database = esmRequire("better-sqlite3") as typeof import("better-sqlite3");

    // Ensure data directory exists
    const dir = path.dirname(dbPath);
    fs.mkdirSync(dir, { recursive: true });

    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(SCHEMA_SQL);
  }

  // --------------------------------------------------------------------------
  // Write operations
  // --------------------------------------------------------------------------

  saveRun(report: EvalReport): void {
    const tx = this.db.transaction(() => {
      // Insert run
      this.db
        .prepare(
          `INSERT OR REPLACE INTO eval_runs (id, timestamp, model, mcp_server_version, overall_heuristic_mean, overall_supervisor_mean, scenario_count)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          report.runId,
          report.timestamp,
          report.model,
          report.mcpServerVersion,
          report.aggregateScores.overall_mean ?? null,
          report.supervisorAggregateScores?.qualitativeScore_mean ?? null,
          report.scenarios.length
        );

      // Insert scenario results
      const insertScenario = this.db.prepare(
        `INSERT INTO scenario_results (run_id, scenario_id, scenario_type, heuristic_score, supervisor_score, typecheck_pass, typecheck_error_count, turn_count, tool_call_count, duration_ms, stop_reason, heuristic_dimensions, supervisor_criteria)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      const insertCriterion = this.db.prepare(
        `INSERT INTO supervisor_criteria (run_id, scenario_id, criterion_id, score, severity, reasoning)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      for (const result of report.scenarios) {
        const { log, grade, supervisorEval } = result;

        insertScenario.run(
          report.runId,
          log.scenarioId,
          "component", // TODO: detect from scenario registry
          grade.overallScore,
          supervisorEval?.qualitativeScore ?? null,
          log.typecheckResult?.success ? 1 : 0,
          log.typecheckResult?.errorCount ?? 0,
          log.totalTurns,
          log.totalToolCalls,
          log.totalDurationMs,
          log.agentStoppedReason,
          JSON.stringify(grade.dimensions),
          supervisorEval ? JSON.stringify(supervisorEval.criteria) : null
        );

        // Insert individual supervisor criteria for trending
        if (supervisorEval) {
          for (const criterion of supervisorEval.criteria) {
            insertCriterion.run(
              report.runId,
              log.scenarioId,
              criterion.criterionId,
              criterion.score,
              criterion.severity,
              criterion.reasoning
            );
          }
        }
      }

      // Insert score history
      const insertMetric = this.db.prepare(
        `INSERT INTO score_history (run_id, timestamp, metric_name, metric_value)
         VALUES (?, ?, ?, ?)`
      );

      for (const [key, value] of Object.entries(report.aggregateScores)) {
        insertMetric.run(report.runId, report.timestamp, key, value);
      }

      if (report.supervisorAggregateScores) {
        for (const [key, value] of Object.entries(report.supervisorAggregateScores)) {
          insertMetric.run(report.runId, report.timestamp, `supervisor_${key}`, value);
        }
      }
    });

    tx();
  }

  saveFrameworkIssues(runId: string, issues: FrameworkIssue[]): void {
    const now = new Date().toISOString();

    const tx = this.db.transaction(() => {
      for (const issue of issues) {
        // Upsert framework issue
        const existing = this.db
          .prepare(`SELECT id, occurrence_count FROM framework_issues WHERE issue_id = ?`)
          .get(issue.issueId) as { id: number; occurrence_count: number } | undefined;

        if (existing) {
          this.db
            .prepare(
              `UPDATE framework_issues SET last_seen_run_id = ?, last_seen_at = ?, occurrence_count = occurrence_count + 1 WHERE issue_id = ?`
            )
            .run(runId, now, issue.issueId);
        } else {
          this.db
            .prepare(
              `INSERT INTO framework_issues (issue_id, source, severity, description, suggested_fix, first_seen_run_id, first_seen_at, last_seen_run_id, last_seen_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
              issue.issueId,
              issue.source,
              issue.severity,
              issue.description,
              issue.suggestedFix,
              runId,
              now,
              runId,
              now
            );
        }

        // Record occurrence
        this.db
          .prepare(
            `INSERT OR IGNORE INTO issue_occurrences (issue_id, run_id, scenario_id) VALUES (?, ?, ?)`
          )
          .run(issue.issueId, runId, issue.scenarioId);
      }
    });

    tx();
  }

  // --------------------------------------------------------------------------
  // Read operations
  // --------------------------------------------------------------------------

  getRunHistory(limit: number = 20): DbEvalRun[] {
    return this.db
      .prepare(
        `SELECT id, timestamp, model, mcp_server_version AS mcpServerVersion,
                overall_heuristic_mean AS overallHeuristicMean,
                overall_supervisor_mean AS overallSupervisorMean,
                scenario_count AS scenarioCount
         FROM eval_runs ORDER BY timestamp DESC LIMIT ?`
      )
      .all(limit) as DbEvalRun[];
  }

  getLastRun(): DbEvalRun | null {
    const runs = this.getRunHistory(1);
    return runs.length > 0 ? runs[0] : null;
  }

  getScenarioTrend(scenarioId: string, limit: number = 20): DbScenarioResult[] {
    return this.db
      .prepare(
        `SELECT sr.id, sr.run_id AS runId, sr.scenario_id AS scenarioId,
                sr.scenario_type AS scenarioType,
                sr.heuristic_score AS heuristicScore,
                sr.supervisor_score AS supervisorScore,
                sr.typecheck_pass AS typecheckPass,
                sr.typecheck_error_count AS typecheckErrorCount,
                sr.turn_count AS turnCount,
                sr.tool_call_count AS toolCallCount,
                sr.duration_ms AS durationMs,
                sr.stop_reason AS stopReason
         FROM scenario_results sr
         JOIN eval_runs er ON er.id = sr.run_id
         WHERE sr.scenario_id = ?
         ORDER BY er.timestamp DESC
         LIMIT ?`
      )
      .all(scenarioId, limit) as DbScenarioResult[];
  }

  getMetricTrend(
    metricName: string,
    limit: number = 20
  ): { runId: string; timestamp: string; value: number }[] {
    return this.db
      .prepare(
        `SELECT run_id AS runId, timestamp, metric_value AS value
         FROM score_history
         WHERE metric_name = ?
         ORDER BY timestamp DESC
         LIMIT ?`
      )
      .all(metricName, limit) as { runId: string; timestamp: string; value: number }[];
  }

  getOpenIssues(): DbFrameworkIssue[] {
    return this.db
      .prepare(
        `SELECT id, issue_id AS issueId, source, severity, description,
                suggested_fix AS suggestedFix,
                first_seen_run_id AS firstSeenRunId,
                first_seen_at AS firstSeenAt,
                last_seen_run_id AS lastSeenRunId,
                last_seen_at AS lastSeenAt,
                occurrence_count AS occurrenceCount,
                resolved
         FROM framework_issues
         WHERE resolved = 0
         ORDER BY occurrence_count DESC, severity ASC`
      )
      .all() as DbFrameworkIssue[];
  }

  getLastRunScenarioResults(runId: string): DbScenarioResult[] {
    return this.db
      .prepare(
        `SELECT sr.id, sr.run_id AS runId, sr.scenario_id AS scenarioId,
                sr.scenario_type AS scenarioType,
                sr.heuristic_score AS heuristicScore,
                sr.supervisor_score AS supervisorScore,
                sr.typecheck_pass AS typecheckPass,
                sr.typecheck_error_count AS typecheckErrorCount,
                sr.turn_count AS turnCount,
                sr.tool_call_count AS toolCallCount,
                sr.duration_ms AS durationMs,
                sr.stop_reason AS stopReason
         FROM scenario_results sr
         WHERE sr.run_id = ?`
      )
      .all(runId) as DbScenarioResult[];
  }

  close(): void {
    this.db.close();
  }
}

/**
 * Try to open the eval database. Returns null if better-sqlite3 is not available.
 */
export function tryOpenDatabase(dbPath?: string): EvalDatabase | null {
  try {
    return new EvalDatabase(dbPath);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("Cannot find module") || msg.includes("better-sqlite3")) {
      console.warn(
        "  [DB] better-sqlite3 not available — skipping database storage."
      );
      console.warn(
        "  [DB] Install with: yarn add -D better-sqlite3 @types/better-sqlite3"
      );
      return null;
    }
    throw error;
  }
}
