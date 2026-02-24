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
import { dataDisplayScenario } from "./data-display.js";
import { overlayComponentsScenario } from "./overlay-components.js";
import { themeStylingScenario } from "./theme-styling.js";
import { mediaCameraScenario } from "./media-camera.js";
import { fileUploadScenario } from "./file-upload.js";
import { recipeDiscoveryScenario } from "./recipe-discovery.js";
import { animateTransitionsScenario } from "./animate-transitions.js";
import { datagridAnalyticsScenario } from "./datagrid-analytics.js";
import { datepickerBookingScenario } from "./datepicker-booking.js";
import { oauthConfigLoginScenario } from "./oauth-config-login.js";
import { chartsDashboardScenario } from "./charts-dashboard.js";
import { markdownContentScenario } from "./markdown-content.js";
import { fullAppNoContextScenario } from "./full-app-no-context.js";
import { guideToolDiscoveryScenario } from "./guide-tool-discovery.js";
import { webLayoutSidebarScenario } from "./web-layout-sidebar.js";
import { webLayoutTabsScenario } from "./web-layout-tabs.js";
import { webLayoutResponsiveScenario } from "./web-layout-responsive.js";
import { playwrightSidebarScenario } from "./playwright-sidebar.js";

export const scenarios: Record<string, EvalScenario> = {
  // Component scenarios (symlinked workspace)
  "login-screen": loginScreenScenario,
  "settings-page": settingsPageScenario,
  navigation: navigationScenario,
  "form-explorer": formExplorerScenario,
  "multi-package": multiPackageScenario,
  "error-recovery": errorRecoveryScenario,
  "no-context-audio": noContextAudioScenario,
  "data-display": dataDisplayScenario,
  "overlay-components": overlayComponentsScenario,
  "theme-styling": themeStylingScenario,
  "media-camera": mediaCameraScenario,
  "file-upload": fileUploadScenario,
  "recipe-discovery": recipeDiscoveryScenario,
  "animate-transitions": animateTransitionsScenario,
  "datagrid-analytics": datagridAnalyticsScenario,
  "datepicker-booking": datepickerBookingScenario,
  "oauth-config-login": oauthConfigLoginScenario,
  "charts-dashboard": chartsDashboardScenario,
  "markdown-content": markdownContentScenario,
  "full-app-no-context": fullAppNoContextScenario,
  "guide-tool-discovery": guideToolDiscoveryScenario,

  // Web layout scenarios
  "web-layout-sidebar": webLayoutSidebarScenario,
  "web-layout-tabs": webLayoutTabsScenario,
  "web-layout-responsive": webLayoutResponsiveScenario,

  // Project scenarios (idealyst-cli scaffolded)
  "project-scaffold": projectScaffoldScenario,
  "api-backend": apiBackendScenario,

  // Playwright-verified scenarios (golden project + runtime verification)
  "playwright-sidebar": playwrightSidebarScenario,
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
