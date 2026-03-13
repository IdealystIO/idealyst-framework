import type { ComponentScenario } from "../types.js";

export const scrollviewContentScenario: ComponentScenario = {
  type: "component",
  id: "scrollview-content",
  name: "ScrollView Long-Form Content",
  description:
    "Tests whether the agent can use the ScrollView component for scrollable content with scroll events and imperative controls",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build an article reader screen with scrollable content. Requirements:

1. **ScrollView Layout** — Use the ScrollView component from @idealyst/components for the main scrollable area. Do NOT use \`<View scrollable>\` which is deprecated.
2. **Article Header** — A title (Text with h2 typography), author name, and publication date at the top
3. **Article Body** — Multiple paragraphs of content (at least 5 paragraphs of placeholder text) separated by spacing
4. **Scroll Progress** — Track scroll position using onScroll and display a simple progress indicator at the top (e.g., "Reading: 45%" text) that updates as the user scrolls through the content
5. **Scroll-to-Top Button** — An IconButton that appears (use state) and scrolls back to top using the ScrollView ref's scrollToStart method. Use useRef to get the ScrollView ref.
6. **Related Articles** — At the bottom, show 3 related article Cards with title and a "Read More" button
7. **Infinite Scroll Hint** — Use the onEndReached callback to set a state flag that shows "You've reached the end!" text at the bottom

Look up the ScrollView and other component types using the MCP tools.`,
  expectedToolUsage: [
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /ScrollView/,
    /onScroll/,
    /scrollToStart|scrollToEnd|scrollTo/,
    /useRef/,
    /onEndReached/,
    /Card/,
    /Button|IconButton/,
  ],
  expectedFiles: {
    "ArticleReaderScreen.tsx":
      "Article reader with ScrollView, scroll progress tracking, scroll-to-top, and onEndReached",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["components", "scrollview", "layout", "scroll-events"],
};
