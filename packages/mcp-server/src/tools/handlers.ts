/**
 * Tool Handlers
 *
 * Implementation functions for all MCP tools.
 * These handlers can be used directly or through an MCP server.
 *
 * Component documentation now uses:
 * - Types: Dynamically loaded from @idealyst/tooling via generated/types.json
 * - Examples: Type-checked .examples.tsx files in examples/components/
 * - Metadata: Minimal static metadata (category, description, features, best practices)
 */

import {
  componentMetadata,
  getComponentMetadata,
  getComponentNames,
  searchComponents as searchComponentsData,
  getComponentsByCategory,
} from "../data/component-metadata.js";
import { cliCommands } from "../data/cli-commands.js";
import { translateGuides } from "../data/translate-guides.js";
import { storageGuides } from "../data/storage-guides.js";
import {
  packages,
  getPackageSummary,
  getPackagesByCategory as getPackagesByCat,
  searchPackages as searchPackagesData,
} from "../data/packages.js";
import {
  recipes,
  getRecipeSummary,
  getRecipesByCategory,
  searchRecipes as searchRecipesData,
} from "../data/recipes.js";
import {
  installGuides,
  getInstallGuide as getInstallGuideData,
  formatInstallGuideMarkdown,
} from "../data/install-guides.js";
import iconsData from "../data/icons.json" with { type: "json" };
import {
  getComponentTypes as getTypesFromFile,
  getThemeTypes as getThemeTypesFromFile,
  getNavigationTypes as getNavigationTypesFromFile,
  getAvailableComponents,
  getComponentExamples as getComponentExamplesFromFile,
} from "./get-types.js";
import type {
  ToolResponse,
  ListComponentsArgs,
  GetComponentDocsArgs,
  GetComponentExampleArgs,
  SearchComponentsArgs,
  GetComponentTypesArgs,
  GetComponentExamplesTsArgs,
  GetCliUsageArgs,
  SearchIconsArgs,
  GetThemeTypesArgs,
  GetNavigationTypesArgs,
  GetTranslateGuideArgs,
  GetStorageGuideArgs,
  ListPackagesArgs,
  GetPackageDocsArgs,
  SearchPackagesArgs,
  ListRecipesArgs,
  GetRecipeArgs,
  SearchRecipesArgs,
  GetInstallGuideArgs,
} from "./types.js";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a standard tool response with text content
 */
function textResponse(text: string): ToolResponse {
  return {
    content: [{ type: "text", text }],
  };
}

/**
 * Create a JSON response
 */
function jsonResponse(data: unknown): ToolResponse {
  return textResponse(JSON.stringify(data, null, 2));
}

// ============================================================================
// Component Tool Handlers
// ============================================================================

/**
 * List all available Idealyst components with brief descriptions
 */
export function listComponents(_args: ListComponentsArgs = {}): ToolResponse {
  const componentList = getComponentNames().map((name) => {
    const meta = getComponentMetadata(name);
    return {
      name,
      category: meta?.category || "unknown",
      description: meta?.description || "",
    };
  });

  return jsonResponse(componentList);
}

/**
 * Get detailed documentation for a specific component
 *
 * Returns:
 * - Description and category from metadata
 * - TypeScript props from dynamic types
 * - Features and best practices from metadata
 * - Type-checked examples from .examples.tsx files
 */
export function getComponentDocs(args: GetComponentDocsArgs): ToolResponse {
  const componentName = args.component;
  const meta = getComponentMetadata(componentName);

  if (!meta) {
    return textResponse(
      `Component "${componentName}" not found. Available components: ${getComponentNames().join(", ")}`
    );
  }

  // Get TypeScript types for props documentation
  let propsSection = "";
  try {
    const types = getTypesFromFile(componentName, "typescript");
    propsSection = `## Props (TypeScript)

\`\`\`typescript
${types.typescript}
\`\`\``;
  } catch {
    propsSection = "## Props\n\n_Types not available. Run `yarn extract-types` to generate._";
  }

  // Get type-checked examples
  let examplesSection = "";
  const examples = getComponentExamplesFromFile(componentName);
  if (examples) {
    examplesSection = `## Examples

\`\`\`tsx
${examples}
\`\`\``;
  }

  const docs = `# ${componentName}

${meta.description}

## Category
${meta.category}

${propsSection}

## Features
${meta.features.map((f) => `- ${f}`).join("\n")}

## Best Practices
${meta.bestPractices.map((bp) => `- ${bp}`).join("\n")}

${examplesSection}
`;

  return textResponse(docs);
}

/**
 * Get a code example for a specific component
 *
 * Returns the type-checked example file content.
 * The example_type parameter is kept for API compatibility but all examples
 * are now in a single .examples.tsx file.
 */
export function getComponentExample(args: GetComponentExampleArgs): ToolResponse {
  const componentName = args.component;
  const meta = getComponentMetadata(componentName);

  if (!meta) {
    return textResponse(`Component "${componentName}" not found.`);
  }

  const examples = getComponentExamplesFromFile(componentName);
  if (!examples) {
    return textResponse(
      `No examples found for "${componentName}". Examples are in packages/mcp-server/examples/components/${componentName}.examples.tsx`
    );
  }

  return textResponse(examples);
}

