/**
 * Tool Definitions
 *
 * MCP tool schema definitions for all Idealyst tools.
 * These can be used to register tools with an MCP server or other systems.
 */

import type { ToolDefinition } from "./types.js";

// ============================================================================
// Component Tool Definitions
// ============================================================================

export const listComponentsDefinition: ToolDefinition = {
  name: "list_components",
  description: "List all available Idealyst components with brief descriptions",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const getComponentDocsDefinition: ToolDefinition = {
  name: "get_component_docs",
  description:
    "Get detailed documentation for a specific Idealyst component including props, usage, and examples",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description:
          "The name of the component (e.g., 'Button', 'Card', 'Input')",
      },
    },
    required: ["component"],
  },
};

export const getComponentExampleDefinition: ToolDefinition = {
  name: "get_component_example",
  description: "Get a code example for a specific Idealyst component",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description: "The name of the component",
      },
      example_type: {
        type: "string",
        description:
          "Type of example: 'basic', 'variants', 'with-icons', 'interactive'",
        enum: ["basic", "variants", "with-icons", "interactive"],
      },
    },
    required: ["component"],
  },
};

export const searchComponentsDefinition: ToolDefinition = {
  name: "search_components",
  description: "Search for components by name, category, or feature",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query",
      },
      category: {
        type: "string",
        description:
          "Filter by category: 'layout', 'form', 'display', 'navigation', 'overlay', 'data'",
        enum: ["layout", "form", "display", "navigation", "overlay", "data"],
      },
    },
  },
};

export const getComponentTypesDefinition: ToolDefinition = {
  name: "get_component_types",
  description:
    "Get TypeScript type definitions for a specific component directly from the source. Returns the actual TypeScript interface and/or JSON schema.",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description:
          "The name of the component (e.g., 'Button', 'Card', 'Input')",
      },
      format: {
        type: "string",
        description:
          "Output format: 'typescript' for raw TypeScript definitions, 'json' for parsed schema, 'both' for combined output (default: 'both')",
        enum: ["typescript", "json", "both"],
      },
    },
    required: ["component"],
  },
};

export const getComponentExamplesTsDefinition: ToolDefinition = {
  name: "get_component_examples_ts",
  description:
    "Get validated TypeScript example code for a component. These examples are type-checked and guaranteed to compile.",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description: "The name of the component (e.g., 'Button', 'Card')",
      },
    },
    required: ["component"],
  },
};

// ============================================================================
// CLI Tool Definitions
// ============================================================================

export const getCliUsageDefinition: ToolDefinition = {
  name: "get_cli_usage",
  description: "Get information about Idealyst CLI commands and usage",
  inputSchema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "Specific CLI command to get info about (optional)",
      },
    },
  },
};

// ============================================================================
// Icon Tool Definitions
// ============================================================================

export const searchIconsDefinition: ToolDefinition = {
  name: "search_icons",
  description:
    "Search for Material Design Icons by name or keyword. Returns matching icon names from 7,447 available icons.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Search term to find icons (e.g., 'home', 'user', 'arrow')",
      },
      limit: {
        type: "number",
        description: "Maximum number of results to return (default: 20)",
      },
    },
    required: ["query"],
  },
};

// ============================================================================
// Theme Tool Definitions
// ============================================================================

export const getThemeTypesDefinition: ToolDefinition = {
  name: "get_theme_types",
  description:
    "Get TypeScript type definitions for theme types (Size, Intent, Color, etc.) directly from @idealyst/theme",
  inputSchema: {
    type: "object",
    properties: {
      format: {
        type: "string",
        description:
          "Output format: 'typescript', 'json', or 'both' (default: 'both')",
        enum: ["typescript", "json", "both"],
      },
    },
  },
};

// ============================================================================
// Navigation Tool Definitions
// ============================================================================

export const getNavigationTypesDefinition: ToolDefinition = {
  name: "get_navigation_types",
  description:
    "Get TypeScript type definitions for navigation types directly from @idealyst/navigation",
  inputSchema: {
    type: "object",
    properties: {
      format: {
        type: "string",
        description:
          "Output format: 'typescript', 'json', or 'both' (default: 'both')",
        enum: ["typescript", "json", "both"],
      },
    },
  },
};

// ============================================================================
// Guide Tool Definitions
// ============================================================================

export const getTranslateGuideDefinition: ToolDefinition = {
  name: "get_translate_guide",
  description:
    "Get documentation for @idealyst/translate internationalization package. Covers runtime API, Babel plugin, translation files, and examples.",
  inputSchema: {
    type: "object",
    properties: {
      topic: {
        type: "string",
        description:
          "Topic to get docs for: 'overview', 'runtime-api', 'babel-plugin', 'translation-files', 'examples'",
        enum: [
          "overview",
          "runtime-api",
          "babel-plugin",
          "translation-files",
          "examples",
        ],
      },
    },
    required: ["topic"],
  },
};

