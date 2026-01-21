/**
 * Tool Types
 *
 * TypeScript types for MCP tools provided by @idealyst/mcp-server.
 */

/**
 * JSON Schema input definition for a tool
 */
export interface ToolInputSchema {
  type: "object";
  properties: Record<string, PropertySchema>;
  required?: string[];
}

export interface PropertySchema {
  type: string;
  description?: string;
  enum?: string[];
}

/**
 * MCP Tool definition structure
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}

/**
 * MCP Tool response content
 */
export interface ToolContent {
  type: "text";
  text: string;
  [key: string]: unknown;
}

/**
 * MCP Tool response
 */
export interface ToolResponse {
  content: ToolContent[];
  [key: string]: unknown;
}

/**
 * Tool handler function signature
 */
export type ToolHandler<TArgs = Record<string, unknown>> = (
  args: TArgs
) => ToolResponse | Promise<ToolResponse>;

// ============================================================================
// Component Tool Types
// ============================================================================

export interface ListComponentsArgs {}

export interface GetComponentDocsArgs {
  component: string;
}

export interface GetComponentExampleArgs {
  component: string;
  example_type?: "basic" | "variants" | "with-icons" | "interactive";
}

export interface SearchComponentsArgs {
  query?: string;
  category?: "layout" | "form" | "display" | "navigation" | "overlay" | "data";
}

export interface GetComponentTypesArgs {
  component: string;
  format?: "typescript" | "json" | "both";
}

export interface GetComponentExamplesTsArgs {
  component: string;
}

// ============================================================================
// CLI Tool Types
// ============================================================================

export interface GetCliUsageArgs {
  command?: string;
}

// ============================================================================
// Icon Tool Types
// ============================================================================

export interface SearchIconsArgs {
  query: string;
  limit?: number;
}

// ============================================================================
// Theme Tool Types
// ============================================================================

export interface GetThemeTypesArgs {
  format?: "typescript" | "json" | "both";
}

// ============================================================================
// Navigation Tool Types
// ============================================================================

export interface GetNavigationTypesArgs {
  format?: "typescript" | "json" | "both";
}

// ============================================================================
// Guide Tool Types
// ============================================================================

export interface GetTranslateGuideArgs {
  topic: "overview" | "runtime-api" | "babel-plugin" | "translation-files" | "examples";
}

export interface GetStorageGuideArgs {
  topic: "overview" | "api" | "examples";
}

// ============================================================================
// Package Tool Types
// ============================================================================

export interface ListPackagesArgs {
  category?: "core" | "ui" | "media" | "data" | "auth" | "utility" | "tooling";
}

export interface GetPackageDocsArgs {
  package: string;
  section?: "overview" | "installation" | "features" | "quickstart" | "api";
}

export interface SearchPackagesArgs {
  query: string;
}

// ============================================================================
// Recipe Tool Types
// ============================================================================

export interface ListRecipesArgs {
  category?: "forms" | "navigation" | "data" | "layout" | "auth" | "settings" | "media";
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export interface GetRecipeArgs {
  recipe: string;
}

export interface SearchRecipesArgs {
  query: string;
}

// ============================================================================
// Install Guide Tool Types
// ============================================================================

export interface GetInstallGuideArgs {
  package: string;
}

// ============================================================================
// Union Types
// ============================================================================

export type ToolName =
  | "list_components"
  | "get_component_docs"
  | "get_component_example"
  | "search_components"
  | "get_component_types"
  | "get_component_examples_ts"
  | "get_cli_usage"
  | "search_icons"
  | "get_theme_types"
  | "get_navigation_types"
  | "get_translate_guide"
  | "get_storage_guide"
  | "list_packages"
  | "get_package_docs"
  | "search_packages"
  | "list_recipes"
  | "get_recipe"
  | "search_recipes"
  | "get_install_guide";

export type ToolArgs =
  | ListComponentsArgs
  | GetComponentDocsArgs
  | GetComponentExampleArgs
  | SearchComponentsArgs
  | GetComponentTypesArgs
  | GetComponentExamplesTsArgs
  | GetCliUsageArgs
  | SearchIconsArgs
  | GetThemeTypesArgs
  | GetNavigationTypesArgs
  | GetTranslateGuideArgs
  | GetStorageGuideArgs
  | ListPackagesArgs
  | GetPackageDocsArgs
  | SearchPackagesArgs
  | ListRecipesArgs
  | GetRecipeArgs
  | SearchRecipesArgs
  | GetInstallGuideArgs;
