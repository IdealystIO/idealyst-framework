/**
 * Evaluation Agent Types
 *
 * Type definitions for the MCP server evaluation harness.
 */

// ============================================================================
// Scenario Definition
// ============================================================================

export type ScenarioType = "component" | "project";

/** Shell command to run during project scaffolding */
export interface ScaffoldCommand {
  /** The shell command to run (e.g., "idealyst init my-app ...") */
  command: string;
  /** Working directory (absolute, or relative to temp dir) */
  cwd?: string;
  /** Timeout in ms (default: 60_000) */
  timeoutMs?: number;
}

interface BaseScenarioFields {
  /** Unique identifier for the scenario */
  id: string;
  /** Human-readable name */
  name: string;
  /** What this scenario tests */
  description: string;
  /** System prompt given to the agent */
  systemPrompt: string;
  /** The task the agent must complete */
  taskPrompt: string;
  /** MCP tools we expect the agent to call */
  expectedToolUsage: string[];
  /** Regex patterns we expect in the written files (or finalOutput as fallback) */
  expectedOutputPatterns: RegExp[];
  /**
   * Files the agent should create.
   * Keys are relative paths, values describe the file.
   */
  expectedFiles: Record<string, string>;
  /** Maximum agent loop iterations */
  maxTurns: number;
  /** Scenario difficulty */
  difficulty: "basic" | "intermediate" | "advanced";
  /** Tags for filtering */
  tags: string[];
}

export interface ComponentScenario extends BaseScenarioFields {
  type: "component";
}

export interface ProjectScenario extends BaseScenarioFields {
  type: "project";
  /** CLI commands to scaffold the project before the agent runs */
  scaffoldCommands: ScaffoldCommand[];
  /** Working directory for the agent (relative to scaffolded project root) */
  agentWorkingDir?: string;
  /** Additional tools the agent is allowed beyond the standard MCP set */
  additionalAllowedTools?: string[];
}

export type EvalScenario = ComponentScenario | ProjectScenario;

// ============================================================================
// Conversation Logging
// ============================================================================

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  turnIndex: number;
}

export interface ToolCall {
  id: string;
  toolName: string;
  arguments: Record<string, unknown>;
  timestamp: string;
  turnIndex: number;
}

export interface ToolResult {
  toolCallId: string;
  toolName: string;
  response: {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  };
  durationMs: number;
  timestamp: string;
  turnIndex: number;
}

export type StopReason =
  | "completed"
  | "max_turns"
  | "error"
  | "timeout"
  | "no_tool_calls";

export interface EvalConversationLog {
  scenarioId: string;
  scenarioName: string;
  startTime: string;
  endTime: string;
  totalDurationMs: number;
  totalTurns: number;
  totalToolCalls: number;
  model: string;
  messages: ConversationMessage[];
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
  finalOutput: string | null;
  agentStoppedReason: StopReason;
  /** Absolute path to the eval workspace directory */
  workspacePath: string | null;
  /** Files the agent created (relative to workspace src/) */
  writtenFiles: string[];
  /** TypeScript compilation result */
  typecheckResult: TypecheckResult | null;
}

// ============================================================================
// TypeScript Validation
// ============================================================================

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

// ============================================================================
// Grading (Heuristic)
// ============================================================================

export type IssueSeverity = "critical" | "major" | "minor" | "info";

export type IssueCategory =
  | "mcp_tool_failure"
  | "incorrect_info"
  | "missing_info"
  | "confused_behavior"
  | "inefficient_usage"
  | "hallucination"
  | "incomplete_code"
  | "wrong_api_usage"
  | "typecheck_failure";

export interface EvalIssue {
  severity: IssueSeverity;
  category: IssueCategory;
  description: string;
  turnIndex?: number;
  toolName?: string;
  evidence: string;
}

export interface DimensionScore {
  score: number;
  weight: number;
  notes: string[];
}

export type GradingDimension =
  | "toolDiscovery"
  | "informationGathering"
  | "codeCorrectness"
  | "codeCompleteness"
  | "typecheckPasses"
  | "efficiency"
  | "errorHandling";

