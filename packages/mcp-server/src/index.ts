#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { frameworkGuides } from "./data/framework-guides.js";
import { navigationGuides } from "./data/navigation-guides.js";
import { translateGuides } from "./data/translate-guides.js";
import { storageGuides } from "./data/storage-guides.js";
import { iconGuide } from "./data/icon-guide.js";
import {
  packages,
  getPackagesByCategory,
} from "./data/packages.js";
import {
  recipes,
  getRecipesByCategory,
} from "./data/recipes.js";

// Import tool definitions and handler from the extracted tools module
import { toolDefinitions, callTool } from "./tools/index.js";

const server = new Server(
  {
    name: "@idealyst/mcp-server",
    version: "1.0.94",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolDefinitions,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return callTool(name, args || {});
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "idealyst://packages/overview",
        name: "Idealyst Packages Overview",
        description: "Overview of all available @idealyst packages organized by category",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://recipes/overview",
        name: "Idealyst Recipes Overview",
        description: "Overview of all available code recipes for common UI patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://framework/getting-started",
        name: "Getting Started with Idealyst",
        description: "Complete guide to setting up and using the Idealyst framework",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://framework/components-overview",
        name: "Components Overview",
        description: "Overview of all available Idealyst components organized by category",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://framework/theming",
        name: "Theming Guide",
        description: "Guide to customizing themes in Idealyst",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://framework/cli",
        name: "CLI Reference",
        description: "Complete reference for the Idealyst CLI",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://navigation/overview",
        name: "Navigation System Overview",
        description: "Overview of the Idealyst navigation system for cross-platform routing",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://navigation/route-configuration",
        name: "Route Configuration",
        description: "Learn how to define and structure routes in Idealyst",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://navigation/navigator-types",
        name: "Navigator Types",
        description: "Guide to stack, tab, drawer, and modal navigators",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://navigation/custom-layouts",
        name: "Custom Layouts (Web)",
        description: "Creating custom layouts with headers and sidebars for web applications",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://navigation/use-navigator",
        name: "useNavigator Hook",
        description: "Complete reference for the useNavigator hook API",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://navigation/web-mobile-parity",
        name: "Web/Mobile Navigation Parity",
        description: "How to achieve native-like navigation UI on web using layout components",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://icons/reference",
        name: "Icon Reference Guide",
        description: "Complete guide to Material Design Icons with 7,447 available icons, common icons by category, and usage examples",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://translate/overview",
        name: "Translation Overview",
        description: "Overview of @idealyst/translate internationalization package",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://translate/runtime-api",
        name: "Translation Runtime API",
        description: "Complete reference for TranslateProvider, useTranslation, useLanguage, and Trans component",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://translate/babel-plugin",
        name: "Translation Babel Plugin",
        description: "Guide to the Babel plugin for static key extraction and missing translation detection",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://translate/translation-files",
        name: "Translation File Format",
        description: "Guide to organizing and formatting translation JSON files",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://translate/examples",
        name: "Translation Examples",
        description: "Complete code examples for common translation patterns",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://storage/overview",
        name: "Storage Overview",
        description: "Overview of @idealyst/storage cross-platform storage package",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://storage/api",
        name: "Storage API Reference",
        description: "Complete API reference for @idealyst/storage",
        mimeType: "text/markdown",
      },
      {
        uri: "idealyst://storage/examples",
        name: "Storage Examples",
        description: "Complete code examples for common storage patterns",
        mimeType: "text/markdown",
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  // Check all guide sources
  let guide = frameworkGuides[uri] || navigationGuides[uri] || translateGuides[uri] || storageGuides[uri];

  // Handle icon reference
  if (uri === "idealyst://icons/reference") {
    guide = iconGuide;
  }

  // Handle recipes overview
  if (uri === "idealyst://recipes/overview") {
    const byCategory = getRecipesByCategory();
    const categoryLabels: Record<string, string> = {
      auth: "Authentication",
      forms: "Forms & Validation",
      navigation: "Navigation",
      data: "Data & Lists",
      layout: "Layout & Modals",
      settings: "Settings & Preferences",
      media: "Media & Uploads",
    };

    let content = `# Idealyst Recipes

Ready-to-use code examples for common UI patterns in Idealyst apps.

`;

    for (const [category, recipeList] of Object.entries(byCategory)) {
      content += `## ${categoryLabels[category] || category}\n\n`;

      for (const recipe of recipeList) {
        const id = Object.entries(recipes).find(([_, r]) => r === recipe)?.[0];
        content += `### ${recipe.name}
${recipe.description}

- **Difficulty:** ${recipe.difficulty}
- **Packages:** ${recipe.packages.join(", ")}
- **Get recipe:** \`get_recipe({ recipe: "${id}" })\`

`;
      }
    }

    guide = content;
  }

  // Handle packages overview
  if (uri === "idealyst://packages/overview") {
    const byCategory = getPackagesByCategory();
    const categoryOrder = ["core", "ui", "data", "media", "auth", "utility", "tooling"];
    const categoryLabels: Record<string, string> = {
      core: "Core Packages",
      ui: "UI Components",
      data: "Data & Storage",
      media: "Media & Hardware",
      auth: "Authentication",
      utility: "Utilities",
      tooling: "Developer Tooling",
    };

    let content = `# Idealyst Framework Packages

The Idealyst Framework provides a comprehensive set of packages for building cross-platform React applications.

`;

    for (const category of categoryOrder) {
      const pkgs = byCategory[category];
      if (!pkgs || pkgs.length === 0) continue;

      content += `## ${categoryLabels[category] || category}\n\n`;

      for (const pkg of pkgs) {
        const platforms = pkg.platforms.join(", ");
        content += `### ${pkg.name} (\`${pkg.npmName}\`)
${pkg.description}

- **Platforms:** ${platforms}
- **Install:** \`${pkg.installation}\`

`;
      }
    }

    guide = content;
  }

  if (!guide) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: "text/markdown",
        text: guide,
      },
    ],
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Idealyst MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
