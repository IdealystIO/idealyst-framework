import type { ComponentScenario } from "../types.js";

export const storageTodoCrudScenario: ComponentScenario = {
  type: "component",
  id: "storage-todo-crud",
  name: "Storage CRUD Todo List",
  description:
    "Tests whether the agent can use @idealyst/storage for persistent CRUD operations in a todo list",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a todo list screen with local persistence using the storage package. Requirements:

1. **Add Todos** — A text input and "Add" button to create new todo items
2. **Toggle Complete** — Tap a todo to toggle its completed state (with visual strikethrough)
3. **Delete Todos** — A delete button/icon on each todo item
4. **Persist to Storage** — Save the todo list to local storage on every change using JSON serialization
5. **Load from Storage** — Load the saved todo list from storage on mount, handle null (first launch) gracefully
6. **Empty State** — Show a friendly empty state message when there are no todos
7. **Typed Data** — Define a TypeScript interface for the todo item (id, text, completed)

Look up the storage package documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_storage_guide",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/storage['"]/,
    /storage\.setItem|storage\.getItem/,
    /JSON\.stringify/,
    /JSON\.parse/,
    /useEffect/,
    /useState/,
    /todo|Todo/i,
  ],
  expectedFiles: {
    "TodoScreen.tsx":
      "Todo list screen with CRUD operations and storage persistence",
  },
  maxTurns: 50,
  difficulty: "basic",
  tags: ["storage", "packages", "crud"],
};