export const getStorageGuideDefinition: ToolDefinition = {
  name: "get_storage_guide",
  description:
    "Get documentation for @idealyst/storage cross-platform storage package. Covers API reference and usage examples.",
  inputSchema: {
    type: "object",
    properties: {
      topic: {
        type: "string",
        description: "Topic to get docs for: 'overview', 'api', 'examples'",
        enum: ["overview", "api", "examples"],
      },
    },
    required: ["topic"],
  },
};

// ============================================================================
// Package Tool Definitions
// ============================================================================

export const listPackagesDefinition: ToolDefinition = {
  name: "list_packages",
  description:
    "List all available Idealyst packages with descriptions, categories, and documentation status. Use this to discover what packages are available in the framework.",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "Filter by category (optional)",
        enum: ["core", "ui", "media", "data", "auth", "utility", "tooling"],
      },
    },
  },
};

export const getPackageDocsDefinition: ToolDefinition = {
  name: "get_package_docs",
  description:
    "Get detailed documentation for a specific Idealyst package including installation, features, quick start, and API highlights.",
  inputSchema: {
    type: "object",
    properties: {
      package: {
        type: "string",
        description:
          "Package name (e.g., 'camera', 'oauth-client', 'datagrid')",
      },
      section: {
        type: "string",
        description:
          "Specific section to retrieve (optional, returns all if not specified)",
        enum: ["overview", "installation", "features", "quickstart", "api"],
      },
    },
    required: ["package"],
  },
};

export const searchPackagesDefinition: ToolDefinition = {
  name: "search_packages",
  description:
    "Search across all Idealyst packages by name, description, or features.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query",
      },
    },
    required: ["query"],
  },
};

// ============================================================================
// Recipe Tool Definitions
// ============================================================================

export const listRecipesDefinition: ToolDefinition = {
  name: "list_recipes",
  description:
    "List all available Idealyst recipes (common UI patterns) with descriptions. Recipes provide ready-to-use code examples for building apps.",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "Filter by category (optional)",
        enum: [
          "forms",
          "navigation",
          "data",
          "layout",
          "auth",
          "settings",
          "media",
        ],
      },
      difficulty: {
        type: "string",
        description: "Filter by difficulty (optional)",
        enum: ["beginner", "intermediate", "advanced"],
      },
    },
  },
};

export const getRecipeDefinition: ToolDefinition = {
  name: "get_recipe",
  description:
    "Get a complete code recipe for a common UI pattern. Returns ready-to-use code with explanation and tips.",
  inputSchema: {
    type: "object",
    properties: {
      recipe: {
        type: "string",
        description:
          "Recipe ID (e.g., 'login-form', 'settings-screen', 'tab-navigation')",
      },
    },
    required: ["recipe"],
  },
};

export const searchRecipesDefinition: ToolDefinition = {
  name: "search_recipes",
  description:
    "Search for recipes by name, description, category, or required packages.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query (e.g., 'auth', 'form', 'navigation')",
      },
    },
    required: ["query"],
  },
};

// ============================================================================
// Install Guide Tool Definitions
// ============================================================================

export const getInstallGuideDefinition: ToolDefinition = {
  name: "get_install_guide",
  description:
    "Get detailed installation instructions for an Idealyst package, including iOS (Info.plist, CocoaPods), Android (AndroidManifest.xml, permissions, Gradle), and web configuration. Essential for packages with native dependencies.",
  inputSchema: {
    type: "object",
    properties: {
      package: {
        type: "string",
        description:
          "Package name (e.g., 'camera', 'microphone', 'oauth-client', 'storage')",
      },
    },
    required: ["package"],
  },
};

// ============================================================================
// All Tool Definitions Array
// ============================================================================

/**
 * Array of all tool definitions.
 * Use this to register all tools with an MCP server.
 */
export const toolDefinitions: ToolDefinition[] = [
  // Component tools
  listComponentsDefinition,
  getComponentDocsDefinition,
  getComponentExampleDefinition,
  searchComponentsDefinition,
  getComponentTypesDefinition,
  getComponentExamplesTsDefinition,
  // CLI tools
  getCliUsageDefinition,
  // Icon tools
  searchIconsDefinition,
  // Theme tools
  getThemeTypesDefinition,
  // Navigation tools
  getNavigationTypesDefinition,
  // Guide tools
  getTranslateGuideDefinition,
  getStorageGuideDefinition,
  // Package tools
  listPackagesDefinition,
  getPackageDocsDefinition,
  searchPackagesDefinition,
  // Recipe tools
  listRecipesDefinition,
  getRecipeDefinition,
  searchRecipesDefinition,
  // Install guide tools
  getInstallGuideDefinition,
];

/**
 * Map of tool definitions by name.
 * Use this for quick lookup of a specific tool definition.
 */
export const toolDefinitionMap: Record<string, ToolDefinition> =
  Object.fromEntries(toolDefinitions.map((tool) => [tool.name, tool]));
