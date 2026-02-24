import type { ComponentScenario } from "../types.js";

export const oauthConfigLoginScenario: ComponentScenario = {
  type: "component",
  id: "oauth-config-login",
  name: "OAuth Login with Config & Storage",
  description:
    "Tests integration of @idealyst/oauth-client, @idealyst/config, and @idealyst/storage for a complete auth flow",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a login screen with social OAuth authentication. Requirements:

1. **Environment Config** — Read API_URL and OAUTH_REDIRECT_URL from environment variables
2. **OAuth Clients** — Set up Google and Apple OAuth clients
3. **Auth Flow** — When a user taps "Sign in with Google" or "Sign in with Apple", initiate the OAuth authorization flow
4. **Session Storage** — After successful auth, persist the auth credentials locally
5. **UI** — Social login buttons with icons, a loading indicator while authenticating, and error display
6. **Error Handling** — Catch auth errors and display them appropriately

Discover what packages are available for OAuth, configuration, and storage using the MCP tools.`,
  expectedToolUsage: [
    "get_oauth_client_guide",
    "get_config_guide",
    "get_storage_guide",
    "get_component_docs",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/oauth-client['"]/,
    /import.*from\s+['"]@idealyst\/config['"]/,
    /import.*from\s+['"]@idealyst\/storage['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /createOAuthClient/,
    /config\.get|config\.getRequired/,
    /storage\.setItem|storage\.getItem/,
  ],
  expectedFiles: {
    "LoginScreen.tsx":
      "OAuth login screen with Google/Apple auth, config-driven URLs, and storage persistence",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: [
    "packages",
    "oauth",
    "config",
    "storage",
    "multi-package",
    "cross-platform",
  ],
};
