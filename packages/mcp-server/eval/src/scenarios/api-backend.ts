import type { ProjectScenario } from "../types.js";

export const apiBackendScenario: ProjectScenario = {
  type: "project",
  id: "api-backend",
  name: "tRPC/Prisma Backend Setup",
  description:
    "Tests agent setting up API routes and database schema in a scaffolded project with tRPC and Prisma",
  scaffoldCommands: [
    {
      command:
        "idealyst init eval-api --no-interactive --org-domain com.evaltest --app-name 'Eval API' --with-api --with-prisma --with-trpc --skip-install --blank",
      timeoutMs: 90_000,
    },
  ],
  systemPrompt: `You are a developer building a full-stack cross-platform app.
The project was scaffolded with a CLI and includes a tRPC API server and Prisma database layer.
You have MCP tools that provide framework documentation. Use them as needed.
Write files using the Write tool to the workspace path provided.`,
  taskPrompt: `Add a complete "todos" feature to this project:

1. **Database**: Define a Prisma model for Todo (id, title, completed, createdAt)
2. **API**: Create a tRPC router with CRUD operations (list, create, toggle, delete)
3. **Frontend**: Build a TodoList screen that:
   - Lists all todos with checkboxes
   - Has an input to add new todos
   - Has delete buttons on each todo
   - Shows loading states

Explore the project structure to understand where files should go.`,
  additionalAllowedTools: ["Bash", "Read", "Glob"],
  expectedToolUsage: [
    "get_component_docs",
    "search_packages",
    "list_components",
    "search_components",
  ],
  expectedOutputPatterns: [
    /prisma|Prisma/,
    /trpc|tRPC/,
    /Todo/,
    /import.*from\s+['"]@idealyst\/components['"]/,
  ],
  expectedFiles: {
    "schema.prisma": "Prisma schema with Todo model",
    "todo.ts": "tRPC router for todos",
    "TodoList.tsx": "TodoList UI component",
  },
  maxTurns: 60,
  difficulty: "advanced",
  tags: ["project", "api", "prisma", "trpc", "backend"],
};
