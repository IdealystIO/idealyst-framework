export const cliCommands: Record<string, any> = {
  init: {
    description: "Initialize a new Idealyst workspace with monorepo structure",
    usage: "idealyst init <workspace-name> [options]",
    options: [
      {
        flag: "workspace-name",
        description: "Name for the new workspace (required)",
      },
      {
        flag: "--git",
        description: "Initialize git repository (default: true)",
      },
      {
        flag: "--install",
        description: "Install dependencies after creation (default: true)",
      },
    ],
    examples: [
      "idealyst init my-app",
      "idealyst init my-company-workspace --no-git",
    ],
  },

  create: {
    description: "Create a new package within the Idealyst workspace",
    usage: "idealyst create <name> --type <type> [options]",
    options: [
      {
        flag: "name",
        description: "Name for the new package (required)",
      },
      {
        flag: "--type",
        description: "Package type: web | native | api | database | shared (required)",
      },
      {
        flag: "--app-name",
        description: "Display name for native app (required for native type)",
      },
      {
        flag: "--with-trpc",
        description: "Include tRPC setup (for web/native)",
      },
      {
        flag: "--no-trpc",
        description: "Exclude tRPC setup (for web/native)",
      },
    ],
    examples: [
      "idealyst create web --type web --with-trpc",
      "idealyst create mobile --type native --app-name \"My App\" --with-trpc",
      "idealyst create api --type api",
      "idealyst create database --type database",
      "idealyst create shared --type shared",
    ],
  },

  dev: {
    description: "Start development server for a package",
    usage: "cd packages/<name> && yarn dev",
    options: [
      {
        flag: "--port",
        description: "Port number for dev server (web only)",
      },
    ],
    examples: [
      "cd packages/web && yarn dev",
      "cd packages/native && yarn dev",
    ],
  },

  build: {
    description: "Build a package for production",
    usage: "cd packages/<name> && yarn build",
    options: [],
    examples: [
      "cd packages/web && yarn build",
      "cd packages/api && yarn build",
    ],
  },

  test: {
    description: "Run tests for packages",
    usage: "yarn test [options]",
    options: [
      {
        flag: "--watch",
        description: "Run tests in watch mode",
      },
      {
        flag: "--coverage",
        description: "Generate coverage report",
      },
    ],
    examples: [
      "yarn test",
      "yarn test:watch",
      "yarn test:coverage",
    ],
  },
};
