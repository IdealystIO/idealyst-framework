/**
 * Agent Loop
 *
 * Spawns the `claude` CLI in print mode with streaming JSON output.
 * Claude Code handles the MCP tool dispatch internally — we just
 * capture and parse the stream to build our evaluation log.
 *
 * Stream format: newline-delimited JSON with top-level message types:
 *   {type: "system", subtype: "init", ...}        — session init
 *   {type: "assistant", message: {content: [...]}} — assistant turns
 *   {type: "user", message: {content: [...]}}      — tool results
 *   {type: "result", subtype: "success"|"error"}   — final output
 */

import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { collectWrittenFiles } from "./workspace.js";
import { collectProjectFiles } from "./project-workspace.js";
import type {
  EvalScenario,
  EvalConversationLog,
  ToolCall,
  ToolResult,
} from "./types.js";
import type { ScenarioLogger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Default per-scenario wall-clock timeout (15 minutes) */
const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;

/** Progress update emitted during agent execution */
export interface AgentProgress {
  scenarioId: string;
  turns: number;
  maxTurns: number;
  toolCalls: number;
  messages: number;
  lastToolCall: string | null;
  elapsedMs: number;
  status: "running" | "completed" | "error" | "timeout";
}

export interface AgentOptions {
  model: string;
  maxTurns: number;
  verbose?: boolean;
  /** Wall-clock timeout in ms (default: 5 min). Kills the child process on expiry. */
  timeoutMs?: number;
  /** Called on each new tool call or message */
  onProgress?: (progress: AgentProgress) => void;
  /** Absolute path to the eval workspace where the agent should write files */
  workspacePath?: string;
  /** Per-scenario file logger (replaces console.log for parallel execution) */
  logger?: ScenarioLogger;
}

/** MCP documentation tools — always available to the agent */
const MCP_TOOLS = [
  "mcp__idealyst__list_components",
  "mcp__idealyst__get_component_docs",
  "mcp__idealyst__get_component_example",
  "mcp__idealyst__search_components",
  "mcp__idealyst__get_component_types",
  "mcp__idealyst__get_component_examples_ts",
  "mcp__idealyst__get_cli_usage",
  "mcp__idealyst__search_icons",
  "mcp__idealyst__get_theme_types",
  "mcp__idealyst__get_navigation_types",
  "mcp__idealyst__get_translate_guide",
  "mcp__idealyst__get_storage_guide",
  "mcp__idealyst__list_packages",
  "mcp__idealyst__get_package_docs",
  "mcp__idealyst__search_packages",
  "mcp__idealyst__list_recipes",
  "mcp__idealyst__get_recipe",
  "mcp__idealyst__search_recipes",
  "mcp__idealyst__get_install_guide",
  "mcp__idealyst__get_intro",
  // Dedicated package guide tools
  "mcp__idealyst__get_audio_guide",
  "mcp__idealyst__get_camera_guide",
  "mcp__idealyst__get_files_guide",
  "mcp__idealyst__get_oauth_client_guide",
  "mcp__idealyst__get_animate_guide",
  "mcp__idealyst__get_datagrid_guide",
  "mcp__idealyst__get_datepicker_guide",
  "mcp__idealyst__get_lottie_guide",
  "mcp__idealyst__get_markdown_guide",
  "mcp__idealyst__get_config_guide",
  "mcp__idealyst__get_charts_guide",
];

/**
 * Build the allowed tools list for a scenario.
 * Component scenarios get MCP + Write.
 * Project scenarios can also get Bash, Read, Glob.
 */
function getAllowedTools(scenario: EvalScenario): string[] {
  const tools = [...MCP_TOOLS, "Write", "Edit", "Read"];

  if (scenario.type === "project" && scenario.additionalAllowedTools) {
    tools.push(...scenario.additionalAllowedTools);
  }

  return tools;
}

/** Strip the mcp__idealyst__ prefix for display */
function shortToolName(name: string): string {
  return name.replace(/^mcp__idealyst__/, "");
}

export async function runAgentLoop(
  scenario: EvalScenario,
  options: AgentOptions
): Promise<EvalConversationLog> {
  const log: EvalConversationLog = {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    startTime: new Date().toISOString(),
    endTime: "",
    totalDurationMs: 0,
    totalTurns: 0,
    totalToolCalls: 0,
    model: options.model,
    messages: [],
    toolCalls: [],
    toolResults: [],
    finalOutput: null,
    agentStoppedReason: "completed",
    workspacePath: options.workspacePath || null,
    writtenFiles: [],
    typecheckResult: null,
  };

  const startTime = Date.now();
  let lastToolCall: string | null = null;

  function emitProgress(status: AgentProgress["status"] = "running") {
    options.onProgress?.({
      scenarioId: scenario.id,
      turns: log.totalTurns,
      maxTurns: options.maxTurns,
      toolCalls: log.totalToolCalls,
      messages: log.messages.length,
      lastToolCall,
      elapsedMs: Date.now() - startTime,
      status,
    });
  }

  // Build the claude CLI command
  // CWD = repo root where .mcp.json lives
  const cwd = path.resolve(__dirname, "../../../..");

  // Build the system prompt — inject workspace path
  let systemPrompt = scenario.systemPrompt;

  // Prepend a brief intro nudge — agents should call get_intro early but not block on full research
  const taskPrompt = `You are building with the Idealyst component framework. Call get_intro first to learn the conventions and common mistakes, then start building. Look up specific component/package APIs as you need them.\n\n${scenario.taskPrompt}`;

  if (options.workspacePath) {
    const srcDir = path.join(options.workspacePath, "src");
    systemPrompt += `\n\nIMPORTANT — FILE OUTPUT:
Write your component code as real files using the Write tool.
Write all files to: ${srcDir}/
For example, to create a LoginScreen component, write to: ${srcDir}/LoginScreen.tsx
Do NOT just output code as text in your response — write it as files using the Write tool.
You may create multiple files if the task requires it.
For complex apps with multiple screens, write EACH screen as a separate file using the Write tool. Do NOT try to generate all code in one giant response — break it up into manageable files and write them one at a time.`;
  }

  const args = [
    "-p",
    taskPrompt,
    "--output-format",
    "stream-json",
    "--model",
    options.model,
    "--max-turns",
    String(options.maxTurns),
    "--verbose",
    "--no-session-persistence",
    "--append-system-prompt",
    systemPrompt,
    // --allowedTools takes space-separated tool names
    "--allowedTools",
    ...getAllowedTools(scenario),
  ];

  const logger = options.logger;
  logger?.log(
    `Spawning: claude -p "<task>" --output-format stream-json --model ${options.model} --max-turns ${options.maxTurns}`
  );

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return new Promise<EvalConversationLog>((resolve, reject) => {
    const child = spawn("claude", args, {
      cwd,
      stdio: ["inherit", "pipe", "pipe"],
      env: { ...process.env, CLAUDECODE: undefined, CLAUDE_CODE_MAX_OUTPUT_TOKENS: "40000" },
    });

    // Wall-clock timeout — kill the child if the scenario takes too long
    const timer = setTimeout(() => {
      logger?.log(`[Timeout] Killing agent after ${timeoutMs / 1000}s`);
      log.agentStoppedReason = "timeout";
      emitProgress("timeout");
      child.kill("SIGTERM");
      // Force kill if still alive after 5s
      setTimeout(() => child.kill("SIGKILL"), 5000);
    }, timeoutMs);

    let stderrOutput = "";
    let buffer = "";

    child.stdout.on("data", (chunk: Buffer) => {
      buffer += chunk.toString();

      // Process complete lines (newline-delimited JSON)
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete last line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(trimmed);
        } catch {
          continue;
        }

        processMessage(parsed, log, logger, startTime, (toolName) => {
          lastToolCall = toolName;
          emitProgress();
        });
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderrOutput += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      log.agentStoppedReason = "error";
      log.endTime = new Date().toISOString();
      log.totalDurationMs = Date.now() - startTime;
      emitProgress("error");

      if (error.message.includes("ENOENT")) {
        reject(
          new Error(
            "Claude CLI not found. Make sure `claude` is installed and in your PATH."
          )
        );
      } else {
        reject(error);
      }
    });

    child.on("close", (code) => {
      clearTimeout(timer);

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer.trim());
          processMessage(parsed, log, logger, startTime, (toolName) => {
            lastToolCall = toolName;
          });
        } catch {
          // ignore
        }
      }

      // Use the last assistant text as final output if result wasn't captured
      if (!log.finalOutput && log.messages.length > 0) {
        const lastAssistant = [...log.messages]
          .reverse()
          .find((m) => m.role === "assistant");
        log.finalOutput = lastAssistant?.content || null;
      }

      log.endTime = new Date().toISOString();
      log.totalDurationMs = Date.now() - startTime;

      // Collect files the agent wrote to the workspace
      if (options.workspacePath) {
        // For component scenarios, check src/ dir; for project scenarios, scan entire project
        const srcDir = path.join(options.workspacePath, "src");
        const hasSrcDir = fs.existsSync(srcDir);
        log.writtenFiles = hasSrcDir
          ? collectWrittenFiles(srcDir)
          : collectProjectFiles(options.workspacePath);
        if (log.writtenFiles.length > 0) {
          logger?.log(`[Files] ${log.writtenFiles.join(", ")}`);
        }
      }

      if (code !== 0 && log.agentStoppedReason === "completed") {
        log.agentStoppedReason = "error";
        if (stderrOutput) {
          logger?.error(`stderr: ${stderrOutput.slice(0, 500)}`);
        }
      }

      emitProgress(
        log.agentStoppedReason === "completed" ? "completed" : log.agentStoppedReason as AgentProgress["status"]
      );
      resolve(log);
    });
  });
}

