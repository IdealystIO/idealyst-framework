/**
 * Supervisor Agent
 *
 * Invokes a separate Claude CLI instance to qualitatively evaluate
 * a task agent's conversation. The supervisor reads the full conversation
 * log, written files, and TypeScript compilation results, then produces
 * a structured evaluation against extensible criteria.
 */

import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import type {
  EvalConversationLog,
  EvalScenario,
  SupervisorEvaluation,
  SupervisorCriterionResult,
  FrameworkIssue,
} from "./types.js";
import { DEFAULT_CRITERIA, type SupervisorCriterion } from "./criteria.js";
import type { ScenarioLogger } from "./logger.js";

export interface SupervisorOptions {
  model: string;
  verbose?: boolean;
  /** Per-scenario file logger (replaces console.log for parallel execution) */
  logger?: ScenarioLogger;
}

// ============================================================================
// Prompt Construction
// ============================================================================

/**
 * Build a condensed version of the conversation log for the supervisor.
 * Truncates tool results and long messages to stay within reasonable token limits.
 */
function condenseConversationLog(log: EvalConversationLog): string {
  const sections: string[] = [];

  // Interleave messages and tool calls chronologically by turnIndex
  let currentTurn = -1;

  for (const msg of log.messages) {
    if (msg.turnIndex !== currentTurn) {
      sections.push(`\n--- Turn ${msg.turnIndex} ---`);
      currentTurn = msg.turnIndex;
    }

    const truncated =
      msg.content.length > 1000
        ? msg.content.slice(0, 500) + "\n... [truncated] ...\n" + msg.content.slice(-300)
        : msg.content;
    sections.push(`[${msg.role}]: ${truncated}`);
  }

  // Add tool call summary
  sections.push("\n--- Tool Calls ---");
  for (const tc of log.toolCalls) {
    const argsStr = JSON.stringify(tc.arguments);
    const truncatedArgs =
      argsStr.length > 200 ? argsStr.slice(0, 200) + "..." : argsStr;
    sections.push(`Turn ${tc.turnIndex}: ${tc.toolName}(${truncatedArgs})`);
  }

  // Add tool results with errors highlighted
  const errorResults = log.toolResults.filter((tr) => tr.response.isError);
  if (errorResults.length > 0) {
    sections.push("\n--- Tool Errors ---");
    for (const tr of errorResults) {
      const text = tr.response.content.map((c) => c.text).join("\n");
      const truncated = text.length > 500 ? text.slice(0, 500) + "..." : text;
      sections.push(`Turn ${tr.turnIndex}: ${tr.toolName} ERROR: ${truncated}`);
    }
  }

  return sections.join("\n");
}

/**
 * Build the criteria section of the supervisor prompt.
 * Dynamically generated from the criteria definitions.
 */
