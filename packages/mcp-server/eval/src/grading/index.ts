/**
 * Grading Orchestrator
 *
 * Combines all analyzers to produce a final grade for a conversation.
 */

import type {
  EvalConversationLog,
  EvalScenario,
  GradingResult,
  GradingDimension,
  DimensionScore,
} from "../types.js";
import { RUBRIC } from "./rubric.js";
import {
  analyzeToolDiscovery,
  analyzeInformationGathering,
  analyzeCodeCorrectness,
  analyzeTypecheckPasses,
  analyzeCodeCompleteness,
  analyzeEfficiency,
  analyzeErrorHandling,
  detectIssues,
} from "./analyzers.js";

const ANALYZER_MAP: Record<
  GradingDimension,
  (log: EvalConversationLog, scenario: EvalScenario) => DimensionScore
> = {
  toolDiscovery: analyzeToolDiscovery,
  informationGathering: (log) => analyzeInformationGathering(log),
  codeCorrectness: analyzeCodeCorrectness,
  typecheckPasses: analyzeTypecheckPasses,
  codeCompleteness: analyzeCodeCompleteness,
  efficiency: analyzeEfficiency,
  errorHandling: (log) => analyzeErrorHandling(log),
};

export function gradeConversation(
  log: EvalConversationLog,
  scenario: EvalScenario
): GradingResult {
  // Run each analyzer
  const dimensions = {} as Record<GradingDimension, DimensionScore>;

  for (const rubricDim of RUBRIC) {
    const analyzer = ANALYZER_MAP[rubricDim.key];
    dimensions[rubricDim.key] = analyzer(log, scenario);
  }

  // Compute weighted overall score
  let overallScore = 0;
  for (const rubricDim of RUBRIC) {
    const dim = dimensions[rubricDim.key];
    overallScore += dim.score * rubricDim.weight;
  }
  overallScore = Math.round(overallScore);

  // Detect issues
  const issues = detectIssues(log, scenario);

  // Generate summary
  const summary = generateSummary(log, scenario, dimensions, overallScore, issues);

  return {
    scenarioId: scenario.id,
    overallScore,
    dimensions,
    issues,
    summary,
  };
}

function generateSummary(
  log: EvalConversationLog,
  scenario: EvalScenario,
  dimensions: Record<GradingDimension, DimensionScore>,
  overallScore: number,
  issues: ReturnType<typeof detectIssues>
): string {
  const lines: string[] = [];

  lines.push(`## ${scenario.name} — Score: ${overallScore}/100`);
  lines.push("");

  // Dimension breakdown
  for (const rubricDim of RUBRIC) {
    const dim = dimensions[rubricDim.key];
    const bar = scoreBar(dim.score);
    lines.push(`- **${rubricDim.name}**: ${dim.score}/100 ${bar}`);
    for (const note of dim.notes) {
      lines.push(`  - ${note}`);
    }
  }

  // Stats
  lines.push("");
  lines.push(`**Turns:** ${log.totalTurns}/${scenario.maxTurns}`);
  lines.push(`**Tool calls:** ${log.totalToolCalls}`);
  lines.push(`**Duration:** ${(log.totalDurationMs / 1000).toFixed(1)}s`);
  lines.push(`**Stop reason:** ${log.agentStoppedReason}`);

  // Issues
  if (issues.length > 0) {
    lines.push("");
    lines.push("### Issues");
    const critical = issues.filter((i) => i.severity === "critical");
    const major = issues.filter((i) => i.severity === "major");
    const minor = issues.filter((i) => i.severity === "minor");

    if (critical.length > 0) {
      lines.push(`- **Critical (${critical.length}):**`);
      for (const issue of critical) {
        lines.push(`  - [${issue.category}] ${issue.description}`);
      }
    }
    if (major.length > 0) {
      lines.push(`- **Major (${major.length}):**`);
      for (const issue of major) {
        lines.push(`  - [${issue.category}] ${issue.description}`);
      }
    }
    if (minor.length > 0) {
      lines.push(`- **Minor (${minor.length}):**`);
      for (const issue of minor) {
        lines.push(`  - [${issue.category}] ${issue.description}`);
      }
    }
  }

  return lines.join("\n");
}

function scoreBar(score: number): string {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  return "[" + "#".repeat(filled) + "-".repeat(empty) + "]";
}