export interface GradingResult {
  scenarioId: string;
  overallScore: number;
  dimensions: Record<GradingDimension, DimensionScore>;
  issues: EvalIssue[];
  summary: string;
}

// ============================================================================
// Supervisor Evaluation
// ============================================================================

export interface SupervisorCriterionResult {
  criterionId: string;
  label: string;
  /** Score 0-100 */
  score: number;
  /** Severity assessment */
  severity: "pass" | "minor_fail" | "medium_fail" | "huge_fail";
  /** Free-form reasoning from the supervisor */
  reasoning: string;
  /** Specific evidence citations from the conversation */
  evidence: string[];
}

export interface FrameworkIssue {
  /** Deterministic ID for deduplication across runs */
  issueId: string;
  /** Where the problem lies */
  source: "mcp_server" | "cli" | "framework" | "documentation";
  /** Severity */
  severity: "critical" | "major" | "minor";
  /** Description of the gap or issue */
  description: string;
  /** Which scenario surfaced this */
  scenarioId: string;
  /** Suggested fix */
  suggestedFix: string;
}

export interface SupervisorEvaluation {
  scenarioId: string;
  /** ISO timestamp */
  evaluatedAt: string;
  /** Duration of supervisor invocation in ms */
  durationMs: number;
  /** Per-criterion results */
  criteria: SupervisorCriterionResult[];
  /** Weighted overall qualitative score (0-100) */
  qualitativeScore: number;
  /** Free-form summary from the supervisor */
  summary: string;
  /** Framework/MCP/CLI issues identified */
  frameworkIssues: FrameworkIssue[];
  /** Raw supervisor response for debugging */
  rawResponse: string;
}

// ============================================================================
// Report
// ============================================================================

export interface ToolUsageStat {
  callCount: number;
  errorCount: number;
  avgResponseTimeMs: number;
}

export interface ScenarioResult {
  log: EvalConversationLog;
  grade: GradingResult;
  /** Supervisor qualitative evaluation (null if not run or skipped) */
  supervisorEval: SupervisorEvaluation | null;
}

export interface EvalReport {
  runId: string;
  timestamp: string;
  model: string;
  mcpServerVersion: string;
  scenarios: ScenarioResult[];
  aggregateScores: Record<string, number>;
  toolUsageStats: Record<string, ToolUsageStat>;
  /** Aggregated supervisor scores per criterion */
  supervisorAggregateScores: Record<string, number> | null;
  /** All framework issues found across scenarios */
  allFrameworkIssues: FrameworkIssue[];
}

// ============================================================================
// Database Row Types
// ============================================================================

export interface DbEvalRun {
  id: string;
  timestamp: string;
  model: string;
  mcpServerVersion: string;
  overallHeuristicMean: number;
  overallSupervisorMean: number | null;
  scenarioCount: number;
}

export interface DbScenarioResult {
  id: number;
  runId: string;
  scenarioId: string;
  scenarioType: ScenarioType;
  heuristicScore: number;
  supervisorScore: number | null;
  typecheckPass: boolean;
  typecheckErrorCount: number;
  turnCount: number;
  toolCallCount: number;
  durationMs: number;
  stopReason: string;
}

export interface DbFrameworkIssue {
  id: number;
  issueId: string;
  source: string;
  severity: string;
  description: string;
  suggestedFix: string;
  firstSeenRunId: string;
  firstSeenAt: string;
  lastSeenRunId: string;
  lastSeenAt: string;
  occurrenceCount: number;
  resolved: boolean;
}

// ============================================================================
// Runner Options
// ============================================================================

export interface RunOptions {
  model: string;
  scenarios: string[];
  maxTokens: number;
  outputDir: string;
  verbose: boolean;
  /** Skip supervisor evaluation */
  skipSupervisor: boolean;
  /** Model to use for supervisor (defaults to same as task model) */
  supervisorModel: string;
  /** SQLite database path */
  dbPath: string;
  /** Show comparison with previous run */
  compare: boolean;
  /** Filter scenarios by type */
  scenarioType: ScenarioType | "all";
  /** Max concurrent scenarios (default: 5) */
  concurrency: number;
}
