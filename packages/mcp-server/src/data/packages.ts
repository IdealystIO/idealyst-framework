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
  <Text typography="h5" weight="bold">Hello World</Text>
  <Button onPress={() => console.log('Pressed!')}>
    Click Me
  </Button>
</Card>`,
    apiHighlights: [
      "Button, IconButton, FAB",
      "Card, View, Screen",
      "TextInput, TextArea, Checkbox, Switch",
      "Dialog, Popover, Menu",
      "Text, Link, Badge, Chip",
    ],
    relatedPackages: ["theme", "navigation"],
  },

  theme: {
    name: "Theme",
    npmName: "@idealyst/theme",
    description:
      "Cross-platform theming system built on react-native-unistyles. Provides colors, typography, spacing, responsive breakpoints, shadow utilities, and style helpers with a fluent builder API.",
    category: "core",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/theme react-native-unistyles",
    peerDependencies: ["react-native-unistyles"],
    features: [
      "Light and dark theme variants",
      "Semantic color tokens (intent-based)",
      "Fluent builder API for theme creation",
      "Individual color modification (add/set surface, text, border, pallet)",
      "Intent management (addIntent, setIntent)",
      "Responsive breakpoints",
      "Typography scale",
      "Spacing and sizing utilities",
      "Platform-specific adaptations",
      "shadow() - Cross-platform shadow styles",
      "useStyleProps() - Unified Unistyles + inline style handling",
    ],
    quickStart: `import { UnistylesProvider, shadow, useStyleProps } from '@idealyst/theme';
import { View } from '@idealyst/components';

// Cross-platform shadows
<View style={shadow({ radius: 10, y: 4, opacity: 0.15 })}>
  Shadowed content
</View>

// Unified style handling for custom components
function MyComponent({ style }) {
  const styleProps = useStyleProps(
    (styles.container as any)({}),  // Unistyles
    [style, { marginTop: 16 }]      // Additional styles
  );
  return <View {...styleProps}>Content</View>;
}`,
    apiHighlights: [
      "createTheme() / fromTheme(base) - Theme builder",
      "addIntent() / setIntent() - Intent management",
      "addSurfaceColor() / setSurfaceColor() - Surface colors",
      "addTextColor() / setTextColor() - Text colors",
      "addBorderColor() / setBorderColor() - Border colors",
      "addPalletColor() / setPalletColor() - Pallet colors",
      "shadow({ radius, x, y, color, opacity }) - Cross-platform shadows",
      "useStyleProps(unistyles, inlineStyles) - Style prop unification",
      "Size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      "Intent: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
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
    quickStart: `import { useCamera, CameraPreview, requestPermission } from '@idealyst/camera';

function CameraScreen() {
  const camera = useCamera({ autoRequestPermission: true });

  const handleTakePhoto = async () => {
    const photo = await camera.takePhoto();
    console.log('Photo taken:', photo.uri);
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraPreview camera={camera.cameraRef.current} style={{ flex: 1 }} />
      <Button onPress={handleTakePhoto} intent="primary">Take Photo</Button>
    </View>
  );
}`,
    apiHighlights: [
      "CameraPreview component (NOT Camera)",
      "useCamera() hook — returns status, takePhoto, startRecording, stopRecording, cameraRef",
      "requestPermission() — standalone function (NOT useCameraPermission or requestCameraPermission)",
      "CameraStatus is an INTERFACE { state: CameraState, permission, isActive, error } — NOT a string enum",
      "CameraState = 'idle' | 'initializing' | 'ready' | 'recording' | 'capturing'",
      "PhotoResult { uri, width, height, metadata }",
      "VideoResult { uri, duration }",
    ],
    relatedPackages: ["components", "storage"],
  },

  audio: {
    name: "Audio",
    npmName: "@idealyst/audio",
    description:
      "Unified cross-platform audio for React and React Native. Provides recording with real-time PCM streaming, file playback, and session management for simultaneous recording and playback.",
    category: "media",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/audio react-native-audio-api",
    peerDependencies: ["react-native-audio-api (native)"],
    features: [
      "Recording with real-time PCM streaming",
      "File playback (mp3, wav, etc.)",
      "PCM streaming playback for TTS",
      "Audio session management (iOS/Android)",
      "Simultaneous recording and playback",
      "Audio level monitoring",
      "Configurable sample rates and bit depths",
      "Audio profiles (speech, music, phone)",
    ],
    quickStart: `import { useRecorder, usePlayer, AUDIO_PROFILES } from '@idealyst/audio';
