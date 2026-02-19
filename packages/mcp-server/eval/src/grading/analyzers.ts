/**
 * Grading Analyzers
 *
 * Individual analysis functions that evaluate specific dimensions
 * of the agent's conversation and output.
 */

import fs from "fs";
import path from "path";
import type {
  EvalConversationLog,
  EvalScenario,
  DimensionScore,
  EvalIssue,
} from "../types.js";
import { VALID_IDEALYST_PACKAGES } from "./rubric.js";

/**
 * Strip the `mcp__idealyst__` prefix from tool names so analyzers
 * can compare against the short names used in scenario definitions.
 */
function shortToolName(name: string): string {
  return name.replace(/^mcp__idealyst__/, "");
}

// ============================================================================
// Helpers — Code Content
// ============================================================================

/**
 * Get the code content to analyze.
 * Prefers reading written files from the workspace; falls back to finalOutput.
 */
function getCodeContent(log: EvalConversationLog): string | null {
  if (log.workspacePath && log.writtenFiles.length > 0) {
    const srcDir = path.join(log.workspacePath, "src");
    const parts: string[] = [];
    for (const relPath of log.writtenFiles) {
      const absPath = path.join(srcDir, relPath);
      try {
        parts.push(fs.readFileSync(absPath, "utf-8"));
      } catch {
        // File may have been cleaned up; skip
      }
    }
    if (parts.length > 0) return parts.join("\n\n");
  }
  return log.finalOutput;
}

// ============================================================================
// TypeScript Compilation
// ============================================================================

export function analyzeTypecheckPasses(
  log: EvalConversationLog,
  _scenario: EvalScenario
): DimensionScore {
  const notes: string[] = [];

  if (!log.typecheckResult) {
    if (log.writtenFiles.length === 0) {
      notes.push("No files written — typecheck skipped");
      return { score: 0, weight: 0.2, notes };
    }
    notes.push("Typecheck was not run");
    return { score: 0, weight: 0.2, notes };
  }

  const { success, errorCount, errors } = log.typecheckResult;

  if (success) {
    notes.push("TypeScript compilation passed with 0 errors");
    return { score: 100, weight: 0.2, notes };
  }

  let score: number;
  if (errorCount <= 2) {
    score = 70;
  } else if (errorCount <= 5) {
    score = 50;
  } else if (errorCount <= 10) {
    score = 25;
  } else {
    score = 0;
  }

  notes.push(`TypeScript compilation failed with ${errorCount} error(s)`);

  // Show first few errors
  for (const err of errors.slice(0, 5)) {
    notes.push(`  ${err.file}:${err.line} — ${err.code}: ${err.message}`);
  }
  if (errors.length > 5) {
    notes.push(`  ... and ${errors.length - 5} more`);
  }

  return { score, weight: 0.2, notes };
}

// ============================================================================
// Tool Discovery
// ============================================================================

export function analyzeToolDiscovery(
  log: EvalConversationLog,
  scenario: EvalScenario
): DimensionScore {
  const calledTools = new Set(log.toolCalls.map((tc) => shortToolName(tc.toolName)));
  const expectedTools = new Set(scenario.expectedToolUsage);

  const discovered = [...expectedTools].filter((t) => calledTools.has(t));
  const missed = [...expectedTools].filter((t) => !calledTools.has(t));

  const score = expectedTools.size > 0
    ? Math.round((discovered.length / expectedTools.size) * 100)
    : 100;

  const notes: string[] = [];
  if (discovered.length > 0) {
    notes.push(`Used expected tools: ${discovered.join(", ")}`);
  }
  if (missed.length > 0) {
    notes.push(`Missed tools: ${missed.join(", ")}`);
  }

  const extraTools = [...calledTools].filter((t) => !expectedTools.has(t));
  if (extraTools.length > 0) {
    notes.push(`Additional tools used: ${extraTools.join(", ")}`);
  }

  return { score, weight: 0.15, notes };
}

// ============================================================================
// Information Gathering
// ============================================================================

