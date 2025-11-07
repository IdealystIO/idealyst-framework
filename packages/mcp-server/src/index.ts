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
import { iconGuide } from "./data/icon-guide.js";
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
    version: "1.0.88",
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
        uri: "idealyst://icons/reference",
        name: "Icon Reference Guide",
        description: "Complete guide to Material Design Icons with 7,447 available icons, common icons by category, and usage examples",
        mimeType: "text/markdown",
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  // Check framework guides first, then navigation guides, then icon guide
  let guide = frameworkGuides[uri] || navigationGuides[uri];

  // Handle icon reference
  if (uri === "idealyst://icons/reference") {
    guide = iconGuide;
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