import type { PCMData } from '@idealyst/audio';

function AudioApp() {
  const recorder = useRecorder({ config: AUDIO_PROFILES.speech });
  const player = usePlayer();
  const chunksRef = useRef<ArrayBuffer[]>([]);

  // Subscribe to PCM data chunks during recording
  useEffect(() => {
    // subscribeToData receives PCMData objects (NOT strings)
    // PCMData has: buffer (ArrayBufferLike), samples (Int16Array), timestamp, config, toBase64()
    const unsubscribe = recorder.subscribeToData((data: PCMData) => {
      chunksRef.current.push(data.buffer as ArrayBuffer);
    });
    return unsubscribe;
  }, [recorder.subscribeToData]);

  const handleRecord = async () => {
    if (recorder.isRecording) {
      await recorder.stop(); // stop() returns void — data comes via subscribeToData
    } else {
      chunksRef.current = [];
      await recorder.start();
    }
  };

  // Play back recorded PCM data
  const handlePlayback = async () => {
    await player.loadPCMStream(AUDIO_PROFILES.speech);
    await player.play();
    // feedPCMData accepts ArrayBufferLike | Int16Array (NOT strings)
    for (const chunk of chunksRef.current) {
      player.feedPCMData(chunk);
    }
    await player.flush();
  };

  // Play an audio file (mp3, wav, etc.)
  const handlePlayFile = async () => {
    await player.loadFile('/audio/music.mp3');
    await player.play();
  };

  return (
    <View>
      <Button onPress={handleRecord}>
        {recorder.isRecording ? 'Stop' : 'Record'}
      </Button>
      <Text typography="body2">Duration: {recorder.duration}ms</Text>
      <Button onPress={handlePlayback} disabled={chunksRef.current.length === 0}>
        Play Recording
      </Button>
    </View>
  );
}`,
    apiHighlights: [
      "useRecorder() — PCM streaming recorder. stop() returns void. Use subscribeToData(cb) to receive PCMData chunks",
      "usePlayer() — File playback (loadFile) and PCM streaming (loadPCMStream + feedPCMData)",
      "PCMData type — { buffer: ArrayBufferLike, samples: Int16Array, timestamp, config, toBase64() }",
      "feedPCMData() accepts ArrayBufferLike | Int16Array — NOT strings",
      "useAudio() — Session management (iOS/Android)",
      "AUDIO_PROFILES — Pre-configured configs: speech, highQuality, studio, phone",
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

  markdown: {
    name: "Markdown",
    npmName: "@idealyst/markdown",
    description:
      "Cross-platform markdown renderer for React and React Native. Supports GitHub Flavored Markdown with theme integration.",
    category: "ui",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/markdown @idealyst/theme",
    peerDependencies: [
      "@idealyst/theme",
      "react-markdown (web)",
      "remark-gfm (web)",
      "react-native-markdown-display (native)",
    ],
    features: [
      "GitHub Flavored Markdown support",
      "Tables, strikethrough, task lists",
      "Theme-integrated styling",
      "Custom link and image handlers",
      "Style overrides per element",
      "Cross-platform consistency",
    ],
    quickStart: `import { Markdown } from '@idealyst/markdown';

<Markdown
  size="md"
  linkIntent="primary"
  linkHandler={{
    onLinkPress: (url) => console.log('Link:', url),
  }}
