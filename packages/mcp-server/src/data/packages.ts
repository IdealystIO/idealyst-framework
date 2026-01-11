/**
 * Idealyst Framework Package Registry
 * Central metadata for all @idealyst packages
 */

export interface PackageInfo {
  name: string;
  npmName: string;
  description: string;
  category: "core" | "ui" | "media" | "data" | "auth" | "utility" | "tooling";
  platforms: ("web" | "native" | "node")[];
  documentationStatus: "full" | "partial" | "minimal";
  installation: string;
  peerDependencies?: string[];
  features: string[];
  quickStart: string;
  apiHighlights?: string[];
  relatedPackages?: string[];
}

export const packages: Record<string, PackageInfo> = {
  components: {
    name: "Components",
    npmName: "@idealyst/components",
    description:
      "Cross-platform React UI components for web and React Native. Includes buttons, cards, inputs, dialogs, and 30+ more components with consistent styling.",
    category: "core",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/components @idealyst/theme",
    peerDependencies: ["@idealyst/theme", "react-native-unistyles"],
    features: [
      "36+ production-ready components",
      "Consistent API across web and native",
      "Theme-aware with automatic dark mode",
      "Accessible by default",
      "TypeScript-first with full type definitions",
      "Tree-shakeable exports",
    ],
    quickStart: `import { Button, Card, Text } from '@idealyst/components';

<Card>
  <Text variant="headline">Hello World</Text>
  <Button onPress={() => console.log('Pressed!')}>
    Click Me
  </Button>
</Card>`,
    apiHighlights: [
      "Button, IconButton, FAB",
      "Card, View, Screen",
      "Input, Select, Checkbox, Switch",
      "Dialog, Popover, Menu",
      "Text, Link, Badge, Chip",
    ],
    relatedPackages: ["theme", "navigation"],
  },

  theme: {
    name: "Theme",
    npmName: "@idealyst/theme",
    description:
      "Cross-platform theming system built on react-native-unistyles. Provides colors, typography, spacing, and responsive breakpoints.",
    category: "core",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/theme react-native-unistyles",
    peerDependencies: ["react-native-unistyles"],
    features: [
      "Light and dark theme variants",
      "Semantic color tokens (intent-based)",
      "Responsive breakpoints",
      "Typography scale",
      "Spacing and sizing utilities",
      "Platform-specific adaptations",
    ],
    quickStart: `import { UnistylesProvider } from '@idealyst/theme';

<UnistylesProvider>
  <App />
</UnistylesProvider>`,
    apiHighlights: [
      "Size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      "Intent: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
      "Color: theme color tokens",
      "useStyles() hook for styling",
    ],
    relatedPackages: ["components"],
  },

  navigation: {
    name: "Navigation",
    npmName: "@idealyst/navigation",
    description:
      "Unified navigation system for web and React Native. Stack, tab, drawer, and modal navigators with type-safe routing.",
    category: "core",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/navigation",
    peerDependencies: ["@react-navigation/native (native only)"],
    features: [
      "Type-safe route definitions",
      "Stack, Tab, Drawer, Modal navigators",
      "Deep linking support",
      "Custom layouts for web (headers, sidebars)",
      "useNavigator hook for navigation actions",
      "Cross-platform URL handling",
    ],
    quickStart: `import { Router, useNavigator } from '@idealyst/navigation';

const routes = {
  home: { path: '/', screen: HomeScreen },
  profile: { path: '/profile/:id', screen: ProfileScreen },
};

<Router routes={routes} />`,
    apiHighlights: [
      "Router component",
      "useNavigator() hook",
      "Route configuration",
      "Navigator types (stack, tabs, drawer)",
    ],
    relatedPackages: ["components", "theme"],
  },

  cli: {
    name: "CLI",
    npmName: "@idealyst/cli",
    description:
      "Command-line tool for generating Idealyst projects. Creates monorepo workspaces with web, native, API, and database packages.",
    category: "tooling",
    platforms: ["node"],
    documentationStatus: "full",
    installation: "npx @idealyst/cli init my-project",
    features: [
      "Monorepo workspace generation",
      "React Native app scaffolding",
      "Vite-based web app generation",
      "tRPC API server template",
      "Prisma database layer",
      "Shared library template",
    ],
    quickStart: `# Create a new workspace
npx @idealyst/cli init my-app

# Add a native app
cd my-app
npx @idealyst/cli create mobile --type native --app-name "My App"

# Add a web app
npx @idealyst/cli create web --type web --with-trpc`,
    apiHighlights: [
      "idealyst init <name>",
      "idealyst create <name> --type native|web|api|database|shared",
    ],
    relatedPackages: ["components", "theme", "navigation"],
  },

  storage: {
    name: "Storage",
    npmName: "@idealyst/storage",
    description:
      "Cross-platform key-value storage with async API. Uses localStorage on web and AsyncStorage on React Native.",
    category: "data",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/storage",
    peerDependencies: ["@react-native-async-storage/async-storage (native)"],
    features: [
      "Unified API across platforms",
      "Async/await interface",
      "JSON serialization built-in",
      "TypeScript generics for type safety",
      "Prefix namespacing",
    ],
    quickStart: `import { storage } from '@idealyst/storage';

// Store a value
await storage.set('user', { name: 'Alice', id: 1 });

// Retrieve a value
const user = await storage.get<User>('user');

// Remove a value
await storage.remove('user');`,
    apiHighlights: [
      "storage.get<T>(key)",
      "storage.set(key, value)",
      "storage.remove(key)",
      "storage.clear()",
    ],
    relatedPackages: ["oauth-client", "config"],
  },

  translate: {
    name: "Translate",
    npmName: "@idealyst/translate",
    description:
      "Internationalization (i18n) package with runtime API and Babel plugin for static key extraction.",
    category: "utility",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/translate",
    features: [
      "TranslateProvider for app-wide i18n",
      "useTranslation hook",
      "Interpolation support",
      "Pluralization",
      "Babel plugin for key extraction",
      "Missing translation detection",
    ],
    quickStart: `import { TranslateProvider, useTranslation } from '@idealyst/translate';

function App() {
  return (
    <TranslateProvider translations={translations} defaultLanguage="en">
      <MyComponent />
    </TranslateProvider>
  );
}

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('greeting', { name: 'World' })}</Text>;
}`,
    apiHighlights: [
      "TranslateProvider",
      "useTranslation()",
      "useLanguage()",
      "Trans component",
    ],
    relatedPackages: ["components"],
  },

  camera: {
    name: "Camera",
    npmName: "@idealyst/camera",
    description:
      "Cross-platform camera component for photo and video capture. Uses react-native-vision-camera on native and MediaDevices API on web.",
    category: "media",
    platforms: ["web", "native"],
    documentationStatus: "minimal",
    installation: "yarn add @idealyst/camera react-native-vision-camera",
    peerDependencies: ["react-native-vision-camera (native)"],
    features: [
      "Photo capture",
      "Video recording",
      "Camera switching (front/back)",
      "Flash control",
      "Zoom support",
      "Permission handling",
    ],
    quickStart: `import { Camera, useCameraPermission } from '@idealyst/camera';

function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();

  if (!hasPermission) {
    return <Button onPress={requestPermission}>Grant Permission</Button>;
  }

  return (
    <Camera
      onCapture={(photo) => console.log('Photo taken:', photo)}
    />
  );
}`,
    apiHighlights: [
      "Camera component",
      "useCameraPermission()",
      "useCamera()",
      "Photo/Video capture callbacks",
    ],
    relatedPackages: ["components", "storage"],
  },

  microphone: {
    name: "Microphone",
    npmName: "@idealyst/microphone",
    description:
      "Cross-platform microphone streaming for real-time audio capture. Provides PCM audio data for processing or streaming.",
    category: "media",
    platforms: ["web", "native"],
    documentationStatus: "minimal",
    installation: "yarn add @idealyst/microphone",
    peerDependencies: ["react-native-live-audio-stream (native)"],
    features: [
      "Real-time audio streaming",
      "PCM audio format",
      "Configurable sample rate",
      "Permission handling",
      "Start/stop controls",
      "Audio level monitoring",
    ],
    quickStart: `import { useMicrophone } from '@idealyst/microphone';

function AudioRecorder() {
  const { start, stop, isRecording, audioData } = useMicrophone({
    sampleRate: 16000,
    onAudioData: (pcmData) => {
      // Process or stream audio data
    },
  });

  return (
    <Button onPress={isRecording ? stop : start}>
      {isRecording ? 'Stop' : 'Record'}
    </Button>
  );
}`,
    apiHighlights: [
      "useMicrophone() hook",
      "MicrophoneProvider",
      "Audio streaming callbacks",
      "Sample rate configuration",
    ],
    relatedPackages: ["camera", "components"],
  },

  datagrid: {
    name: "DataGrid",
    npmName: "@idealyst/datagrid",
    description:
      "High-performance virtualized data grid for large datasets. Supports sorting, filtering, and custom cell rendering.",
    category: "data",
    platforms: ["web", "native"],
    documentationStatus: "minimal",
    installation: "yarn add @idealyst/datagrid @idealyst/components @idealyst/theme",
    peerDependencies: [
      "@idealyst/components",
      "@idealyst/theme",
      "react-window (web)",
    ],
    features: [
      "Virtualized rendering for large datasets",
      "Column sorting",
      "Row selection",
      "Custom cell renderers",
      "Fixed headers",
      "Responsive column sizing",
    ],
    quickStart: `import { DataGrid } from '@idealyst/datagrid';

const columns = [
  { key: 'name', header: 'Name', width: 200 },
  { key: 'email', header: 'Email', width: 250 },
  { key: 'status', header: 'Status', width: 100 },
];

<DataGrid
  data={users}
  columns={columns}
  onRowClick={(row) => console.log('Selected:', row)}
/>`,
    apiHighlights: [
      "DataGrid component",
      "Column configuration",
      "Row selection callbacks",
      "Custom cell renderers",
    ],
    relatedPackages: ["components", "theme"],
  },

  datepicker: {
    name: "DatePicker",
    npmName: "@idealyst/datepicker",
    description:
      "Cross-platform date and time picker components. Includes calendar, time picker, and date range selection.",
    category: "ui",
    platforms: ["web", "native"],
    documentationStatus: "minimal",
    installation: "yarn add @idealyst/datepicker @idealyst/theme",
    peerDependencies: ["@idealyst/theme"],
    features: [
      "Date picker with calendar",
      "Time picker",
      "Date range selection",
      "Min/max date constraints",
      "Locale support",
      "Customizable styling",
    ],
    quickStart: `import { DatePicker, TimePicker } from '@idealyst/datepicker';

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={new Date()}
/>

<TimePicker
  value={selectedTime}
  onChange={setSelectedTime}
  is24Hour={true}
/>`,
    apiHighlights: [
      "DatePicker component",
      "TimePicker component",
      "DateRangePicker component",
      "Calendar component",
    ],
    relatedPackages: ["components", "theme"],
  },

  "oauth-client": {
    name: "OAuth Client",
    npmName: "@idealyst/oauth-client",
    description:
      "Universal OAuth2 client for web and React Native. Supports authorization code flow with PKCE.",
    category: "auth",
    platforms: ["web", "native"],
    documentationStatus: "minimal",
    installation: "yarn add @idealyst/oauth-client @idealyst/storage",
    peerDependencies: ["@idealyst/storage"],
    features: [
      "Authorization code flow with PKCE",
      "Token refresh handling",
      "Secure token storage",
      "Multiple provider support",
      "Silent token refresh",
      "Logout handling",
    ],
    quickStart: `import { OAuthClient } from '@idealyst/oauth-client';

const oauth = new OAuthClient({
  clientId: 'your-client-id',
  authorizationEndpoint: 'https://auth.example.com/authorize',
  tokenEndpoint: 'https://auth.example.com/token',
  redirectUri: 'myapp://callback',
});

// Start login flow
await oauth.login();

// Get access token
const token = await oauth.getAccessToken();

// Logout
await oauth.logout();`,
    apiHighlights: [
      "OAuthClient class",
      "login() / logout()",
      "getAccessToken()",
      "Token refresh handling",
    ],
    relatedPackages: ["storage", "navigation"],
  },

  config: {
    name: "Config",
    npmName: "@idealyst/config",
    description:
      "Cross-platform configuration and environment variable support. Type-safe access to env vars on web and native.",
    category: "utility",
    platforms: ["web", "native", "node"],
    documentationStatus: "minimal",
    installation: "yarn add @idealyst/config",
    peerDependencies: ["react-native-config (native)"],
    features: [
      "Type-safe environment variables",
      "Cross-platform API",
      "Build-time configuration",
      "Vite plugin for web",
      "React Native Config integration",
      "Default value support",
    ],
    quickStart: `// config.ts
import { defineConfig } from '@idealyst/config';

export const config = defineConfig({
  API_URL: { required: true },
  DEBUG: { default: 'false' },
  APP_NAME: { default: 'My App' },
});

// Usage
import { config } from './config';
console.log(config.API_URL);`,
    apiHighlights: [
      "defineConfig()",
      "Type-safe config object",
      "Vite plugin",
      "CLI for generation",
    ],
    relatedPackages: ["storage"],
  },

  tooling: {
    name: "Tooling",
    npmName: "@idealyst/tooling",
    description:
      "Code analysis and validation utilities for Idealyst Framework. Includes Vite plugins and static analyzers.",
    category: "tooling",
    platforms: ["node"],
    documentationStatus: "minimal",
    installation: "yarn add -D @idealyst/tooling",
    features: [
      "Component usage analysis",
      "Import validation",
      "Vite plugin for build-time checks",
      "Custom rule definitions",
      "Documentation generation",
    ],
    quickStart: `// vite.config.ts
import { idealystPlugin } from '@idealyst/tooling/vite';

export default {
  plugins: [
    idealystPlugin({
      validateImports: true,
      analyzeUsage: true,
    }),
  ],
};`,
    apiHighlights: [
      "idealystPlugin() for Vite",
      "analyzeComponent()",
      "Custom rule API",
    ],
    relatedPackages: ["cli"],
  },

  "mcp-server": {
    name: "MCP Server",
    npmName: "@idealyst/mcp-server",
    description:
      "Model Context Protocol server providing AI assistants with Idealyst framework documentation, types, and examples.",
    category: "tooling",
    platforms: ["node"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/mcp-server",
    features: [
      "Component documentation",
      "Type extraction from source",
      "Validated code examples",
      "Icon search (7,447 MDI icons)",
      "Navigation and theme guides",
      "CLI command reference",
    ],
    quickStart: `// .mcp.json (Claude Code)
{
  "mcpServers": {
    "idealyst": {
      "command": "node",
      "args": ["node_modules/@idealyst/mcp-server/dist/index.js"]
    }
  }
}`,
    apiHighlights: [
      "list_components",
      "get_component_docs",
      "search_icons",
      "get_*_types",
    ],
    relatedPackages: ["components", "theme", "navigation"],
  },
};

/**
 * Get all packages grouped by category
 */
export function getPackagesByCategory(): Record<string, PackageInfo[]> {
  const grouped: Record<string, PackageInfo[]> = {};

  for (const pkg of Object.values(packages)) {
    if (!grouped[pkg.category]) {
      grouped[pkg.category] = [];
    }
    grouped[pkg.category].push(pkg);
  }

  return grouped;
}

/**
 * Get a summary list of all packages
 */
export function getPackageSummary(): Array<{
  name: string;
  npmName: string;
  category: string;
  description: string;
  platforms: string[];
  documentationStatus: string;
}> {
  return Object.entries(packages).map(([key, pkg]) => ({
    name: pkg.name,
    npmName: pkg.npmName,
    category: pkg.category,
    description: pkg.description,
    platforms: pkg.platforms,
    documentationStatus: pkg.documentationStatus,
  }));
}

/**
 * Search packages by query
 */
export function searchPackages(query: string): PackageInfo[] {
  const lowerQuery = query.toLowerCase();

  return Object.values(packages).filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(lowerQuery) ||
      pkg.npmName.toLowerCase().includes(lowerQuery) ||
      pkg.description.toLowerCase().includes(lowerQuery) ||
      pkg.features.some((f) => f.toLowerCase().includes(lowerQuery)) ||
      pkg.category.toLowerCase().includes(lowerQuery)
  );
}
