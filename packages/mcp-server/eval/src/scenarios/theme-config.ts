import type { ComponentScenario } from "../types.js";

export const themeConfigScenario: ComponentScenario = {
  type: "component",
  id: "theme-config",
  name: "Theme Configuration & Preview",
  description:
    "Tests whether the agent can properly configure themes using configureThemes/fromTheme and build a theme preview screen",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a theme configuration module and a theme preview screen. Two files required:

**File 1: themeSetup.ts** (configuration module)
- Import lightTheme and darkTheme from @idealyst/theme
- Use fromTheme() to create built theme variants from both
- Call configureThemes() with both themes configured
- Export the setup so it can be called at app initialization

**File 2: ThemePreviewScreen.tsx** (preview UI)
- Display the current theme name
- A toggle button to switch between light and dark themes using ThemeSettings.setTheme()
- Color swatches showing all intent colors (from theme.intents) — render a colored View for each intent
- Surface color samples (from theme.colors.surface) — show primary, secondary, etc.
- Text color samples (from theme.colors.text)
- Typography samples at different sizes
- Use useTheme() to access the current theme (it returns the theme directly, NOT destructured)

Look up the theme types documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_theme_types",
    "get_component_types",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/theme['"]/,
    /configureThemes/,
    /fromTheme/,
    /ThemeSettings/,
    /setTheme/,
    /useTheme/,
    /lightTheme|darkTheme/,
    /\.build\(\)/,
    /theme\.intents/,
    /theme\.colors/,
  ],
  expectedFiles: {
    "themeSetup.ts": "Theme configuration module with configureThemes and fromTheme",
    "ThemePreviewScreen.tsx":
      "Theme preview screen with swatches, toggle, and typography samples",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["theme", "configuration", "dark-mode"],
};