/**
 * Search for components by name, category, or feature
 */
export function searchComponents(args: SearchComponentsArgs = {}): ToolResponse {
  const query = args.query || "";
  const category = args.category;

  let results: string[];

  if (query) {
    results = searchComponentsData(query, category);
  } else if (category) {
    results = getComponentsByCategory(category);
  } else {
    results = getComponentNames();
  }

  const resultList = results.map((name) => {
    const meta = getComponentMetadata(name);
    return {
      name,
      category: meta?.category || "unknown",
      description: meta?.description || "",
    };
  });

  return jsonResponse(resultList);
}

/**
 * Get TypeScript type definitions for a component
 */
export function getComponentTypes(args: GetComponentTypesArgs): ToolResponse {
  const componentName = args.component;
  const format = args.format || "both";

  try {
    const result = getTypesFromFile(componentName, format);
    return jsonResponse(result);
  } catch (error) {
    return textResponse(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get validated TypeScript examples for a component
 *
 * These examples are type-checked against the actual component props
 * to ensure they compile and are correct.
 */
export function getComponentExamplesTs(args: GetComponentExamplesTsArgs): ToolResponse {
  const componentName = args.component;

  try {
    const examples = getComponentExamplesFromFile(componentName);
    if (!examples) {
      const availableComponents = getAvailableComponents();
      return textResponse(
        `No TypeScript examples found for component "${componentName}". Available components with examples: ${availableComponents.join(", ")}`
      );
    }

    return textResponse(examples);
  } catch (error) {
    return textResponse(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ============================================================================
// CLI Tool Handlers
// ============================================================================

/**
 * Get information about CLI commands and usage
 */
export function getCliUsage(args: GetCliUsageArgs = {}): ToolResponse {
  const commandName = args.command;

  if (commandName) {
    const command = cliCommands[commandName];
    if (!command) {
      return textResponse(
        `Command "${commandName}" not found. Available commands: ${Object.keys(cliCommands).join(", ")}`
      );
    }

    return textResponse(`# ${commandName}

${command.description}

## Usage
\`\`\`bash
${command.usage}
\`\`\`

## Options
${command.options.map((opt: any) => `- \`${opt.flag}\`: ${opt.description}`).join("\n")}

## Examples
${command.examples.map((ex: string) => `\`\`\`bash\n${ex}\n\`\`\``).join("\n\n")}
`);
  }

  // Return all commands
  const allCommands = Object.entries(cliCommands).map(([name, data]) => ({
    name,
    description: data.description,
    usage: data.usage,
  }));

  return jsonResponse(allCommands);
}

// ============================================================================
// Icon Tool Handlers
// ============================================================================

/**
 * Search for Material Design Icons
 */
export function searchIcons(args: SearchIconsArgs): ToolResponse {
  const query = args.query?.toLowerCase() || "";
  const limit = args.limit || 20;

  if (!query) {
    return textResponse("Please provide a search query.");
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

  return jsonResponse(result);
}

// ============================================================================
// Theme Tool Handlers
// ============================================================================

/**
 * Get TypeScript type definitions for theme types
 */
export function getThemeTypes(args: GetThemeTypesArgs = {}): ToolResponse {
  const format = args.format || "both";

  try {
    const result = getThemeTypesFromFile(format);
    return jsonResponse(result);
  } catch (error) {
    return textResponse(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ============================================================================
// Navigation Tool Handlers
// ============================================================================

/**
 * Get TypeScript type definitions for navigation types
 */
export function getNavigationTypes(args: GetNavigationTypesArgs = {}): ToolResponse {
  const format = args.format || "both";

  try {
    const result = getNavigationTypesFromFile(format);
    return jsonResponse(result);
  } catch (error) {
    return textResponse(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ============================================================================
// Guide Tool Handlers
// ============================================================================

/**
 * Get documentation for the translate package
 */
export function getTranslateGuide(args: GetTranslateGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://translate/${topic}`;
  const guide = translateGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, runtime-api, babel-plugin, translation-files, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the storage package
 */
export function getStorageGuide(args: GetStorageGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://storage/${topic}`;
  const guide = storageGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

// ============================================================================
// Package Tool Handlers
// ============================================================================

/**
 * List all available packages
 */
export function listPackages(args: ListPackagesArgs = {}): ToolResponse {
  const category = args.category;

  if (category) {
    // Filter by specific category
    const byCategory = getPackagesByCat();
    const packageList = (byCategory[category] || []).map((pkg) => ({
      name: pkg.name,
      npmName: pkg.npmName,
      description: pkg.description,
      platforms: pkg.platforms,
      documentationStatus: pkg.documentationStatus,
    }));

    return jsonResponse(packageList);
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

  return jsonResponse(grouped);
}

/**
 * Get detailed documentation for a package
 */
export function getPackageDocs(args: GetPackageDocsArgs): ToolResponse {
  const packageName = args.package;
  const section = args.section;

  // Handle both formats: "camera" and "@idealyst/camera"
  const normalizedName = packageName.replace("@idealyst/", "").toLowerCase();
  const pkg = packages[normalizedName];

  if (!pkg) {
    const availablePackages = Object.keys(packages).join(", ");
    return textResponse(
      `Package "${packageName}" not found. Available packages: ${availablePackages}`
    );
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

  return textResponse(docs.trim());
}

/**
 * Search across all packages
 */
export function searchPackages(args: SearchPackagesArgs): ToolResponse {
  const query = args.query;

  if (!query) {
    return textResponse("Please provide a search query.");
  }

  const results = searchPackagesData(query);

  if (results.length === 0) {
    return textResponse(
      `No packages found matching "${query}". Try searching for: camera, oauth, storage, translate, datagrid, datepicker, navigation, etc.`
    );
  }

  const resultList = results.map((pkg) => ({
    name: pkg.name,
    npmName: pkg.npmName,
    category: pkg.category,
    description: pkg.description,
    platforms: pkg.platforms,
  }));

  return jsonResponse(resultList);
}

// ============================================================================
// Recipe Tool Handlers
// ============================================================================

/**
 * List all available recipes
 */
export function listRecipes(args: ListRecipesArgs = {}): ToolResponse {
  const category = args.category;
  const difficulty = args.difficulty;

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

    return jsonResponse(grouped);
  }

  return jsonResponse(recipeList);
}

/**
 * Get a complete code recipe
 */
export function getRecipe(args: GetRecipeArgs): ToolResponse {
  const recipeId = args.recipe;

  // Normalize the recipe ID (handle both "login-form" and "loginForm" etc)
  const normalizedId = recipeId.toLowerCase().replace(/\s+/g, "-");
  const recipe = recipes[normalizedId];

  if (!recipe) {
    const availableRecipes = Object.keys(recipes).join(", ");
    return textResponse(
      `Recipe "${recipeId}" not found.\n\nAvailable recipes: ${availableRecipes}`
    );
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

${
  recipe.tips && recipe.tips.length > 0
    ? `## Tips

${recipe.tips.map((tip) => `- ${tip}`).join("\n")}`
    : ""
}

${
  recipe.relatedRecipes && recipe.relatedRecipes.length > 0
    ? `## Related Recipes

${recipe.relatedRecipes.map((r) => `- ${r}`).join("\n")}`
    : ""
}
`;

  return textResponse(output.trim());
}

/**
 * Search for recipes
 */
export function searchRecipes(args: SearchRecipesArgs): ToolResponse {
  const query = args.query;

  if (!query) {
    return textResponse("Please provide a search query.");
  }

  const results = searchRecipesData(query);

  if (results.length === 0) {
    return textResponse(
      `No recipes found matching "${query}". Try searching for: login, form, navigation, settings, auth, list, modal, etc.`
    );
  }

  const resultList = results.map((recipe) => ({
    id: Object.entries(recipes).find(([_, r]) => r === recipe)?.[0],
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    packages: recipe.packages,
  }));

  return jsonResponse(resultList);
}

// ============================================================================
// Install Guide Tool Handlers
// ============================================================================

/**
 * Get detailed installation guide for a package
 */
export function getInstallGuide(args: GetInstallGuideArgs): ToolResponse {
  const packageName = args.package;

  if (!packageName) {
    return textResponse("Please provide a package name.");
  }

  const guide = getInstallGuideData(packageName);

  if (!guide) {
    const availablePackages = Object.keys(installGuides).join(", ");
    return textResponse(
      `No installation guide found for "${packageName}".\n\nAvailable packages: ${availablePackages}`
    );
  }

  // Format as detailed markdown
  const markdown = formatInstallGuideMarkdown(guide);
  return textResponse(markdown);
}

// ============================================================================
// Handler Registry
// ============================================================================

/**
 * Map of all tool handlers by name.
 * Use this for dynamic tool dispatch.
 */
export const toolHandlers: Record<string, (args: any) => ToolResponse> = {
  list_components: listComponents,
  get_component_docs: getComponentDocs,
  get_component_example: getComponentExample,
  search_components: searchComponents,
  get_component_types: getComponentTypes,
  get_component_examples_ts: getComponentExamplesTs,
  get_cli_usage: getCliUsage,
  search_icons: searchIcons,
  get_theme_types: getThemeTypes,
  get_navigation_types: getNavigationTypes,
  get_translate_guide: getTranslateGuide,
  get_storage_guide: getStorageGuide,
  list_packages: listPackages,
  get_package_docs: getPackageDocs,
  search_packages: searchPackages,
  list_recipes: listRecipes,
  get_recipe: getRecipe,
  search_recipes: searchRecipes,
  get_install_guide: getInstallGuide,
};

/**
 * Call a tool by name with arguments.
 * Returns a tool response or throws if the tool is not found.
 */
export function callTool(name: string, args: Record<string, unknown> = {}): ToolResponse {
  const handler = toolHandlers[name];

  if (!handler) {
    return textResponse(`Unknown tool: ${name}`);
  }

  return handler(args);
}