export function analyzeInformationGathering(
  log: EvalConversationLog
): DimensionScore {
  const notes: string[] = [];

  // Find the turn where the agent first outputs code
  const firstCodeTurn = findFirstCodeGenerationTurn(log);

  // Count tool calls before code generation
  const toolCallsBeforeCode = log.toolCalls.filter(
    (tc) => firstCodeTurn === -1 || tc.turnIndex < firstCodeTurn
  );
  const totalToolCalls = log.toolCalls.length;

  // Check if agent gathered docs before coding (use short names for matching)
  const checkedDocs = toolCallsBeforeCode.some((tc) => {
    const name = shortToolName(tc.toolName);
    return name.includes("docs") || name.includes("guide") || name === "get_recipe";
  });
  const checkedTypes = toolCallsBeforeCode.some((tc) => {
    const name = shortToolName(tc.toolName);
    return name.includes("types") || name === "get_component_examples_ts";
  });
  const checkedExamples = toolCallsBeforeCode.some((tc) => {
    const name = shortToolName(tc.toolName);
    return name.includes("example") || name.includes("recipe");
  });
  const exploredFirst = toolCallsBeforeCode.some((tc) => {
    const name = shortToolName(tc.toolName);
    return name === "list_components" || name === "search_components" || name === "list_packages";
  });

  let score = 0;

  if (firstCodeTurn === -1) {
    // No code generated — can't fully assess but give partial credit for gathering
    score = totalToolCalls > 0 ? 50 : 0;
    notes.push("No code was generated to evaluate gathering order");
  } else {
    // Score based on what was gathered before coding
    if (exploredFirst) score += 25;
    if (checkedDocs) score += 30;
    if (checkedTypes) score += 25;
    if (checkedExamples) score += 20;

    if (toolCallsBeforeCode.length === 0) {
      notes.push("Agent generated code without consulting any MCP tools first");
      score = 0;
    } else {
      notes.push(
        `${toolCallsBeforeCode.length}/${totalToolCalls} tool calls before code generation`
      );
    }
  }

  if (checkedDocs) notes.push("Checked documentation before coding");
  if (checkedTypes) notes.push("Checked types before coding");
  if (checkedExamples) notes.push("Checked examples/recipes before coding");
  if (exploredFirst) notes.push("Explored available components/packages first");

  return { score: Math.min(score, 100), weight: 0.15, notes };
}

// ============================================================================
// Code Correctness
// ============================================================================

export function analyzeCodeCorrectness(
  log: EvalConversationLog,
  scenario: EvalScenario
): DimensionScore {
  const notes: string[] = [];
  const finalCode = getCodeContent(log);

  if (!finalCode) {
    return { score: 0, weight: 0.15, notes: ["No code generated"] };
  }

  let score = 100;
  let patternsMissed = 0;

  // Check expected patterns
  for (const pattern of scenario.expectedOutputPatterns) {
    if (!pattern.test(finalCode)) {
      patternsMissed++;
      notes.push(`Missing expected pattern: ${pattern.source}`);
    }
  }

  if (scenario.expectedOutputPatterns.length > 0) {
    const patternScore =
      ((scenario.expectedOutputPatterns.length - patternsMissed) /
        scenario.expectedOutputPatterns.length) *
      50;
    score = patternScore;
  }

  // Check for hallucinated imports
  const hallucinatedImports = detectHallucinatedImports(finalCode);
  if (hallucinatedImports.length > 0) {
    score -= hallucinatedImports.length * 15;
    for (const pkg of hallucinatedImports) {
      notes.push(`Hallucinated import: ${pkg}`);
    }
  }

  // Basic syntax checks
  const hasImports = /import\s+/.test(finalCode);
  const hasExport = /export\s+(default\s+)?/.test(finalCode);
  const hasJSX = /<\w+/.test(finalCode);

  if (hasImports) score += 15;
  if (hasExport) score += 10;
  if (hasJSX) score += 25;

  if (!hasImports) notes.push("No imports found in output");
  if (!hasJSX) notes.push("No JSX found in output");

  return { score: Math.max(0, Math.min(score, 100)), weight: 0.15, notes };
}

// ============================================================================
// Code Completeness
// ============================================================================