function buildCriteriaPrompt(criteria: SupervisorCriterion[]): string {
  const lines: string[] = [];

  for (let i = 0; i < criteria.length; i++) {
    const c = criteria[i];
    const failNote =
      c.failSeverity === "huge"
        ? " -- HUGE FAIL if violated"
        : c.failSeverity === "medium"
          ? " -- MEDIUM FAIL if violated"
          : "";

    lines.push(`### ${i + 1}. ${c.label} (${c.id})${failNote}`);
    lines.push(c.description);
    lines.push("");
    lines.push("**Scoring guidance:**");
    lines.push(c.evalGuidance);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Build the complete supervisor prompt.
 */
function buildSupervisorPrompt(
  log: EvalConversationLog,
  scenario: EvalScenario,
  writtenFileContents: Record<string, string>,
  criteria: SupervisorCriterion[]
): string {
  const condensedLog = condenseConversationLog(log);

  // File contents section
  const fileLines: string[] = [];
  for (const [filename, content] of Object.entries(writtenFileContents)) {
    fileLines.push(`### ${filename}`);
    fileLines.push("```tsx");
    fileLines.push(content);
    fileLines.push("```");
    fileLines.push("");
  }
  const filesSection =
    fileLines.length > 0
      ? fileLines.join("\n")
      : "No files were written by the agent.";

  // TypeScript results
  let tscSection: string;
  if (!log.typecheckResult) {
    tscSection = "TypeScript compilation was not run (no files written).";
  } else if (log.typecheckResult.success) {
    tscSection = "TypeScript compilation PASSED with 0 errors.";
  } else {
    const errors = log.typecheckResult.errors
      .slice(0, 10)
      .map((e) => `  ${e.file}:${e.line} — ${e.code}: ${e.message}`)
      .join("\n");
    const more =
      log.typecheckResult.errors.length > 10
        ? `\n  ... and ${log.typecheckResult.errors.length - 10} more`
        : "";
    tscSection = `TypeScript compilation FAILED with ${log.typecheckResult.errorCount} error(s):\n${errors}${more}`;
  }

  // Criteria IDs for JSON schema
  const criteriaIds = criteria.map((c) => `"${c.id}"`).join(", ");

  return `# Idealyst Framework Evaluation — Supervisor Review

You are evaluating how well a coding agent used the Idealyst cross-platform framework to complete a task. The agent had access to MCP documentation tools but NO pre-loaded framework knowledge. It had to discover everything through the MCP server.

## Task Given to Agent

${scenario.taskPrompt}

## Agent Conversation Log

${condensedLog}

## Files Written by Agent

${filesSection}

## TypeScript Compilation Result

${tscSection}

## Evaluation Criteria

Evaluate the agent across these ${criteria.length} criteria. For each, provide:
- **score** (0-100)
- **severity**: "pass" | "minor_fail" | "medium_fail" | "huge_fail"
- **reasoning** (2-3 sentences explaining your assessment)
- **evidence** (array of specific quotes, line references, or tool call references)

${buildCriteriaPrompt(criteria)}

## Framework Issues

Also identify any gaps or problems in:
- **The MCP server tools** (missing info, confusing responses, incomplete documentation)
- **The CLI** (missing commands, unclear flags, scaffolding issues)
- **The framework itself** (missing components, poor APIs, broken types)
- **The documentation** (incomplete, misleading, outdated examples)

For each issue provide: issueId (short slug), source, severity, description, suggestedFix.
Only include real issues you observed — don't fabricate problems.

## Response Format

Respond with ONLY valid JSON matching this exact schema:

{
  "criteria": [
    {
      "criterionId": "${criteria[0]?.id || "example"}",
      "label": "${criteria[0]?.label || "Example"}",
      "score": 85,
      "severity": "pass",
      "reasoning": "Explanation of assessment...",
      "evidence": ["Turn 5: imported from @idealyst/components correctly", "..."]
    }
    // ... one entry per criterion: ${criteriaIds}
  ],
  "qualitativeScore": 78,
  "summary": "Overall 2-3 sentence assessment of the agent's performance...",
  "frameworkIssues": [
    {
      "issueId": "short-slug-here",
      "source": "mcp_server",
      "severity": "major",
      "description": "Description of the issue...",
      "suggestedFix": "How to fix it..."
    }
  ]
}

IMPORTANT: Your response must be ONLY the JSON object, no markdown fences, no explanation text.

CRITICAL: You are in a tools-disabled evaluation session. Do NOT attempt to call any tools (Glob, Read, Write, Bash, etc.). You have all the information you need above. Respond ONLY with the JSON evaluation object.`;
}

// ============================================================================
// Supervisor Invocation
// ============================================================================

/**
 * Read all written files from the workspace into a map.
 */
function readWrittenFiles(
  log: EvalConversationLog
): Record<string, string> {
  const contents: Record<string, string> = {};
  if (!log.workspacePath || log.writtenFiles.length === 0) return contents;

  const srcDir = path.join(log.workspacePath, "src");
  for (const relPath of log.writtenFiles) {
    const absPath = path.join(srcDir, relPath);
    try {
      contents[relPath] = fs.readFileSync(absPath, "utf-8");
    } catch {
      // File may have been cleaned up
    }
  }
  return contents;
}

/**
 * Parse the supervisor's JSON response into structured types.
 */
function parseSupervisorResponse(
  raw: string,
  scenarioId: string,
  criteria: SupervisorCriterion[]
): {
  criteria: SupervisorCriterionResult[];
  qualitativeScore: number;
  summary: string;
  frameworkIssues: FrameworkIssue[];
} {
  // Extract JSON from response — may have preamble text and/or markdown fences
  let cleaned = raw.trim();

  // Detect if Claude tried to use tools (common failure mode)
  if (cleaned.includes('<tool_use>') || cleaned.includes('"name":"Glob"') || cleaned.includes('"name":"Read"')) {
    throw new Error('Supervisor attempted to use tools instead of responding with JSON. Retrying...');
  }

  // Try to find JSON within markdown code fences first
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  } else if (cleaned.startsWith("```")) {
    // Simple fence stripping
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  } else {
    // Try to find the JSON object by looking for the first '{' and last '}'
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
  }

  const parsed = JSON.parse(cleaned);

  // Validate and normalize criteria results
  const criteriaResults: SupervisorCriterionResult[] = [];
  const rawCriteria = Array.isArray(parsed.criteria) ? parsed.criteria : [];

  for (const criterion of criteria) {
    const match = rawCriteria.find(
      (rc: Record<string, unknown>) => rc.criterionId === criterion.id
    );

    if (match) {
      criteriaResults.push({
        criterionId: criterion.id,
        label: criterion.label,
        score: Math.max(0, Math.min(100, Number(match.score) || 0)),
        severity: validateSeverity(String(match.severity || "pass")),
        reasoning: String(match.reasoning || ""),
        evidence: Array.isArray(match.evidence)
          ? match.evidence.map(String)
          : [],
      });
    } else {
      // Criterion not in response — use neutral score
      criteriaResults.push({
        criterionId: criterion.id,
        label: criterion.label,
        score: 50,
        severity: "pass",
        reasoning: "Not evaluated by supervisor",
        evidence: [],
      });
    }
  }

  // Parse framework issues
  const frameworkIssues: FrameworkIssue[] = [];
  if (Array.isArray(parsed.frameworkIssues)) {
    for (const fi of parsed.frameworkIssues) {
      if (fi && typeof fi === "object" && fi.description) {
        frameworkIssues.push({
          issueId: String(fi.issueId || generateIssueId(fi.description)),
          source: validateSource(String(fi.source || "framework")),
          severity: validateIssueSeverity(String(fi.severity || "minor")),
          description: String(fi.description),
          scenarioId,
          suggestedFix: String(fi.suggestedFix || ""),
        });
      }
    }
  }

  return {
    criteria: criteriaResults,
    qualitativeScore: Math.max(
      0,
      Math.min(100, Number(parsed.qualitativeScore) || 0)
    ),
    summary: String(parsed.summary || ""),
    frameworkIssues,
  };
}

function validateSeverity(
  s: string
): "pass" | "minor_fail" | "medium_fail" | "huge_fail" {
  const valid = ["pass", "minor_fail", "medium_fail", "huge_fail"];
  return valid.includes(s) ? (s as "pass" | "minor_fail" | "medium_fail" | "huge_fail") : "pass";
}

function validateSource(
  s: string
): "mcp_server" | "cli" | "framework" | "documentation" {
  const valid = ["mcp_server", "cli", "framework", "documentation"];
  return valid.includes(s) ? (s as "mcp_server" | "cli" | "framework" | "documentation") : "framework";
}

function validateIssueSeverity(s: string): "critical" | "major" | "minor" {
  const valid = ["critical", "major", "minor"];
  return valid.includes(s) ? (s as "critical" | "major" | "minor") : "minor";
}

function generateIssueId(description: string): string {
  return description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60)
    .replace(/^-|-$/g, "");
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Run the supervisor evaluation on a completed task agent conversation.
 *
 * Invokes `claude -p` with the supervisor prompt and parses the structured
 * JSON response.
 */
export async function runSupervisorEvaluation(
  log: EvalConversationLog,
  scenario: EvalScenario,
  options: SupervisorOptions,
  criteria: SupervisorCriterion[] = DEFAULT_CRITERIA
): Promise<SupervisorEvaluation> {
  const startTime = Date.now();

  // Read written files
  const writtenFileContents = readWrittenFiles(log);

  // Build the prompt
  const prompt = buildSupervisorPrompt(log, scenario, writtenFileContents, criteria);

  const logger = options.logger;
  logger?.log(`[Supervisor] Evaluating with ${options.model}...`);
  logger?.log(`[Supervisor] Prompt length: ${prompt.length} chars`);
  logger?.log(`[Supervisor] Criteria: ${criteria.map((c) => c.id).join(", ")}`);

  // Write empty MCP config to temp file (supervisor needs NO tools)
  const emptyMcpConfig = path.join(os.tmpdir(), `eval-supervisor-mcp-${Date.now()}.json`);
  fs.writeFileSync(emptyMcpConfig, JSON.stringify({ mcpServers: {} }));

  // Try up to 3 times
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // Use execFileSync with --tools "" to disable ALL tools (built-in + MCP)
      // and --strict-mcp-config to prevent MCP server loading.
      // Without this, Claude tries to use tools and exhausts the turn budget.
      const raw = execFileSync(
        "claude",
        [
          "-p", "-",
          "--model", options.model,
          "--output-format", "text",
          "--max-turns", "5",
          "--no-session-persistence",
          "--mcp-config", emptyMcpConfig,
          "--strict-mcp-config",
          "--tools", "",
        ],
        {
          input: prompt,
          encoding: "utf-8",
          timeout: 300_000, // 5 minute timeout for supervisor
          cwd: process.cwd(),
          maxBuffer: 10 * 1024 * 1024, // 10MB
        }
      );

      logger?.log(`[Supervisor] Raw response (first 200 chars): ${raw.slice(0, 200)}`);

      const parsed = parseSupervisorResponse(raw, scenario.id, criteria);

      const evaluation: SupervisorEvaluation = {
        scenarioId: scenario.id,
        evaluatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        criteria: parsed.criteria,
        qualitativeScore: parsed.qualitativeScore,
        summary: parsed.summary,
        frameworkIssues: parsed.frameworkIssues,
        rawResponse: raw,
      };

      logger?.log(
        `[Supervisor] Score: ${evaluation.qualitativeScore}/100 (${(evaluation.durationMs / 1000).toFixed(1)}s)`
      );
      logger?.log(`[Supervisor] Issues: ${evaluation.frameworkIssues.length} framework issues`);

      // Clean up temp MCP config
      try { fs.unlinkSync(emptyMcpConfig); } catch { /* ignore */ }

      return evaluation;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger?.warn(
        `[Supervisor] Attempt ${attempt} failed: ${lastError.message.slice(0, 200)}`
      );
      // If execSync threw, check if there's stdout/stderr on the error
      const execError = error as { stdout?: string; stderr?: string };
      if (execError.stdout) {
        logger?.warn(`[Supervisor] stdout: ${execError.stdout.slice(0, 300)}`);
      }
      if (execError.stderr) {
        logger?.warn(`[Supervisor] stderr: ${execError.stderr.slice(0, 300)}`);
      }
      if (attempt < 3) continue;
    }
  }

  // Clean up temp MCP config
  try { fs.unlinkSync(emptyMcpConfig); } catch { /* ignore */ }

  // All attempts failed — return a degraded evaluation
  logger?.error(`[Supervisor] All attempts failed, returning degraded evaluation`);

  return {
    scenarioId: scenario.id,
    evaluatedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    criteria: criteria.map((c) => ({
      criterionId: c.id,
      label: c.label,
      score: 0,
      severity: "pass" as const,
      reasoning: `Supervisor evaluation failed: ${lastError?.message || "unknown error"}`,
      evidence: [],
    })),
    qualitativeScore: 0,
    summary: `Supervisor evaluation failed after 3 attempts: ${lastError?.message || "unknown error"}`,
    frameworkIssues: [],
    rawResponse: lastError?.message || "",
  };
}
