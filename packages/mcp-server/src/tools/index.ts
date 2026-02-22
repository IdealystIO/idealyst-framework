/**
 * @idealyst/mcp-server/tools
 *
 * Exported tools for use outside the MCP server.
 * Use these to integrate Idealyst documentation tools into your own systems.
 *
 * @example
 * ```ts
 * // Import tool definitions for registration
 * import { toolDefinitions, toolDefinitionMap } from '@idealyst/mcp-server/tools';
 *
 * // Import individual handlers for direct use
 * import {
 *   listComponents,
 *   getComponentDocs,
 *   searchIcons,
 * } from '@idealyst/mcp-server/tools';
 *
 * // Import types
 * import type { ToolDefinition, ToolResponse } from '@idealyst/mcp-server/tools';
 *
 * // Use the callTool function for dynamic dispatch
 * import { callTool } from '@idealyst/mcp-server/tools';
 * const result = callTool('list_components', {});
 * ```
 */

// Re-export all types
export type {
  ToolInputSchema,
  PropertySchema,
  ToolDefinition,
  ToolContent,
  ToolResponse,
  ToolHandler,
  ToolName,
  ToolArgs,
  // Component tool types
  ListComponentsArgs,
  GetComponentDocsArgs,
  GetComponentExampleArgs,
  SearchComponentsArgs,
  GetComponentTypesArgs,
  GetComponentExamplesTsArgs,
  // CLI tool types
  GetCliUsageArgs,
  // Icon tool types
  SearchIconsArgs,
  // Theme tool types
  GetThemeTypesArgs,
  // Navigation tool types
  GetNavigationTypesArgs,
  // Guide tool types
  GetTranslateGuideArgs,
  GetStorageGuideArgs,
  GetAudioGuideArgs,
  GetCameraGuideArgs,
  GetFilesGuideArgs,
  GetOauthClientGuideArgs,
  GetAnimateGuideArgs,
  GetDatagridGuideArgs,
  GetDatepickerGuideArgs,
  GetLottieGuideArgs,
  GetMarkdownGuideArgs,
  GetConfigGuideArgs,
  GetChartsGuideArgs,
  GetClipboardGuideArgs,
  GetBiometricsGuideArgs,
  GetPaymentsGuideArgs,
  // Package tool types
  ListPackagesArgs,
  GetPackageDocsArgs,
  SearchPackagesArgs,
  // Recipe tool types
  ListRecipesArgs,
  GetRecipeArgs,
  SearchRecipesArgs,
  // Install guide tool types
  GetInstallGuideArgs,
  // Intro tool types
  GetIntroArgs,
} from "./types.js";

// Re-export all definitions
export {
  // Individual definitions
  listComponentsDefinition,
  getComponentDocsDefinition,
  getComponentExampleDefinition,
  searchComponentsDefinition,
  getComponentTypesDefinition,
  getComponentExamplesTsDefinition,
  getCliUsageDefinition,
  searchIconsDefinition,
  getThemeTypesDefinition,
  getNavigationTypesDefinition,
  getTranslateGuideDefinition,
  getStorageGuideDefinition,
  getAudioGuideDefinition,
  getCameraGuideDefinition,
  getFilesGuideDefinition,
  getOauthClientGuideDefinition,
  getAnimateGuideDefinition,
  getDatagridGuideDefinition,
  getDatepickerGuideDefinition,
  getLottieGuideDefinition,
  getMarkdownGuideDefinition,
  getConfigGuideDefinition,
  getChartsGuideDefinition,
  getClipboardGuideDefinition,
  getBiometricsGuideDefinition,
  getPaymentsGuideDefinition,
  listPackagesDefinition,
  getPackageDocsDefinition,
  searchPackagesDefinition,
  listRecipesDefinition,
  getRecipeDefinition,
  searchRecipesDefinition,
  // Install guide definitions
  getInstallGuideDefinition,
  // Intro definitions
  getIntroDefinition,
  // Collections
  toolDefinitions,
  toolDefinitionMap,
} from "./definitions.js";

// Re-export all handlers
export {
  // Individual handlers
  listComponents,
  getComponentDocs,
  getComponentExample,
  searchComponents,
  getComponentTypes,
  getComponentExamplesTs,
  getCliUsage,
  searchIcons,
  getThemeTypes,
  getNavigationTypes,
  getTranslateGuide,
  getStorageGuide,
  getAudioGuide,
  getCameraGuide,
  getFilesGuide,
  getOauthClientGuide,
  getAnimateGuide,
  getDatagridGuide,
  getDatepickerGuide,
  getLottieGuide,
  getMarkdownGuide,
  getConfigGuide,
  getChartsGuide,
  getClipboardGuide,
  getBiometricsGuide,
  getPaymentsGuide,
  listPackages,
  getPackageDocs,
  searchPackages,
  listRecipes,
  getRecipe,
  searchRecipes,
  // Install guide handlers
  getInstallGuide,
  // Intro handlers
  getIntro,
  // Handler registry and dispatcher
  toolHandlers,
  callTool,
} from "./handlers.js";

// Re-export type utilities from get-types
export {
  getAvailableComponents,
  getComponentRegistry,
  getRegistryThemeValues,
} from "./get-types.js";