export function analyzeCodeCompleteness(
  log: EvalConversationLog,
  scenario: EvalScenario
): DimensionScore {
  const notes: string[] = [];
  const finalCode = getCodeContent(log);

  if (!finalCode) {
    return { score: 0, weight: 0.15, notes: ["No code generated"] };
  }

  // Count how many expected patterns are present
  let patternsFound = 0;
  for (const pattern of scenario.expectedOutputPatterns) {
    if (pattern.test(finalCode)) {
      patternsFound++;
    }
  }

  const total = scenario.expectedOutputPatterns.length;
  const score = total > 0 ? Math.round((patternsFound / total) * 100) : 50;

  notes.push(`${patternsFound}/${total} expected patterns found in output`);

  // Check if it's a complete component (has function/const + return + JSX)
  const isCompleteComponent =
    /(function|const)\s+\w+/.test(finalCode) &&
    /return\s*\(/.test(finalCode);

  if (!isCompleteComponent) {
    notes.push("Output may not be a complete React component");
  }

  return { score, weight: 0.15, notes };
}

// ============================================================================
// Efficiency
// ============================================================================

export function analyzeEfficiency(
  log: EvalConversationLog,
  scenario: EvalScenario
): DimensionScore {
  const notes: string[] = [];

  // Check for duplicate tool calls (same tool + same args)
  const callSignatures = log.toolCalls.map(
    (tc) => `${tc.toolName}:${JSON.stringify(tc.arguments)}`
  );
  const uniqueCalls = new Set(callSignatures);
  const duplicates = callSignatures.length - uniqueCalls.size;

  if (duplicates > 0) {
    notes.push(`${duplicates} duplicate tool call(s)`);
  }

  // Score based on turns used relative to max
  const turnRatio = log.totalTurns / scenario.maxTurns;
  let score: number;

  if (turnRatio <= 0.4) {
    score = 100;
    notes.push("Completed efficiently");
  } else if (turnRatio <= 0.6) {
    score = 85;
    notes.push("Reasonable number of turns");
  } else if (turnRatio <= 0.8) {
    score = 65;
    notes.push("Used many turns");
  } else {
    score = 40;
    notes.push("Used most or all available turns");
  }

  // Penalize duplicates
  score -= duplicates * 10;

  notes.push(
    `${log.totalTurns} turns, ${log.totalToolCalls} tool calls`
  );

  return { score: Math.max(0, score), weight: 0.1, notes };
}

// ============================================================================
// Error Handling
// ============================================================================

export function analyzeErrorHandling(
  log: EvalConversationLog
): DimensionScore {
  const notes: string[] = [];

  // Find tool calls that returned errors
  const errorResults = log.toolResults.filter((tr) => tr.response.isError);
  const totalResults = log.toolResults.length;

  if (errorResults.length === 0) {
    notes.push("No tool errors encountered");
    return { score: 100, weight: 0.1, notes };
  }

  notes.push(
    `${errorResults.length}/${totalResults} tool calls returned errors`
  );

  // Check if the agent recovered (made subsequent successful calls)
  let recoveredCount = 0;
  for (const errorResult of errorResults) {
    const errorTurn = errorResult.turnIndex;
    const subsequentSuccess = log.toolResults.some(
      (tr) => tr.turnIndex > errorTurn && !tr.response.isError
    );
    if (subsequentSuccess) {
      recoveredCount++;
    }
  }

  const recoveryRate =
    errorResults.length > 0
      ? recoveredCount / errorResults.length
      : 1;

  const score = Math.round(recoveryRate * 100);

  if (recoveredCount > 0) {
    notes.push(
      `Recovered from ${recoveredCount}/${errorResults.length} errors`
    );
  }

  if (recoveryRate === 0) {
    notes.push("Did not recover from tool errors");
  }

  return { score, weight: 0.1, notes };
}

// ============================================================================
// Issue Detection
// ============================================================================

export function detectIssues(
  log: EvalConversationLog,
  scenario: EvalScenario
): EvalIssue[] {
  const issues: EvalIssue[] = [];

  // Detect hallucinated imports (check written files, fall back to finalOutput)
  const codeContent = getCodeContent(log);
  if (codeContent) {
    const hallucinated = detectHallucinatedImports(codeContent);
    for (const pkg of hallucinated) {
      issues.push({
        severity: "critical",
        category: "hallucination",
        description: `Hallucinated import from non-existent package: ${pkg}`,
        evidence: `import ... from '${pkg}'`,
      });
    }
  }

  // Detect tool errors that might indicate MCP server issues
  for (const result of log.toolResults) {
    if (result.response.isError) {
      const errorText = result.response.content
        .map((c) => c.text)
        .join("\n");
      issues.push({
        severity: "major",
        category: "mcp_tool_failure",
        description: `Tool '${result.toolName}' returned an error`,
        turnIndex: result.turnIndex,
        toolName: result.toolName,
        evidence: errorText.slice(0, 300),
      });
    }
  }

  // Detect if agent coded without gathering info
  const firstCodeTurn = findFirstCodeGenerationTurn(log);
  const toolCallsBeforeCode = log.toolCalls.filter(
    (tc) => firstCodeTurn === -1 || tc.turnIndex < firstCodeTurn
  );

  if (firstCodeTurn !== -1 && toolCallsBeforeCode.length === 0) {
    issues.push({
      severity: "major",
      category: "confused_behavior",
      description:
        "Agent generated code without using any MCP tools to learn about the framework first",
      turnIndex: firstCodeTurn,
      evidence: "Code generated at turn " + firstCodeTurn + " with 0 prior tool calls",
    });
  }

  // Detect if agent hit max turns
  if (log.agentStoppedReason === "max_turns") {
    issues.push({
      severity: "minor",
      category: "inefficient_usage",
      description: `Agent hit the maximum turn limit (${scenario.maxTurns})`,
      evidence: `${log.totalTurns} turns used, ${log.totalToolCalls} tool calls made`,
    });
  }

  // Detect missing expected tools (normalize to short names for comparison)
  const calledToolsShort = new Set(log.toolCalls.map((tc) => shortToolName(tc.toolName)));
  for (const expected of scenario.expectedToolUsage) {
    if (!calledToolsShort.has(expected)) {
      issues.push({
        severity: "minor",
        category: "missing_info",
        description: `Expected tool '${expected}' was never called`,
        toolName: expected,
        evidence: `Tools actually used: ${[...calledToolsShort].join(", ")}`,
      });
    }
  }

  // Detect no output and no written files
  if (
    (!log.finalOutput || log.finalOutput.trim().length === 0) &&
    log.writtenFiles.length === 0
  ) {
    issues.push({
      severity: "critical",
      category: "incomplete_code",
      description: "Agent produced no final output code and wrote no files",
      evidence: `Agent stopped with reason: ${log.agentStoppedReason}`,
    });
  }

  // Detect typecheck failures
  if (log.typecheckResult && !log.typecheckResult.success) {
    issues.push({
      severity: log.typecheckResult.errorCount > 5 ? "critical" : "major",
      category: "typecheck_failure",
      description: `TypeScript compilation failed with ${log.typecheckResult.errorCount} error(s)`,
      evidence: log.typecheckResult.errors
        .map((e) => `${e.file}:${e.line} — ${e.code}: ${e.message}`)
        .join("\n")
        .slice(0, 500),
    });
  }

  return issues;
}

// ============================================================================
// Helpers
// ============================================================================

function findFirstCodeGenerationTurn(log: EvalConversationLog): number {
  // Check for Write tool calls (agent writing files = code generation)
  const writeCall = log.toolCalls.find(
    (tc) => tc.toolName === "Write"
  );
  if (writeCall) return writeCall.turnIndex;

  // Fall back to detecting code blocks or import statements in messages
  for (const msg of log.messages) {
    if (msg.role !== "assistant") continue;
    if (
      /```(tsx?|jsx?|javascript|typescript)/.test(msg.content) ||
      /^import\s+/m.test(msg.content)
    ) {
      return msg.turnIndex;
    }
  }
  return -1;
}

function detectHallucinatedImports(code: string): string[] {
  const importRegex =
    /import\s+.*?from\s+['"](@idealyst\/[^'"\/]+)['"]/g;
  const hallucinated: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(code)) !== null) {
    const pkg = match[1];
    if (!VALID_IDEALYST_PACKAGES.includes(pkg)) {
      hallucinated.push(pkg);
    }
  }

  return [...new Set(hallucinated)];
}
