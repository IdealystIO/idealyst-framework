#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { components } from "./data/components/index.js";
import { cliCommands } from "./data/cli-commands.js";
import { frameworkGuides } from "./data/framework-guides.js";
import { navigationGuides } from "./data/navigation-guides.js";
import { translateGuides } from "./data/translate-guides.js";
import { storageGuides } from "./data/storage-guides.js";
import { iconGuide } from "./data/icon-guide.js";
import {
  packages,
  getPackageSummary,
  getPackagesByCategory,
  searchPackages,
} from "./data/packages.js";
import {
  recipes,
  getRecipeSummary,
  getRecipesByCategory,
  searchRecipes,
} from "./data/recipes.js";
import iconsData from "./data/icons.json" with { type: "json" };
import {
  getComponentTypes,
  getThemeTypes,
  getNavigationTypes,
  getAvailableComponents,
  getComponentExamples,
} from "./tools/get-types.js";

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
    tools: [
      {
        name: "list_components",
        description: "List all available Idealyst components with brief descriptions",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_component_docs",
        description: "Get detailed documentation for a specific Idealyst component including props, usage, and examples",
        inputSchema: {
          type: "object",
          properties: {
            component: {
              type: "string",
              description: "The name of the component (e.g., 'Button', 'Card', 'Input')",
            },
          },
          required: ["component"],
        },
      },
      {
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
              description: "Type of example: 'basic', 'variants', 'with-icons', 'interactive'",
              enum: ["basic", "variants", "with-icons", "interactive"],
            },
          },
          required: ["component"],
        },
      },
      {
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
      },
      {
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
              description: "Filter by category: 'layout', 'form', 'display', 'navigation', 'overlay', 'data'",
              enum: ["layout", "form", "display", "navigation", "overlay", "data"],
            },
          },
        },
      },
      {
        name: "search_icons",
        description: "Search for Material Design Icons by name or keyword. Returns matching icon names from 7,447 available icons.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search term to find icons (e.g., 'home', 'user', 'arrow')",
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (default: 20)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_component_types",
        description: "Get TypeScript type definitions for a specific component directly from the source. Returns the actual TypeScript interface and/or JSON schema.",
        inputSchema: {
          type: "object",
          properties: {
            component: {
              type: "string",
              description: "The name of the component (e.g., 'Button', 'Card', 'Input')",
            },
            format: {
              type: "string",
              description: "Output format: 'typescript' for raw TypeScript definitions, 'json' for parsed schema, 'both' for combined output (default: 'both')",
              enum: ["typescript", "json", "both"],
            },
          },
          required: ["component"],
        },
      },
      {
        name: "get_theme_types",
        description: "Get TypeScript type definitions for theme types (Size, Intent, Color, etc.) directly from @idealyst/theme",
        inputSchema: {
          type: "object",
          properties: {
            format: {
              type: "string",
              description: "Output format: 'typescript', 'json', or 'both' (default: 'both')",
              enum: ["typescript", "json", "both"],
            },
          },
        },
      },
      {
        name: "get_navigation_types",
        description: "Get TypeScript type definitions for navigation types directly from @idealyst/navigation",
        inputSchema: {
          type: "object",
          properties: {
            format: {
              type: "string",
              description: "Output format: 'typescript', 'json', or 'both' (default: 'both')",
              enum: ["typescript", "json", "both"],
            },
          },
        },
      },
      {
        name: "get_component_examples_ts",
        description: "Get validated TypeScript example code for a component. These examples are type-checked and guaranteed to compile.",
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
      },
      {
        name: "get_translate_guide",
        description: "Get documentation for @idealyst/translate internationalization package. Covers runtime API, Babel plugin, translation files, and examples.",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "Topic to get docs for: 'overview', 'runtime-api', 'babel-plugin', 'translation-files', 'examples'",
              enum: ["overview", "runtime-api", "babel-plugin", "translation-files", "examples"],
            },
          },
          required: ["topic"],
        },
      },
      {
        name: "get_storage_guide",
        description: "Get documentation for @idealyst/storage cross-platform storage package. Covers API reference and usage examples.",
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
      },
      {
        name: "list_packages",
        description: "List all available Idealyst packages with descriptions, categories, and documentation status. Use this to discover what packages are available in the framework.",
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
      },
      {
        name: "get_package_docs",
        description: "Get detailed documentation for a specific Idealyst package including installation, features, quick start, and API highlights.",
        inputSchema: {
          type: "object",
          properties: {
            package: {
              type: "string",
              description: "Package name (e.g., 'camera', 'oauth-client', 'datagrid')",
            },
            section: {
              type: "string",
              description: "Specific section to retrieve (optional, returns all if not specified)",
              enum: ["overview", "installation", "features", "quickstart", "api"],
            },
          },
          required: ["package"],
        },
      },
      {
        name: "search_packages",
        description: "Search across all Idealyst packages by name, description, or features.",
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
      },
      {
        name: "list_recipes",
        description: "List all available Idealyst recipes (common UI patterns) with descriptions. Recipes provide ready-to-use code examples for building apps.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Filter by category (optional)",
              enum: ["forms", "navigation", "data", "layout", "auth", "settings", "media"],
            },
            difficulty: {
              type: "string",
              description: "Filter by difficulty (optional)",
              enum: ["beginner", "intermediate", "advanced"],
            },
          },
        },
      },
      {
        name: "get_recipe",
        description: "Get a complete code recipe for a common UI pattern. Returns ready-to-use code with explanation and tips.",
        inputSchema: {
          type: "object",
          properties: {
            recipe: {
              type: "string",
              description: "Recipe ID (e.g., 'login-form', 'settings-screen', 'tab-navigation')",
            },
          },
          required: ["recipe"],
        },
      },
      {
        name: "search_recipes",
        description: "Search for recipes by name, description, category, or required packages.",
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
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "list_components": {
      const componentList = Object.entries(components).map(([name, data]) => ({
        name,
        category: data.category,
        description: data.description,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(componentList, null, 2),
          },
        ],
      };
    }

    case "get_component_docs": {
      const componentName = args?.component as string;
      const component = components[componentName];

      if (!component) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${componentName}" not found. Available components: ${Object.keys(components).join(", ")}`,
            },
          ],
        };
      }

      const docs = `# ${componentName}

${component.description}

## Category
${component.category}

## Props
${component.props}

## Usage Examples
${component.usage}

## Features
${component.features.map((f: string) => `- ${f}`).join("\n")}

## Best Practices
${component.bestPractices.map((bp: string) => `- ${bp}`).join("\n")}
`;

      return {
        content: [
          {
            type: "text",
            text: docs,
          },
        ],
      };
    }

    case "get_component_example": {
      const componentName = args?.component as string;
      const exampleType = (args?.example_type as string) || "basic";
      const component = components[componentName];

      if (!component) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${componentName}" not found.`,
            },
          ],
        };
      }

      const example = component.examples[exampleType] || component.examples.basic;

      return {
        content: [
          {
            type: "text",
            text: example,
          },
        ],
      };
    }

    case "get_cli_usage": {
      const commandName = args?.command as string;

      if (commandName) {
        const command = cliCommands[commandName];
        if (!command) {
          return {
            content: [
              {
                type: "text",
                text: `Command "${commandName}" not found. Available commands: ${Object.keys(cliCommands).join(", ")}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `# ${commandName}

${command.description}

## Usage
\`\`\`bash
${command.usage}
\`\`\`

## Options
${command.options.map((opt: any) => `- \`${opt.flag}\`: ${opt.description}`).join("\n")}

## Examples
${command.examples.map((ex: string) => `\`\`\`bash\n${ex}\n\`\`\``).join("\n\n")}
`,
            },
          ],
        };
      }

      // Return all commands
      const allCommands = Object.entries(cliCommands).map(([name, data]) => ({
        name,
        description: data.description,
        usage: data.usage,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(allCommands, null, 2),
          },
        ],
      };
    }

    case "search_components": {
      const query = (args?.query as string)?.toLowerCase() || "";
      const category = args?.category as string;

      let results = Object.entries(components);

      if (category) {
        results = results.filter(([_, data]) => data.category === category);
      }

      if (query) {
        results = results.filter(([name, data]) =>
          name.toLowerCase().includes(query) ||
          data.description.toLowerCase().includes(query) ||
          data.features.some((f: string) => f.toLowerCase().includes(query))
        );
      }

      const resultList = results.map(([name, data]) => ({
        name,
        category: data.category,
        description: data.description,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultList, null, 2),
          },
        ],
      };
    }

    case "search_icons": {
      const query = (args?.query as string)?.toLowerCase() || "";
      const limit = (args?.limit as number) || 20;

      if (!query) {
        return {
          content: [
            {
              type: "text",
              text: "Please provide a search query.",
            },
          ],
        };
      }

      // Filter icons that match the query
      const matchingIcons = iconsData.icons.filter((icon: string) =>
        icon.toLowerCase().includes(query)
      );

      // Limit results
      const limitedResults = matchingIcons.slice(0, limit);

      const result = {
        query,
        total: iconsData.total,
        matches: matchingIcons.length,
        returned: limitedResults.length,
        icons: limitedResults,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "get_component_types": {
      const componentName = args?.component as string;
      const format = (args?.format as 'typescript' | 'json' | 'both') || 'both';

      try {
        const result = getComponentTypes(componentName, format);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }

    case "get_theme_types": {
      const format = (args?.format as 'typescript' | 'json' | 'both') || 'both';

      try {
        const result = getThemeTypes(format);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }

    case "get_navigation_types": {
      const format = (args?.format as 'typescript' | 'json' | 'both') || 'both';

      try {
        const result = getNavigationTypes(format);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }

    case "get_component_examples_ts": {
      const componentName = args?.component as string;

      try {
        const examples = getComponentExamples(componentName);
        if (!examples) {
          return {
            content: [
              {
                type: "text",
                text: `No TypeScript examples found for component "${componentName}". Available components with examples: ${getAvailableComponents().join(', ')}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: examples,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }

    case "get_translate_guide": {
      const topic = args?.topic as string;
      const uri = `idealyst://translate/${topic}`;
      const guide = translateGuides[uri];

      if (!guide) {
        return {
          content: [
            {
              type: "text",
              text: `Topic "${topic}" not found. Available topics: overview, runtime-api, babel-plugin, translation-files, examples`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: guide,
          },
        ],
      };
    }

    case "get_storage_guide": {
      const topic = args?.topic as string;
      const uri = `idealyst://storage/${topic}`;
      const guide = storageGuides[uri];

      if (!guide) {
        return {
          content: [
            {
              type: "text",
              text: `Topic "${topic}" not found. Available topics: overview, api, examples`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: guide,
          },
        ],
      };
    }

    case "list_packages": {
      const category = args?.category as string | undefined;

      if (category) {
        // Filter by specific category
        const byCategory = getPackagesByCategory();
        const packageList = (byCategory[category] || []).map((pkg) => ({
          name: pkg.name,
          npmName: pkg.npmName,
          description: pkg.description,
          platforms: pkg.platforms,
          documentationStatus: pkg.documentationStatus,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(packageList, null, 2),
            },
          ],
        };
      }

      // Return all packages grouped by category
      const allPackages = getPackageSummary();
      const grouped = allPackages.reduce(
        (acc, pkg) => {
          const cat = pkg.category;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(pkg);
          return acc;
        },
        {} as Record<string, typeof allPackages>
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(grouped, null, 2),
          },
        ],
      };
    }

    case "get_package_docs": {
      const packageName = args?.package as string;
      const section = args?.section as string | undefined;

      // Handle both formats: "camera" and "@idealyst/camera"
      const normalizedName = packageName
        .replace("@idealyst/", "")
        .toLowerCase();
      const pkg = packages[normalizedName];

      if (!pkg) {
        const availablePackages = Object.keys(packages).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Package "${packageName}" not found. Available packages: ${availablePackages}`,
            },
          ],
        };
      }

      // Build documentation based on section or return all
      let docs = "";

      if (!section || section === "overview") {
        docs += `# ${pkg.name} (${pkg.npmName})

${pkg.description}

**Category:** ${pkg.category}
**Platforms:** ${pkg.platforms.join(", ")}
**Documentation Status:** ${pkg.documentationStatus}

`;
      }

      if (!section || section === "installation") {
        docs += `## Installation

\`\`\`bash
${pkg.installation}
\`\`\`

`;
        if (pkg.peerDependencies && pkg.peerDependencies.length > 0) {
          docs += `### Peer Dependencies
${pkg.peerDependencies.map((dep) => `- ${dep}`).join("\n")}

`;
        }
      }

      if (!section || section === "features") {
        docs += `## Features

${pkg.features.map((f) => `- ${f}`).join("\n")}

`;
      }

      if (!section || section === "quickstart") {
        docs += `## Quick Start

\`\`\`tsx
${pkg.quickStart}
\`\`\`

`;
      }

      if (!section || section === "api") {
        if (pkg.apiHighlights && pkg.apiHighlights.length > 0) {
          docs += `## API Highlights

${pkg.apiHighlights.map((api) => `- \`${api}\``).join("\n")}

`;
        }
      }

      if (pkg.relatedPackages && pkg.relatedPackages.length > 0) {
        docs += `## Related Packages

${pkg.relatedPackages.map((rp) => `- @idealyst/${rp}`).join("\n")}
`;
      }

      return {
        content: [
          {
            type: "text",
            text: docs.trim(),
          },
        ],
      };
    }

    case "search_packages": {
      const query = args?.query as string;

      if (!query) {
        return {
          content: [
            {
              type: "text",
              text: "Please provide a search query.",
            },
          ],
        };
      }

      const results = searchPackages(query);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No packages found matching "${query}". Try searching for: camera, oauth, storage, translate, datagrid, datepicker, navigation, etc.`,
            },
          ],
        };
      }

      const resultList = results.map((pkg) => ({
        name: pkg.name,
        npmName: pkg.npmName,
        category: pkg.category,
        description: pkg.description,
        platforms: pkg.platforms,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultList, null, 2),
          },
        ],
      };
    }

    case "list_recipes": {
      const category = args?.category as string | undefined;
      const difficulty = args?.difficulty as string | undefined;

      let recipeList = getRecipeSummary();

      // Filter by category
      if (category) {
        recipeList = recipeList.filter((r) => r.category === category);
      }

      // Filter by difficulty
      if (difficulty) {
        recipeList = recipeList.filter((r) => r.difficulty === difficulty);
      }

      // Group by category for readability
      if (!category) {
        const grouped = recipeList.reduce(
          (acc, recipe) => {
            if (!acc[recipe.category]) acc[recipe.category] = [];
            acc[recipe.category].push(recipe);
            return acc;
          },
          {} as Record<string, typeof recipeList>
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(grouped, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(recipeList, null, 2),
          },
        ],
      };
    }

    case "get_recipe": {
      const recipeId = args?.recipe as string;

      // Normalize the recipe ID (handle both "login-form" and "loginForm" etc)
      const normalizedId = recipeId.toLowerCase().replace(/\s+/g, "-");
      const recipe = recipes[normalizedId];

      if (!recipe) {
        const availableRecipes = Object.keys(recipes).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Recipe "${recipeId}" not found.\n\nAvailable recipes: ${availableRecipes}`,
            },
          ],
        };
      }

      // Format the recipe as markdown
      const output = `# ${recipe.name}

${recipe.description}

**Category:** ${recipe.category}
**Difficulty:** ${recipe.difficulty}
**Required packages:** ${recipe.packages.join(", ")}

## Code

\`\`\`tsx
${recipe.code}
\`\`\`

## Explanation

${recipe.explanation}

${recipe.tips && recipe.tips.length > 0 ? `## Tips

${recipe.tips.map((tip) => `- ${tip}`).join("\n")}` : ""}

${recipe.relatedRecipes && recipe.relatedRecipes.length > 0 ? `## Related Recipes

${recipe.relatedRecipes.map((r) => `- ${r}`).join("\n")}` : ""}
`;

      return {
        content: [
          {
            type: "text",
            text: output.trim(),
          },
        ],
      };
    }

    case "search_recipes": {
      const query = args?.query as string;

      if (!query) {
        return {
          content: [
            {
              type: "text",
              text: "Please provide a search query.",
            },
          ],
        };
      }

      const results = searchRecipes(query);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No recipes found matching "${query}". Try searching for: login, form, navigation, settings, auth, list, modal, etc.`,
            },
          ],
        };
      }

      const resultList = results.map((recipe) => ({
        id: Object.entries(recipes).find(([_, r]) => r === recipe)?.[0],
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        difficulty: recipe.difficulty,
        packages: recipe.packages,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultList, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
  }
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
