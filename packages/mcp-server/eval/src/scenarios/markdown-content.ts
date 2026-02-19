import type { ComponentScenario } from "../types.js";

export const markdownContentScenario: ComponentScenario = {
  type: "component",
  id: "markdown-content",
  name: "Markdown Content Viewer",
  description:
    "Tests discovery and usage of @idealyst/markdown for rendering markdown with custom link/image handlers",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check package guides and component types before using them in code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a blog post viewer screen that renders markdown content. Requirements:

1. **Markdown Renderer** — Use @idealyst/markdown to render a blog post from a markdown string
2. **Custom Link Handling** — Implement a linkHandler that intercepts link taps: internal links (starting with /) should navigate using useNavigator, external links should open in the browser
3. **Custom Image Handling** — Implement an imageHandler that adds rounded corners and max-width constraints to images
4. **Style Overrides** — Customize the markdown typography: h1 should be larger, code blocks should have a dark background, blockquotes should have a left border
5. **Header Bar** — A top bar with the post title, a back button, and a "Share" icon button
6. **Loading State** — Show a Skeleton component while the markdown content is "loading"

Look up the markdown guide using get_markdown_guide to understand MarkdownProps, the linkHandler and imageHandler callback signatures, and style overrides. These are callback-based — do NOT guess the API.`,
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
