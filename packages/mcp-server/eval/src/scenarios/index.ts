/**
 * Scenario Registry
 *
 * All evaluation scenarios in one place for easy selection.
 * Adding a new scenario = create a file, import it here, add to the record.
 */

import type { EvalScenario, ScenarioType } from "../types.js";
import { loginScreenScenario } from "./login-screen.js";
import { settingsPageScenario } from "./settings-page.js";
import { navigationScenario } from "./navigation.js";
import { formExplorerScenario } from "./form-explorer.js";
import { multiPackageScenario } from "./multi-package.js";
import { errorRecoveryScenario } from "./error-recovery.js";
import { projectScaffoldScenario } from "./project-scaffold.js";
import { apiBackendScenario } from "./api-backend.js";
import { noContextAudioScenario } from "./no-context-audio.js";

export const scenarios: Record<string, EvalScenario> = {
  // Component scenarios (symlinked workspace)
  "login-screen": loginScreenScenario,
  "settings-page": settingsPageScenario,
  navigation: navigationScenario,
  "form-explorer": formExplorerScenario,
  "multi-package": multiPackageScenario,
  "error-recovery": errorRecoveryScenario,
  "no-context-audio": noContextAudioScenario,

  // Project scenarios (idealyst-cli scaffolded)
  "project-scaffold": projectScaffoldScenario,
  "api-backend": apiBackendScenario,
};

export const scenarioList: EvalScenario[] = Object.values(scenarios);

export function getScenariosByTag(tag: string): EvalScenario[] {
  return scenarioList.filter((s) => s.tags.includes(tag));
}

export function getScenariosByDifficulty(
  difficulty: EvalScenario["difficulty"]
): EvalScenario[] {
  return scenarioList.filter((s) => s.difficulty === difficulty);
}

export function getScenariosByType(type: ScenarioType): EvalScenario[] {
  return scenarioList.filter((s) => s.type === type);
}
