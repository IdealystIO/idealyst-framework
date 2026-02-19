/**
 * Scenario Logger
 *
 * Writes verbose eval output to per-scenario log files so that
 * scenarios can run in parallel without interleaving console output.
 * Each scenario gets its own file: eval/output/logs/<runId>/<scenarioId>.log
 */

import fs from "fs";
import path from "path";

export class ScenarioLogger {
  private stream: fs.WriteStream;
  readonly logPath: string;

  constructor(outputDir: string, runId: string, scenarioId: string) {
    const logDir = path.join(outputDir, "logs", runId);
    fs.mkdirSync(logDir, { recursive: true });
    this.logPath = path.join(logDir, `${scenarioId}.log`);
    this.stream = fs.createWriteStream(this.logPath, { flags: "w" });
  }

  log(msg: string): void {
    this.stream.write(msg + "\n");
  }

  warn(msg: string): void {
    this.stream.write(`[WARN] ${msg}\n`);
  }

  error(msg: string): void {
    this.stream.write(`[ERROR] ${msg}\n`);
  }

  close(): void {
    this.stream.end();
  }
}
