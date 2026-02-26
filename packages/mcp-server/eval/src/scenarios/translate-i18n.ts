import type { ComponentScenario } from "../types.js";

export const translateI18nScenario: ComponentScenario = {
  type: "component",
  id: "translate-i18n",
  name: "Translation & i18n Setup",
  description:
    "Tests whether the agent can set up @idealyst/translate with TranslateProvider, language switching, and pluralization",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a language switcher settings screen with full internationalization. Requirements:

1. **TranslateProvider Setup** — Wrap the app with TranslateProvider configured for English and Spanish, with English as the default language
2. **Translation Resources** — Define translation resource objects for both languages with at least: greeting, settings title, language label, item count (with pluralization), and a description paragraph
3. **Language Switcher** — Buttons or a toggle to switch between English and Spanish using useLanguage/setLanguage
4. **Translated Content** — Display translated text using useTranslation and the t() function, including:
   - A greeting message
   - Section headers
   - An interpolated string (e.g., "Welcome, {{name}}")
   - A pluralized string (e.g., "1 item" vs "3 items")
5. **Display Name** — Show the current language display name using getDisplayName

Look up the translate package documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_translate_guide",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/translate['"]/,
    /TranslateProvider/,
    /useTranslation/,
    /useLanguage/,
    /setLanguage/,
    /getDisplayName/,
  ],
  expectedFiles: {
    "TranslatedSettingsScreen.tsx":
      "Settings screen with language switching, translated content, and pluralization",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["translate", "i18n", "packages"],
};