/**
 * Process a single top-level message from claude CLI --output-format stream-json.
 *
 * The CLI emits complete messages (not streaming deltas):
 *   {type: "system",    subtype: "init", ...}
 *   {type: "assistant", message: {content: [{type: "text"|"tool_use", ...}]}}
 *   {type: "user",      message: {content: [{type: "tool_result", ...}]}}
 *   {type: "result",    subtype: "success"|"error", result: "...", ...}
 */
function processMessage(
  parsed: Record<string, unknown>,
  log: EvalConversationLog,
  logger: ScenarioLogger | undefined,
  startTime: number,
  onToolCall: (shortName: string) => void
): void {
  const topType = parsed.type as string;

  // ── Result (final) ──────────────────────────────────────────────────
  if (topType === "result") {
    if (typeof parsed.result === "string") {
      log.finalOutput = parsed.result;
    }
    if (parsed.is_error || parsed.subtype === "error") {
      log.agentStoppedReason = "error";
    } else {
      log.agentStoppedReason = "completed";
    }

    // The result message often includes num_turns
    if (typeof parsed.num_turns === "number") {
      log.totalTurns = parsed.num_turns;
    }
    return;
  }

  // ── System init ─────────────────────────────────────────────────────
  if (topType === "system") {
    // Nothing to extract for the log, but could capture model/tools info
    return;
  }

  // ── Assistant message ───────────────────────────────────────────────
  if (topType === "assistant") {
    const message = parsed.message as Record<string, unknown> | undefined;
    if (!message) return;

    const content = message.content as Array<Record<string, unknown>> | undefined;
    if (!content) return;

    log.totalTurns++;

    for (const block of content) {
      const blockType = block.type as string;

      if (blockType === "text") {
        const text = (block.text as string) || "";
        if (text) {
          log.messages.push({
            role: "assistant",
            content: text,
            timestamp: new Date().toISOString(),
            turnIndex: log.totalTurns,
          });

          const preview =
            text.length > 200 ? text.slice(0, 200) + "..." : text;
          logger?.log(`[Turn ${log.totalTurns}] ${preview}`);
        }
      } else if (blockType === "tool_use") {
        const toolName = (block.name as string) || "";
        const toolId = (block.id as string) || `tc-${Date.now()}`;
        const args = (block.input as Record<string, unknown>) || {};

        const toolCall: ToolCall = {
          id: toolId,
          toolName,
          arguments: args,
          timestamp: new Date().toISOString(),
          turnIndex: log.totalTurns,
        };
        log.toolCalls.push(toolCall);
        log.totalToolCalls++;

        const short = shortToolName(toolName);
        onToolCall(short);

        logger?.log(
          `[Tool] ${short}(${JSON.stringify(args).slice(0, 100)})`
        );
      }
    }
    return;
  }

  // ── User message (tool results) ────────────────────────────────────
  if (topType === "user") {
    const message = parsed.message as Record<string, unknown> | undefined;
    if (!message) return;

    const content = message.content as Array<Record<string, unknown>> | undefined;
    if (!content) return;

    for (const block of content) {
      const blockType = block.type as string;

      if (blockType === "tool_result") {
        const toolCallId = (block.tool_use_id as string) || "";
        const isError = block.is_error === true;

        // Find the matching tool call to get the name
        const matchingCall = log.toolCalls.find((tc) => tc.id === toolCallId);
        const toolName = matchingCall?.toolName || "unknown";

        // Extract response text
        let responseText = "";
        if (typeof block.content === "string") {
          responseText = block.content;
        } else if (Array.isArray(block.content)) {
          responseText = (block.content as Array<Record<string, unknown>>)
            .filter((c) => c.type === "text")
            .map((c) => c.text as string)
            .join("\n");
        }

        const toolResult: ToolResult = {
          toolCallId,
          toolName,
          response: {
            content: [{ type: "text", text: responseText }],
            isError,
          },
          durationMs: 0, // Can't measure from stream
          timestamp: new Date().toISOString(),
          turnIndex: log.totalTurns,
        };
        log.toolResults.push(toolResult);
      }
    }
    return;
  }
}
