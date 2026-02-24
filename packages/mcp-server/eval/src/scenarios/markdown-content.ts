import type { ComponentScenario } from "../types.js";

export const markdownContentScenario: ComponentScenario = {
  type: "component",
  id: "markdown-content",
  name: "Markdown Content Viewer",
  description:
    "Tests discovery and usage of @idealyst/markdown for rendering markdown with custom link/image handlers",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a blog post viewer screen that renders markdown content. Requirements:

1. **Markdown Rendering** — Render a blog post from a markdown string
2. **Custom Link Handling** — Internal links (starting with /) should navigate within the app, external links should open in the browser
3. **Custom Image Handling** — Images should have rounded corners and max-width constraints
4. **Style Overrides** — Customize the typography: h1 should be larger, code blocks should have a dark background, blockquotes should have a left border
5. **Header Bar** — A top bar with the post title, a back button, and a "Share" icon button
6. **Loading State** — Show a skeleton placeholder while the markdown content is "loading"

Discover what markdown rendering packages are available using the MCP tools.`,
  expectedToolUsage: [
    "get_markdown_guide",
    "get_component_docs",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/markdown['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Markdown/,
    /linkHandler|onLinkPress/i,
    /imageHandler|onImagePress/i,
    /Skeleton/,
  ],
  expectedFiles: {
    "BlogPostViewer.tsx":
      "Blog post viewer with markdown rendering, custom link/image handlers, and style overrides",
  },
  maxTurns: 50,
  difficulty: "basic",
  tags: ["packages", "markdown", "content", "cross-platform"],
};