>
{\`# Hello World

This is **bold** and _italic_ text.

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
\`}
</Markdown>`,
    apiHighlights: [
      "Markdown component",
      "size prop (xs-xl)",
      "linkIntent prop",
      "styleOverrides prop",
      "linkHandler / imageHandler",
    ],
    relatedPackages: ["components", "theme"],
  },

  animate: {
    name: "Animate",
    npmName: "@idealyst/animate",
    description:
      "Cross-platform animation hooks for React and React Native. Provides a unified API with CSS transitions on web and Reanimated on native for smooth, performant animations.",
    category: "ui",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/animate react-native-reanimated",
    peerDependencies: [
      "@idealyst/theme",
      "react-native-reanimated (native)",
    ],
    features: [
      "useAnimatedStyle - State-driven animations with transform object syntax",
      "usePresence - Mount/unmount animations with enter/exit states",
      "useAnimatedValue - Imperative animated values with interpolation",
      "useGradientBorder - Animated gradient border effects",
      "withAnimated HOC - Wrap components for Reanimated (native)",
      "Simplified transform syntax: { x, y, scale, rotate }",
      "Duration tokens: 'instant', 'fast', 'normal', 'slow', 'verySlow'",
      "Easing presets: 'linear', 'easeIn', 'easeOut', 'easeInOut', 'spring'",
      "Platform-specific overrides for fine-tuned control",
    ],
    quickStart: `import { View } from '@idealyst/components';
import { withAnimated, useAnimatedStyle, usePresence } from '@idealyst/animate';

// Wrap components for native animations
const AnimatedView = withAnimated(View);

function FadeInComponent({ isVisible }: { isVisible: boolean }) {
  // State-driven animation with simplified transform syntax
  const style = useAnimatedStyle({
    opacity: isVisible ? 1 : 0,
    transform: { y: isVisible ? 0 : 20 },
  }, {
    duration: 'normal',
    easing: 'easeOut',
  });

  return <AnimatedView style={style}>Content</AnimatedView>;
}

function ModalContent({ isOpen }: { isOpen: boolean }) {
  // Mount/unmount animation
  const { isPresent, style } = usePresence(isOpen, {
    enter: { opacity: 1, transform: { y: 0, scale: 1 } },
    exit: { opacity: 0, transform: { y: -20, scale: 0.95 } },
    duration: 'fast',
  });

  return isPresent && <AnimatedView style={style}>Modal</AnimatedView>;
}`,
    apiHighlights: [
      "useAnimatedStyle(style, options) - Animate style changes",
      "usePresence(isVisible, { enter, exit }) - Mount/unmount animations",
      "useAnimatedValue(initial) - Imperative animated values",
      "useGradientBorder(options) - Animated gradient borders",
      "withAnimated(Component) - HOC for native (no-op on web)",
      "TransformObject: { x, y, scale, rotate, ... }",
      "Duration: 'instant' | 'fast' | 'normal' | 'slow' | 'verySlow'",
      "EasingKey: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | ...",
    ],
    relatedPackages: ["theme", "components"],
  },

  lottie: {
    name: "Lottie",
    npmName: "@idealyst/lottie",
    description:
      "Cross-platform Lottie animation component for React and React Native. Renders After Effects animations using lottie-web on web and lottie-react-native on native.",
    category: "ui",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/lottie lottie-web lottie-react-native",
    peerDependencies: ["lottie-web (web)", "lottie-react-native (native)"],
    features: [
      "Render After Effects animations from JSON",
      "URL, imported JSON, or require() sources",
      "Imperative ref API for playback control",
      "Autoplay, loop, and speed configuration",
      "Resize modes (cover, contain, center)",
      "Segment playback for partial animations",
      "Frame-level control and progress tracking",
      "Event callbacks (onComplete, onLoad, onError)",
      "Direction control (forward/reverse)",
    ],
    quickStart: `import { Lottie, LottieRef } from '@idealyst/lottie';
import { useRef } from 'react';

// Basic usage with URL
<Lottie
  source="https://assets.example.com/animation.json"
  autoPlay
  loop
/>

// With imported JSON
import animationData from './animation.json';
<Lottie source={animationData} autoPlay />

// With ref for imperative control
function AnimatedComponent() {
  const lottieRef = useRef<LottieRef>(null);

  return (
    <>
      <Lottie
        ref={lottieRef}
        source={animationData}
        onComplete={() => console.log('Animation complete')}
      />
      <Button onPress={() => lottieRef.current?.play()}>Play</Button>
      <Button onPress={() => lottieRef.current?.pause()}>Pause</Button>
      <Button onPress={() => lottieRef.current?.setProgress(0.5)}>
        Go to 50%
      </Button>
    </>
  );
}`,
    apiHighlights: [
      "Lottie component",
      "LottieRef.play() / pause() / stop()",
      "LottieRef.setProgress(0-1)",
      "LottieRef.goToAndPlay(frame) / goToAndStop(frame)",
      "LottieRef.playSegments(start, end)",
      "LottieRef.setSpeed(speed) / setDirection(1 | -1)",
      "LottieRef.getCurrentFrame() / getTotalFrames()",
      "LottieSource: string | LottieJSON | { uri: string }",
      "ResizeMode: 'cover' | 'contain' | 'center'",
    ],
    relatedPackages: ["components", "animate"],
  },

  charts: {
    name: "Charts",
    npmName: "@idealyst/charts",
    description:
      "Cross-platform animated charting library for React and React Native. Supports line, bar, area, pie, scatter, and candlestick charts with dual-renderer architecture (SVG for web, Skia for native).",
    category: "ui",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/charts @idealyst/theme @idealyst/svg",
    peerDependencies: [
      "@idealyst/theme",
      "@idealyst/svg",
      "react-native-reanimated (native)",
      "react-native-gesture-handler (native)",
      "@shopify/react-native-skia (native, optional)",
    ],
    features: [
      "LineChart - Time series, trends with multiple curve types (linear, monotone, step)",
      "BarChart - Vertical/horizontal, grouped, stacked with staggered animations",
      "PieChart/DonutChart - Segment reveal animations (coming soon)",
      "AreaChart - Filled area with gradient support (coming soon)",
      "ScatterChart - Point clouds (coming soon)",
      "CandlestickChart - OHLC financial data (coming soon)",
      "Dual-renderer: SVG (web default) and Skia (native GPU-accelerated)",
      "Full animation support - entrance, transitions, interactions",
      "Theme integration - intent-based colors, dark mode",
      "Touch/mouse interactions - tooltips, selection",
      "Zoom/pan support (coming soon)",
      "Scale utilities - linear, band, time scales",
      "Responsive container sizing",
    ],
    quickStart: `import { LineChart, BarChart, ChartProvider } from '@idealyst/charts';

// Basic Line Chart with animation
<LineChart
  data={[{
    id: 'revenue',
    name: 'Revenue',
    intent: 'primary',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 150 },
      { x: 'Mar', y: 120 },
    ],
  }]}
  height={300}
  curve="monotone"
  showDots
  showArea
  animate
/>

// Animated Bar Chart with stagger effect
<BarChart
  data={[{
    id: 'sales',
    name: 'Sales',
    intent: 'success',
    data: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 180 },
      { x: 'Q3', y: 150 },
    ],
  }]}
  height={300}
  animate
  barRadius={4}
/>

// App-wide chart defaults
<ChartProvider renderer="svg" defaultIntent="primary">
  <App />
</ChartProvider>`,
    apiHighlights: [
      "LineChart - Line/area charts with curve interpolation",
      "BarChart - Bar charts with grouping/stacking",
      "ChartContainer - Responsive container with padding",
      "ChartProvider - App-wide renderer and defaults",
      "XAxis, YAxis, GridLines - Axis components",
      "useChartAnimation() - Custom animation hook",
      "useStaggeredAnimation() - Staggered entrance animations",
      "createLinearScale() - Numeric value scaling",
      "createBandScale() - Categorical scaling",
      "createTimeScale() - Date/time scaling",
      "generateLinePath() - SVG path generation",
      "CurveType: 'linear' | 'monotone' | 'step' | 'cardinal'",
      "Data: { id, name, intent?, color?, data: [{ x, y }] }",
    ],
    relatedPackages: ["theme", "svg", "animate"],
  },

  "files": {
    name: "Files",
    npmName: "@idealyst/files",
    description:
      "Cross-platform file picker, upload, and local file management for React and React Native. Supports chunked uploads for large files, background uploads on native, progress tracking, and retry logic.",
    category: "media",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation:
      "yarn add @idealyst/files react-native-document-picker react-native-image-picker react-native-blob-util",
    peerDependencies: [
      "react-native-document-picker (native)",
      "react-native-image-picker (native)",
      "react-native-blob-util (native)",
    ],
    features: [
      "Cross-platform file picker with type filtering",
      "Camera capture support (native)",
      "Drag and drop support (web)",
      "Upload queue with concurrency control",
      "Progress tracking with speed and ETA",
      "Chunked uploads for large files (>50MB)",
      "Background uploads on native",
      "Automatic retry with exponential backoff",
      "Presets for common scenarios (avatar, documents, images)",
      "TypeScript-first with full type definitions",
    ],
    quickStart: `import { useFilePicker, useFileUpload, FilePickerButton, UploadProgress } from '@idealyst/files';

function UploadForm() {
  const { addFiles, uploads } = useFileUpload({ autoStart: true });

  return (
    <View>
      <FilePickerButton
        pickerConfig={{ allowedTypes: ['image'], multiple: true }}
        onPick={(result) => {
          if (!result.cancelled) {
            addFiles(result.files, {
              url: 'https://api.example.com/upload',
              fieldName: 'file',
            });
          }
        }}
      >
        Select Images
      </FilePickerButton>

      {uploads.map(upload => (
        <UploadProgress
          key={upload.id}
          upload={upload}
          showSpeed
          showETA
        />
      ))}
    </View>
  );
}`,
    apiHighlights: [
      "useFilePicker() - File selection hook. Returns { pick, files, isPicking }. Method is pick() — NOT pickFiles()",
      "useFileUpload() - Upload management hook",
      "FilePickerButton - Styled file picker button",
      "DropZone - Drag and drop area (web)",
      "UploadProgress - Progress indicator component",
      "FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'any' — NOT 'pdf', 'doc', 'xlsx'",
      "PickedFile has dimensions?: { width, height } — NOT top-level width/height",
      "FILE_PICKER_PRESETS - Common file type configs",
      "UPLOAD_PRESETS - Upload behavior presets",
      "Use customMimeTypes for specific formats like 'application/pdf'",
    ],
    relatedPackages: ["components", "camera", "storage"],
  },

  clipboard: {
    name: "Clipboard",
    npmName: "@idealyst/clipboard",
    description:
      "Cross-platform clipboard and OTP autofill for React and React Native. Copy/paste text and auto-detect SMS verification codes on mobile.",
    category: "utility",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/clipboard",
    peerDependencies: [
      "@react-native-clipboard/clipboard (native)",
      "react-native-otp-verify (Android OTP, optional)",
    ],
    features: [
      "Cross-platform copy/paste with async API",
      "Android SMS OTP auto-read via SMS Retriever API (no permissions)",
      "iOS OTP keyboard autofill via TextInput props",
      "Clipboard change listeners",
      "Graceful degradation when native modules missing",
    ],
    quickStart: `import { clipboard } from '@idealyst/clipboard';

// Copy text
await clipboard.copy('Hello, world!');

// Paste text
const text = await clipboard.paste();

// OTP auto-fill (mobile)
import { useOTPAutoFill, OTP_INPUT_PROPS } from '@idealyst/clipboard';

function OTPScreen() {
  const { code, startListening } = useOTPAutoFill({
    codeLength: 6,
    onCodeReceived: (otp) => verifyOTP(otp),
  });

  useEffect(() => { startListening(); }, []);

  return <TextInput value={code ?? ''} {...OTP_INPUT_PROPS} />;
}`,
    apiHighlights: [
      "clipboard.copy(text) - Copy text to clipboard",
      "clipboard.paste() - Read text from clipboard",
      "clipboard.hasText() - Check if clipboard has text",
      "clipboard.addListener(fn) - Listen for copy events",
      "useOTPAutoFill({ codeLength, onCodeReceived }) - Auto-detect SMS OTP codes (Android)",
      "OTP_INPUT_PROPS - TextInput props for iOS OTP keyboard autofill",
    ],
    relatedPackages: ["storage", "components"],
  },

  biometrics: {
    name: "Biometrics",
    npmName: "@idealyst/biometrics",
    description:
      "Cross-platform biometric authentication and passkeys (WebAuthn/FIDO2) for React and React Native. FaceID, TouchID, fingerprint, iris, and passwordless login.",
    category: "auth",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/biometrics",
    peerDependencies: [
      "expo-local-authentication (native biometrics)",
      "react-native-passkeys (native passkeys, optional)",
    ],
    features: [
      "Local biometric auth — FaceID, TouchID, fingerprint, iris",
      "Passkeys (WebAuthn/FIDO2) — passwordless login with cryptographic credentials",
      "Cross-platform — single API for web and React Native",
      "Web biometrics via WebAuthn userVerification",
      "Web passkeys via navigator.credentials",
      "Graceful degradation when native modules missing",
      "Base64url encoding helpers for WebAuthn data",
    ],
    quickStart: `import { isBiometricAvailable, authenticate } from '@idealyst/biometrics';

// Check biometric availability
const available = await isBiometricAvailable();

// Authenticate
if (available) {
  const result = await authenticate({ promptMessage: 'Verify your identity' });
  if (result.success) {
    // Authenticated!
  }
}

// Passkeys
import { isPasskeySupported, createPasskey, getPasskey } from '@idealyst/biometrics';

const credential = await createPasskey({
  challenge: serverChallenge,
  rp: { id: 'example.com', name: 'My App' },
  user: { id: userId, name: email, displayName: name },
});`,
    apiHighlights: [
      "isBiometricAvailable() - Check biometric hardware and enrollment",
      "getBiometricTypes() - Get available biometric types",
      "getSecurityLevel() - Get device security level",
      "authenticate(options) - Prompt for biometric auth",
      "cancelAuthentication() - Cancel auth (Android)",
      "isPasskeySupported() - Check passkey support",
      "createPasskey(options) - Register a new passkey",
      "getPasskey(options) - Authenticate with passkey",
    ],
    relatedPackages: ["oauth-client", "storage"],
  },

  payments: {
    name: "Payments",
    npmName: "@idealyst/payments",
    description:
      "Cross-platform In-App Purchase (IAP) wrapper for React Native. Wraps react-native-iap for StoreKit 2 (iOS) and Google Play Billing (Android). Supports subscriptions, one-time purchases, and restore.",
    category: "utility",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/payments react-native-iap",
    peerDependencies: [
      "react-native-iap (native)",
    ],
    features: [
      "StoreKit 2 — Native iOS in-app purchases and subscriptions",
      "Google Play Billing — Native Android purchases and subscriptions",
      "Flat function API + useIAP convenience hook",
      "Product and subscription fetching by SKU",
      "Purchase with server-side receipt validation flow",
      "Consumable and non-consumable product support",
      "Subscription purchase with offer token support (Android)",
      "Restore previous purchases",
      "Normalized error handling across platforms",
      "Graceful degradation when react-native-iap missing",
      "Web stub (IAP is native-only)",
    ],
    quickStart: `import { useIAP } from '@idealyst/payments';

const { isReady, subscriptions, purchaseSubscription, finishTransaction } = useIAP({
  subscriptionSkus: ['pro_monthly', 'pro_yearly'],
});

const purchase = await purchaseSubscription('pro_monthly');
await validateReceiptOnServer(purchase.transactionReceipt);
await finishTransaction(purchase);`,
    apiHighlights: [
      "initializeIAP(config?) - Initialize IAP connection",
      "getProducts(skus) - Fetch one-time purchase products",
      "getSubscriptions(skus) - Fetch subscription products",
      "purchaseProduct(sku) - Purchase a one-time product",
      "purchaseSubscription(sku, offerToken?) - Purchase a subscription",
      "finishTransaction(purchase, isConsumable?) - Finish after server validation",
      "restorePurchases() - Restore previous purchases",
      "endConnection() - Cleanup IAP connection",
      "useIAP(options?) - Convenience hook with state management",
    ],
    relatedPackages: ["biometrics", "oauth-client"],
  },

  notifications: {
    name: "Notifications",
    npmName: "@idealyst/notifications",
    description:
      "Cross-platform push and local notifications for React Native and web. Push via Firebase Cloud Messaging (native) and Web Push API (web). Local notifications via Notifee (native) and Notification API (web). Backend-agnostic — gives you device tokens, your server sends via any push service.",
    category: "utility",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/notifications",
    peerDependencies: [
      "@react-native-firebase/app (native push)",
      "@react-native-firebase/messaging (native push)",
      "@notifee/react-native (native local)",
      "react-native (native)",
    ],
    features: [
      "Push notification registration — FCM tokens (native) and PushSubscription (web)",
      "Local notifications — display, schedule, cancel across platforms",
      "Permission management — check, request, and track notification permissions",
      "Foreground message handling — react to push while app is in foreground",
      "Notification open handling — deep-link when user taps a notification",
      "Background message handler — process push in background (native)",
      "Topic subscription — subscribe/unsubscribe to FCM topics (native)",
      "Android channels — create, delete, and manage notification channels",
      "Notification categories and actions — interactive notification buttons",
      "Badge count management — PWA badge API (web) and Notifee (native)",
      "Scheduling with triggers — timestamp, interval, and repeat triggers",
      "Token refresh handling — automatic token rotation callbacks",
      "Web Push with VAPID — standard Web Push API, no vendor lock-in",
      "Three focused hooks — usePushNotifications, useLocalNotifications, useNotificationPermissions",
      "Standalone functions — for non-React or top-level usage (e.g., background handler)",
      "Graceful degradation when native deps are not installed",
    ],
    quickStart: `import {
  usePushNotifications,
  useLocalNotifications,
  useNotificationPermissions,
} from '@idealyst/notifications';

// Push notifications
const { token, register } = usePushNotifications({
  autoRegister: true,
  onMessage: (msg) => console.log('Push received:', msg),
});

// Local notifications
const { displayNotification } = useLocalNotifications();
await displayNotification({
  title: 'Hello',
  body: 'This is a local notification',
});

// Permissions
const { status, requestPermission } = useNotificationPermissions();`,
    apiHighlights: [
      "usePushNotifications(options?) - Push token management and message listeners",
      "useLocalNotifications(options?) - Display, schedule, and manage local notifications",
      "useNotificationPermissions(options?) - Check and request notification permissions",
      "configurePush({ vapidKey }) - Web-only: configure VAPID key before push registration",
      "setBackgroundMessageHandler(handler) - Register background push handler (native, call at top level)",
      "displayNotification(options) - Show a local notification immediately",
      "scheduleNotification(options) - Schedule a notification with triggers",
      "createChannel(channel) - Create an Android notification channel",
      "subscribeToTopic(topic) - Subscribe to FCM topic (native)",
    ],
    relatedPackages: ["storage", "oauth-client"],
  },

  "live-activity": {
    name: "Live Activity",
    npmName: "@idealyst/live-activity",
    description:
      "Cross-platform Live Activities — iOS ActivityKit (Lock Screen + Dynamic Island) and Android 16 Live Updates (Notification.ProgressStyle). Includes pre-built SwiftUI templates, a CLI generator for custom activities, and a TurboModule bridge.",
    category: "utility",
    platforms: ["native", "web"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/live-activity",
    peerDependencies: ["react", "react-native"],
    features: [
      "Unified useLiveActivity() hook for both platforms",
      "Pre-built SwiftUI templates: delivery, timer, media, progress",
      "CLI generator for custom Live Activity scaffolding",
      "TurboModule bridge (New Architecture)",
      "Type-safe generic StartActivityOptions<T> per template",
      "iOS push token support for server-driven updates",
      "Event system for lifecycle changes (started, updated, ended, stale)",
      "Android ProgressStyle with fallback to standard notifications",
      "Web stubs with graceful not_supported returns",
    ],
    quickStart: `import { useLiveActivity, deliveryActivity } from '@idealyst/live-activity';

const { start, update, end, currentActivity, isSupported } = useLiveActivity();

// Start a delivery activity
const info = await start(deliveryActivity(
  { title: 'Order #1234', startLabel: 'Kitchen', endLabel: 'Door' },
  { status: 'Preparing', progress: 0, eta: new Date().toISOString() }
));

// Update progress
await update(info.id, {
  contentState: { status: 'On the way!', progress: 0.6 },
});

// End the activity
await end(info.id, { dismissalPolicy: 'default' });`,
    apiHighlights: [
      "useLiveActivity(options?) - Hook for managing Live Activities with state tracking",
      "start(options) - Start a new Live Activity",
      "update(activityId, options) - Update content state",
      "end(activityId, options?) - End with dismissal policy",
      "endAll(options?) - End all active activities",
      "getPushToken(activityId) - Get iOS push token",
      "addEventListener(handler) - Subscribe to lifecycle events",
      "deliveryActivity() / timerActivity() / mediaActivity() / progressActivity() - Template presets",
    ],
    relatedPackages: ["notifications"],
  },

  network: {
    name: "Network",
    npmName: "@idealyst/network",
    description:
      "Cross-platform network connectivity and utilities for React and React Native. Real-time connection monitoring, fetch with timeout, retry with exponential backoff, and wait-for-network primitives.",
    category: "utility",
    platforms: ["web", "native"],
    documentationStatus: "full",
    installation: "yarn add @idealyst/network",
    peerDependencies: [
      "@react-native-community/netinfo (native)",
    ],
    features: [
      "useNetwork hook — real-time isConnected, connection type, effective speed",
      "Network state listener for non-React code",
      "Connection type detection — WiFi, cellular, ethernet, bluetooth, VPN",
      "Effective connection speed — slow-2g, 2g, 3g, 4g",
      "Cellular generation — 2G, 3G, 4G, 5G (native)",
      "Internet reachability — distinguish connected from reachable",
      "fetchWithTimeout — fetch with configurable auto-abort",
      "retry — exponential backoff with network-aware gating",
      "waitForNetwork — promise that resolves when back online",
      "Data saver detection (web)",
      "Downlink speed and RTT estimation (web)",
    ],
    quickStart: `import { useNetwork } from '@idealyst/network';

function App() {
  const { isConnected, type, effectiveType } = useNetwork();

  if (!isConnected) {
    return <Text>You are offline</Text>;
  }

  return <Text>Connected via {type} ({effectiveType})</Text>;
}`,
    apiHighlights: [
      "useNetwork(options?) - React hook for real-time network state",
      "getNetworkState() - One-time state snapshot (sync on web, async on native)",
      "addNetworkStateListener(cb) - Subscribe to changes (returns unsubscribe)",
      "fetchWithTimeout(url, options) - Fetch with auto-abort timeout",
      "retry(fn, options) - Exponential backoff retry",
      "waitForNetwork(options) - Promise that resolves when online",
      "NetworkState { isConnected, isInternetReachable, type, effectiveType, cellularGeneration, downlink, rtt, isDataSaving }",
    ],
    relatedPackages: ["storage", "config"],
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
