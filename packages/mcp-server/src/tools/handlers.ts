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
  findComponentName,
} from "../data/component-metadata.js";
import { cliCommands } from "../data/cli-commands.js";
import { translateGuides } from "../data/translate-guides.js";
import { storageGuides } from "../data/storage-guides.js";
import { audioGuides } from "../data/audio-guides.js";
import { cameraGuides } from "../data/camera-guides.js";
import { filesGuides } from "../data/files-guides.js";
import { oauthClientGuides } from "../data/oauth-client-guides.js";
import { animateGuides } from "../data/animate-guides.js";
import { datagridGuides } from "../data/datagrid-guides.js";
import { datepickerGuides } from "../data/datepicker-guides.js";
import { lottieGuides } from "../data/lottie-guides.js";
import { markdownGuides } from "../data/markdown-guides.js";
import { configGuides } from "../data/config-guides.js";
import { chartsGuides } from "../data/charts-guides.js";
import { clipboardGuides } from "../data/clipboard-guides.js";
import { biometricsGuides } from "../data/biometrics-guides.js";
import { paymentsGuides } from "../data/payments-guides.js";
import { notificationsGuides } from "../data/notifications-guides.js";
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
} from "../data/recipes/index.js";
import {
  installGuides,
  getInstallGuide as getInstallGuideData,
  formatInstallGuideMarkdown,
} from "../data/install-guides.js";
import { idealystIntro } from "../data/intro.js";
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
  GetNotificationsGuideArgs,
  ListPackagesArgs,
  GetPackageDocsArgs,
  SearchPackagesArgs,
  ListRecipesArgs,
  GetRecipeArgs,
  SearchRecipesArgs,
  GetInstallGuideArgs,
  GetIntroArgs,
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
  const inputName = args.component;
  const canonicalName = findComponentName(inputName);

  if (!canonicalName) {
    return textResponse(
      `Component "${inputName}" not found. Available components: ${getComponentNames().join(", ")}`
    );
  }

  const meta = getComponentMetadata(canonicalName)!;

  // Get TypeScript types for props documentation
  let propsSection = "";
  try {
    const types = getTypesFromFile(canonicalName, "typescript");
    propsSection = `## Props (TypeScript)

\`\`\`typescript
${types.typescript}
\`\`\``;
  } catch {
    propsSection = "## Props\n\n_Types not available. Run `yarn extract-types` to generate._";
  }

  // Get type-checked examples
  let examplesSection = "";
  const examples = getComponentExamplesFromFile(canonicalName);
  if (examples) {
    examplesSection = `## Examples

\`\`\`tsx
${examples}
\`\`\``;
  }

  // Add component-specific warnings
  let warningSection = "";
  if (canonicalName === "Card") {
    warningSection = `
## WARNING: No Compound Components

Card is a **simple container** component. There are NO sub-components like \`Card.Content\`, \`Card.Header\`, \`Card.Body\`, \`Card.Footer\`, or \`Card.Title\`. Using these will cause TS2339 errors.

**Correct usage:** Put children directly inside \`<Card>...</Card>\`:
\`\`\`tsx
<Card padding="md">
  <Text typography="h6" weight="bold">Title</Text>
  <Text typography="body2">Body content</Text>
  <Button onPress={handler}>Action</Button>
</Card>
\`\`\`
`;
  }

  const docs = `# ${canonicalName}

${meta.description}
${warningSection}
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
  const inputName = args.component;
  const canonicalName = findComponentName(inputName);

  if (!canonicalName) {
    return textResponse(`Component "${inputName}" not found.`);
  }

  const examples = getComponentExamplesFromFile(canonicalName);
  if (!examples) {
    return textResponse(
      `No examples found for "${canonicalName}". Examples are in packages/mcp-server/examples/components/${canonicalName}.examples.tsx`
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
  const componentInput = args.component;
  const format = args.format || "both";

  // Support comma-separated batch lookups: "Button,Card,Text"
  const names = componentInput.split(",").map(s => s.trim()).filter(Boolean);

  if (names.length > 1) {
    // Batch mode: return all requested component types in one response
    const batchResult: Record<string, unknown> = {};
    const errors: string[] = [];

    for (const name of names) {
      try {
        const result = getTypesFromFile(name, format);
        const processed = postProcessComponentTypes(name, result);
        batchResult[name] = processed;
      } catch (error) {
        errors.push(`${name}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    if (errors.length > 0) {
      (batchResult as any)._errors = errors;
    }

    return jsonResponse(batchResult);
  }

  // Single component mode (original behavior)
  const componentName = names[0] || componentInput;

  try {
    const result = getTypesFromFile(componentName, format);
    const processed = postProcessComponentTypes(componentName, result);
    return jsonResponse(processed);
  } catch (error) {
    return textResponse(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Post-process component types to add guidance notes and truncate large payloads
 */
function postProcessComponentTypes(componentName: string, result: unknown): unknown {
  // Truncate Icon's massive IconName values list (7,447 entries → ~10 examples + note)
  if (componentName.toLowerCase() === 'icon' && typeof result === 'object' && result !== null) {
    const r = result as any;
    if (r.registry?.props?.name?.values && Array.isArray(r.registry.props.name.values)) {
      const total = r.registry.props.name.values.length;
      r.registry.props.name.values = [
        ...r.registry.props.name.values.slice(0, 10),
        `... and ${total - 10} more. Use search_icons to find specific icon names.`,
      ];
    }
    if (r.schema?.props && Array.isArray(r.schema.props)) {
      for (const prop of r.schema.props) {
        if (prop.name === 'name' && Array.isArray(prop.values) && prop.values.length > 20) {
          const total = prop.values.length;
          prop.values = [
            ...prop.values.slice(0, 10),
            `... and ${total - 10} more. Use search_icons to find specific icon names.`,
          ];
        }
      }
    }
  }

  // Add Card-specific guidance to prevent compound component hallucination
  if (componentName.toLowerCase() === 'card') {
    if (typeof result === 'object' && result !== null) {
      (result as any).usageNote = "Card is a SIMPLE CONTAINER — there are NO compound components. " +
        "Do NOT use Card.Content, Card.Header, Card.Body, Card.Footer, Card.Title — they do NOT exist and will cause TS2339. " +
        "Just put children directly inside <Card>...</Card>. Example: <Card padding=\"md\"><Text>Title</Text><Text>Body</Text></Card>";
    }
  }

  // Note: IconName guidance is covered in get_intro and search_icons responses.
  // Avoid adding verbose notes to every component — it creates noise in batch responses.

  return result;
}

/**
 * Get validated TypeScript examples for a component
 *
 * These examples are type-checked against the actual component props
 * to ensure they compile and are correct.
 */
export function getComponentExamplesTs(args: GetComponentExamplesTsArgs): ToolResponse {
  const inputName = args.component;
  const canonicalName = findComponentName(inputName);

  try {
    // If component name is not recognized in metadata, still try to find examples
    const lookupName = canonicalName || inputName;
    const examples = getComponentExamplesFromFile(lookupName);
    if (!examples) {
      const availableComponents = getAvailableComponents();
      return textResponse(
        `No TypeScript examples found for component "${inputName}". Available components with examples: ${availableComponents.join(", ")}`
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
/**
 * Icon search term aliases — maps common search terms to their MDI equivalents.
 * Agents often search for generic terms; this maps them to actual icon names.
 */
const iconSearchAliases: Record<string, string[]> = {
  back: ['arrow-left', 'chevron-left'],
  forward: ['arrow-right', 'chevron-right'],
  next: ['arrow-right', 'chevron-right', 'skip-next'],
  previous: ['arrow-left', 'chevron-left', 'skip-previous'],
  user: ['account'],
  profile: ['account', 'account-circle'],
  search: ['magnify'],
  settings: ['cog'],
  password: ['lock', 'key'],
  mail: ['email'],
  notification: ['bell'],
  notifications: ['bell'],
  spinner: ['loading'],
  send: ['send'],
  save: ['content-save'],
  edit: ['pencil'],
  copy: ['content-copy'],
  paste: ['content-paste'],
  trash: ['delete'],
  remove: ['delete', 'close'],
  add: ['plus'],
  create: ['plus'],
  photo: ['camera', 'image'],
  picture: ['image'],
  like: ['heart', 'thumb-up'],
  favorite: ['heart', 'star'],
  error: ['alert-circle', 'close-circle'],
  warning: ['alert'],
  success: ['check-circle'],
  info: ['information'],
  expand: ['chevron-down'],
  collapse: ['chevron-up'],
  more: ['dots-vertical', 'dots-horizontal'],
  options: ['dots-vertical'],
  refresh: ['refresh'],
  reload: ['refresh'],
  dark: ['weather-night'],
  light: ['weather-sunny', 'white-balance-sunny'],
  theme: ['theme-light-dark', 'palette'],
  phone: ['phone', 'cellphone'],
  call: ['phone', 'phone-outline'],
  check: ['check', 'check-circle', 'check-bold'],
  tick: ['check', 'check-circle'],
  close: ['close', 'close-circle'],
  dismiss: ['close', 'close-circle'],
  x: ['close'],
  lock: ['lock', 'lock-outline'],
  security: ['lock', 'shield'],
  eye: ['eye', 'eye-off', 'eye-outline'],
  visibility: ['eye', 'eye-off'],
  sort: ['sort', 'sort-ascending', 'sort-descending'],
  filter: ['filter', 'filter-outline'],
  calendar: ['calendar', 'calendar-month'],
  date: ['calendar', 'calendar-month'],
  location: ['map-marker', 'map-marker-outline'],
  pin: ['map-marker', 'pin'],
  share: ['share', 'share-variant'],
  download: ['download', 'cloud-download'],
  upload: ['upload', 'cloud-upload'],
  play: ['play', 'play-circle'],
  pause: ['pause', 'pause-circle'],
  stop: ['stop', 'stop-circle'],
  record: ['record', 'microphone'],
  microphone: ['microphone', 'microphone-outline'],
  mic: ['microphone', 'microphone-outline'],
  menu: ['menu', 'hamburger'],
  list: ['format-list-bulleted', 'view-list'],
  grid: ['view-grid', 'grid'],
  time: ['clock', 'clock-outline'],
  clock: ['clock', 'clock-outline'],
  link: ['link', 'link-variant'],
  attach: ['paperclip', 'attachment'],
  logout: ['logout', 'exit-to-app'],
  login: ['login', 'account-arrow-right'],
  flash: ['flash', 'flash-off', 'flash-auto'],
  home: ['home', 'home-outline', 'home-variant'],
  house: ['home', 'home-outline', 'home-variant'],
  money: ['currency-usd', 'cash', 'cash-multiple', 'wallet'],
  currency: ['currency-usd', 'currency-eur', 'currency-gbp'],
  dollar: ['currency-usd'],
  trending: ['trending-up', 'trending-down', 'chart-line'],
  chart: ['chart-line', 'chart-bar', 'chart-pie', 'chart-donut'],
  graph: ['chart-line', 'chart-bar', 'chart-areaspline'],
  gallery: ['image-multiple', 'view-gallery'],
  image: ['image', 'image-outline', 'image-multiple'],
  cart: ['cart', 'cart-outline', 'cart-plus', 'cart-check'],
  shopping: ['cart', 'shopping', 'basket'],
  wifi: ['wifi', 'wifi-off'],
  bluetooth: ['bluetooth', 'bluetooth-off'],
  volume: ['volume-high', 'volume-medium', 'volume-low', 'volume-off'],
  sound: ['volume-high', 'volume-off', 'music'],
  music: ['music', 'music-note'],
  video: ['video', 'video-outline', 'video-off'],
  file: ['file', 'file-outline', 'file-document'],
  folder: ['folder', 'folder-outline', 'folder-open'],
  document: ['file-document', 'file-document-outline'],
  print: ['printer', 'printer-outline'],
  help: ['help-circle', 'help-circle-outline'],
  question: ['help-circle', 'help-circle-outline'],
  swap: ['swap-horizontal', 'swap-vertical'],
  sync: ['sync', 'cloud-sync'],
  crop: ['crop', 'crop-free'],
  rotate: ['rotate-left', 'rotate-right', 'screen-rotation'],
  fullscreen: ['fullscreen', 'fullscreen-exit'],
  minus: ['minus', 'minus-circle'],
  plus: ['plus', 'plus-circle'],
  brightness: ['brightness-5', 'brightness-6', 'brightness-7'],
  language: ['translate', 'web'],
  globe: ['earth', 'web'],
  world: ['earth', 'web'],
};

export function searchIcons(args: SearchIconsArgs): ToolResponse {
  const query = args.query?.toLowerCase() || "";
  const limit = args.limit || 40;

  if (!query) {
    return textResponse("Please provide a search query.");
  }

  // Resolve aliases: if the query is a known alias, include those icons directly
  const aliasMatches: string[] = [];
  const queryWords = query.split(/\s+/).filter(Boolean);
  for (const word of queryWords) {
    const aliases = iconSearchAliases[word];
    if (aliases) {
      for (const alias of aliases) {
        // Find all icons that match the alias using boundary matching
        for (const icon of iconsData.icons) {
          const lower = (icon as string).toLowerCase();
          if (lower === alias || lower.startsWith(alias + '-')) {
            if (!aliasMatches.includes(icon as string)) {
              aliasMatches.push(icon as string);
            }
          }
        }
      }
    }
  }

  // Filter icons that match the query
  // Use word-boundary matching: split icon names on hyphens, match query words against segments.
  // This prevents "lock" from matching "clock", "ash" from matching "flash", etc.
  const hyphenatedQuery = queryWords.join("-");

  // Helper: check if an icon matches a single word on segment boundaries
  const matchesWord = (segments: string[], word: string) =>
    segments.some((seg) => seg === word || seg.startsWith(word));

  // Helper: check if an icon matches the full hyphenated query on boundaries
  const matchesHyphenated = (lower: string) => {
    if (!lower.includes(hyphenatedQuery)) return false;
    const idx = lower.indexOf(hyphenatedQuery);
    const before = idx === 0 || lower[idx - 1] === "-";
    const after =
      idx + hyphenatedQuery.length === lower.length ||
      lower[idx + hyphenatedQuery.length] === "-";
    return before && after;
  };

  // First pass: AND match (all words must match)
  const andMatches: string[] = [];
  // Second pass: OR match (any word matches) — used as fallback for multi-word queries
  const orOnlyMatches: string[] = [];

  for (const icon of iconsData.icons) {
    const lower = (icon as string).toLowerCase();
    const segments = lower.split("-");

    if (matchesHyphenated(lower)) {
      andMatches.push(icon as string);
    } else if (queryWords.every((word) => matchesWord(segments, word))) {
      andMatches.push(icon as string);
    } else if (queryWords.length > 1 && queryWords.some((word) => matchesWord(segments, word))) {
      orOnlyMatches.push(icon as string);
    }
  }

  // Combine: alias matches first, then AND matches, then OR matches (deduplicated)
  const seen = new Set<string>();
  const matchingIcons: string[] = [];
  for (const list of [aliasMatches, andMatches, orOnlyMatches]) {
    for (const icon of list) {
      if (!seen.has(icon)) {
        seen.add(icon);
        matchingIcons.push(icon);
      }
    }
  }

  // Sort by relevance: alias matches first, then AND matches, then OR matches.
  // Within each tier, shorter names (more specific) first, then alphabetical.
  const aliasMatchSet = new Set(aliasMatches);
  const andMatchSet = new Set(andMatches);
  matchingIcons.sort((a: string, b: string) => {
    // Tier: alias (0) > AND (1) > OR (2)
    const aTier = aliasMatchSet.has(a) ? 0 : andMatchSet.has(a) ? 1 : 2;
    const bTier = aliasMatchSet.has(b) ? 0 : andMatchSet.has(b) ? 1 : 2;
    if (aTier !== bTier) return aTier - bTier;

    // Icons that START with the query get highest priority
    const aStarts = a.startsWith(hyphenatedQuery) ? 0 : 1;
    const bStarts = b.startsWith(hyphenatedQuery) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    // Then sort by number of segments (fewer = more specific)
    const aSegments = a.split("-").length;
    const bSegments = b.split("-").length;
    if (aSegments !== bSegments) return aSegments - bSegments;
    // Then alphabetical
    return a.localeCompare(b);
  });

  // Limit results
  const limitedResults = matchingIcons.slice(0, limit);

  const result = {
    query,
    total: iconsData.total,
    matches: matchingIcons.length,
    returned: limitedResults.length,
    icons: limitedResults,
    import: "import { Icon } from '@idealyst/components'; import type { IconName } from '@idealyst/components';",
    usage: "IMPORTANT: These icon names are of type `IconName` from '@idealyst/components'. Use them WITHOUT any 'mdi:' prefix — just use the bare name (e.g., 'home', not 'mdi:home'). When building helper functions that return icon names, always type the return as `IconName` — never as `string`. Example: `const icon: IconName = 'home'; function getIcon(status: string): IconName { return 'check'; }`. Using `string` as the return type or adding an 'mdi:' prefix will cause TypeScript compilation errors.",
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
    // Add useTheme usage note to prevent common destructuring mistake
    if (typeof result === 'object' && result !== null) {
      (result as Record<string, unknown>).useThemeNote =
        "IMPORTANT: useTheme() returns Theme directly — NOT wrapped in an object. " +
        "Correct: `const theme = useTheme();` " +
        "WRONG: `const { theme } = useTheme();` (causes TS2339). " +
        "Theme top-level keys: intents, radii, shadows, colors, sizes, interaction, breakpoints. " +
        "For spacing, use component props (padding=\"md\", gap=\"md\") — NOT theme.spacing (does NOT exist). " +
        "For colors: `style={{ backgroundColor: theme.colors.surface.primary }}`. " +
        "For radii: `style={{ borderRadius: theme.radii.md }}`. " +
        "For intents: `theme.intents.primary` (NOT theme.colors.intent).";
    }
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
  let topic = args.topic;

  // Allow 'api' as alias for 'runtime-api' (consistent with other guide tools)
  if (topic === 'api') {
    topic = 'runtime-api';
  }

  const uri = `idealyst://translate/${topic}`;
  const guide = translateGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, runtime-api (or 'api'), babel-plugin, translation-files, examples`
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
      `Topic "${topic}" not found. Available topics: overview, api, examples, secure`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the audio package
 */
export function getAudioGuide(args: GetAudioGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://audio/${topic}`;
  const guide = audioGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the camera package
 */
export function getCameraGuide(args: GetCameraGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://camera/${topic}`;
  const guide = cameraGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the files package
 */
export function getFilesGuide(args: GetFilesGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://files/${topic}`;
  const guide = filesGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the oauth-client package
 */
export function getOauthClientGuide(args: GetOauthClientGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://oauth-client/${topic}`;
  const guide = oauthClientGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the animate package
 */
export function getAnimateGuide(args: GetAnimateGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://animate/${topic}`;
  const guide = animateGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the datagrid package
 */
export function getDatagridGuide(args: GetDatagridGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://datagrid/${topic}`;
  const guide = datagridGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the datepicker package
 */
export function getDatepickerGuide(args: GetDatepickerGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://datepicker/${topic}`;
  const guide = datepickerGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the lottie package
 */
export function getLottieGuide(args: GetLottieGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://lottie/${topic}`;
  const guide = lottieGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the markdown package
 */
export function getMarkdownGuide(args: GetMarkdownGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://markdown/${topic}`;
  const guide = markdownGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the config package
 */
export function getConfigGuide(args: GetConfigGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://config/${topic}`;
  const guide = configGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the charts package
 */
export function getChartsGuide(args: GetChartsGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://charts/${topic}`;
  const guide = chartsGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the clipboard package
 */
export function getClipboardGuide(args: GetClipboardGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://clipboard/${topic}`;
  const guide = clipboardGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the biometrics package
 */
export function getBiometricsGuide(args: GetBiometricsGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://biometrics/${topic}`;
  const guide = biometricsGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the payments package
 */
export function getPaymentsGuide(args: GetPaymentsGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://payments/${topic}`;
  const guide = paymentsGuides[uri];

  if (!guide) {
    return textResponse(
      `Topic "${topic}" not found. Available topics: overview, api, examples`
    );
  }

  return textResponse(guide);
}

/**
 * Get documentation for the notifications package
 */
export function getNotificationsGuide(args: GetNotificationsGuideArgs): ToolResponse {
  const topic = args.topic;
  const uri = `idealyst://notifications/${topic}`;
  const guide = notificationsGuides[uri];

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
    const allRecipeIds = Object.keys(recipes);
    return textResponse(
      `No recipes found matching "${query}". Available recipes: ${allRecipeIds.join(', ')}. Try searching by category (auth, forms, navigation, settings, layout, data, media) or use list_recipes to see all.`
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
// Intro Tool Handlers
// ============================================================================

/**
 * Get a comprehensive introduction to the Idealyst framework
 */
export function getIntro(_args: GetIntroArgs = {}): ToolResponse {
  return textResponse(idealystIntro);
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
  get_audio_guide: getAudioGuide,
  get_camera_guide: getCameraGuide,
  get_files_guide: getFilesGuide,
  get_oauth_client_guide: getOauthClientGuide,
  get_animate_guide: getAnimateGuide,
  get_datagrid_guide: getDatagridGuide,
  get_datepicker_guide: getDatepickerGuide,
  get_lottie_guide: getLottieGuide,
  get_markdown_guide: getMarkdownGuide,
  get_config_guide: getConfigGuide,
  get_charts_guide: getChartsGuide,
  get_clipboard_guide: getClipboardGuide,
  get_biometrics_guide: getBiometricsGuide,
  get_payments_guide: getPaymentsGuide,
  get_notifications_guide: getNotificationsGuide,
  list_packages: listPackages,
  get_package_docs: getPackageDocs,
  search_packages: searchPackages,
  list_recipes: listRecipes,
  get_recipe: getRecipe,
  search_recipes: searchRecipes,
  get_install_guide: getInstallGuide,
  get_intro: getIntro,
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
