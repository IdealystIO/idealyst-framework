/**
 * Installation Guides for Idealyst Packages
 *
 * Provides detailed installation instructions including:
 * - npm/yarn installation commands
 * - iOS configuration (Info.plist, CocoaPods)
 * - Android configuration (AndroidManifest.xml, Gradle)
 * - Additional dependencies and peer dependencies
 */

export interface InstallGuide {
  packageName: string;
  npmName: string;
  description: string;
  platforms: ("web" | "native" | "node")[];
  complexity: "simple" | "moderate" | "complex";

  // Basic installation
  installation: {
    yarn: string;
    npm: string;
  };

  // Peer dependencies to install
  peerDependencies?: {
    name: string;
    required: boolean;
    platforms: ("web" | "native")[];
    note?: string;
  }[];

  // iOS-specific configuration
  ios?: {
    podInstallRequired: boolean;
    infoPlistEntries?: {
      key: string;
      value: string;
      description: string;
    }[];
    additionalSteps?: string[];
  };

  // Android-specific configuration
  android?: {
    permissions?: {
      permission: string;
      description: string;
    }[];
    manifestEntries?: {
      location: string;
      xml: string;
      description: string;
    }[];
    gradleChanges?: {
      file: string;
      changes: string;
      description: string;
    }[];
    additionalSteps?: string[];
  };

  // Web-specific configuration
  web?: {
    additionalDependencies?: string[];
    bundlerConfig?: string;
    notes?: string[];
  };

  // Post-installation verification
  verification?: string;

  // Common issues and solutions
  troubleshooting?: {
    issue: string;
    solution: string;
  }[];
}

export const installGuides: Record<string, InstallGuide> = {
  // ============================================================================
  // CORE PACKAGES
  // ============================================================================

  theme: {
    packageName: "Theme",
    npmName: "@idealyst/theme",
    description: "Cross-platform theming system built on react-native-unistyles",
    platforms: ["web", "native"],
    complexity: "simple",
    installation: {
      yarn: "yarn add @idealyst/theme react-native-unistyles",
      npm: "npm install @idealyst/theme react-native-unistyles",
    },
    peerDependencies: [
      {
        name: "react-native-unistyles",
        required: true,
        platforms: ["web", "native"],
        note: "Required for styling system",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: ["cd ios && pod install"],
    },
    android: {
      additionalSteps: [
        "No additional configuration required - auto-linked by React Native",
      ],
    },
    verification: `import { UnistylesProvider } from '@idealyst/theme';
// Wrap your app with UnistylesProvider`,
  },

  components: {
    packageName: "Components",
    npmName: "@idealyst/components",
    description: "Cross-platform React UI components for web and React Native",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/components @idealyst/theme",
      npm: "npm install @idealyst/components @idealyst/theme",
    },
    peerDependencies: [
      {
        name: "@idealyst/theme",
        required: true,
        platforms: ["web", "native"],
      },
      {
        name: "react-native-unistyles",
        required: true,
        platforms: ["web", "native"],
      },
      {
        name: "react-native-reanimated",
        required: false,
        platforms: ["native"],
        note: "Required for animated components",
      },
      {
        name: "react-native-safe-area-context",
        required: false,
        platforms: ["native"],
        note: "Required for Screen component",
      },
      {
        name: "react-native-vector-icons",
        required: false,
        platforms: ["native"],
        note: "Required for icons on native",
      },
      {
        name: "@mdi/react @mdi/js",
        required: false,
        platforms: ["web"],
        note: "Required for icons on web",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: [
        "cd ios && pod install",
        "If using vector icons, add fonts to Info.plist",
      ],
    },
    android: {
      additionalSteps: [
        "No additional configuration required for base components",
        "If using vector icons, follow react-native-vector-icons setup",
      ],
    },
    web: {
      additionalDependencies: ["@mdi/react", "@mdi/js"],
      notes: [
        "Icons use @mdi/react on web instead of vector-icons",
        "Ensure your bundler supports .web.tsx and .native.tsx extensions",
      ],
    },
  },

  navigation: {
    packageName: "Navigation",
    npmName: "@idealyst/navigation",
    description: "Unified navigation system for web and React Native",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/navigation",
      npm: "npm install @idealyst/navigation",
    },
    peerDependencies: [
      {
        name: "@react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs",
        required: true,
        platforms: ["native"],
        note: "Required for native navigation",
      },
      {
        name: "react-native-screens react-native-safe-area-context",
        required: true,
        platforms: ["native"],
        note: "Required dependencies for React Navigation",
      },
      {
        name: "react-native-gesture-handler",
        required: true,
        platforms: ["native"],
        note: "Required for gesture-based navigation",
      },
      {
        name: "react-router react-router-dom",
        required: true,
        platforms: ["web"],
        note: "Required for web routing",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: [
        "cd ios && pod install",
        "Add to the top of index.js or App.tsx: import 'react-native-gesture-handler';",
      ],
    },
    android: {
      additionalSteps: [
        "Ensure react-native-screens is configured in MainActivity",
        "Add to the top of index.js or App.tsx: import 'react-native-gesture-handler';",
      ],
    },
    web: {
      additionalDependencies: ["react-router", "react-router-dom"],
    },
  },

  // ============================================================================
  // MEDIA PACKAGES (Complex Native Setup)
  // ============================================================================

  camera: {
    packageName: "Camera",
    npmName: "@idealyst/camera",
    description:
      "Cross-platform camera component for photo and video capture using Vision Camera",
    platforms: ["web", "native"],
    complexity: "complex",
    installation: {
      yarn: "yarn add @idealyst/camera react-native-vision-camera",
      npm: "npm install @idealyst/camera react-native-vision-camera",
    },
    peerDependencies: [
      {
        name: "react-native-vision-camera",
        required: true,
        platforms: ["native"],
        note: "Core camera functionality for React Native",
      },
      {
        name: "react-native-worklets-core",
        required: false,
        platforms: ["native"],
        note: "Required for frame processors",
      },
    ],
    ios: {
      podInstallRequired: true,
      infoPlistEntries: [
        {
          key: "NSCameraUsageDescription",
          value: "$(PRODUCT_NAME) needs access to your camera",
          description: "Required: Camera permission description",
        },
        {
          key: "NSMicrophoneUsageDescription",
          value: "$(PRODUCT_NAME) needs access to your microphone for video recording",
          description: "Required for video recording with audio",
        },
        {
          key: "NSPhotoLibraryUsageDescription",
          value: "$(PRODUCT_NAME) needs access to your photo library to save photos",
          description: "Optional: Only if saving to photo library",
        },
      ],
      additionalSteps: [
        "cd ios && pod install",
        "Ensure minimum iOS deployment target is 13.0 or higher",
        "For advanced features, see: https://react-native-vision-camera.com/docs/guides/",
      ],
    },
    android: {
      permissions: [
        {
          permission: "android.permission.CAMERA",
          description: "Required: Camera access",
        },
        {
          permission: "android.permission.RECORD_AUDIO",
          description: "Required for video recording with audio",
        },
        {
          permission: "android.permission.WRITE_EXTERNAL_STORAGE",
          description: "Optional: Only if saving to external storage (API < 29)",
        },
      ],
      manifestEntries: [
        {
          location: "AndroidManifest.xml (inside <manifest>)",
          xml: `<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />

<!-- Required for camera features -->
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />`,
          description: "Camera and audio permissions",
        },
      ],
      additionalSteps: [
        "Ensure minSdkVersion is 21 or higher in android/build.gradle",
        "Enable Kotlin if not already enabled",
        "For CameraX features, ensure you have the latest camera libraries",
      ],
    },
    web: {
      notes: [
        "Uses native MediaDevices API (WebRTC)",
        "Requires HTTPS in production for camera access",
        "User must grant camera permission in browser",
      ],
    },
    verification: `import { useCamera, CameraPreview, requestPermission } from '@idealyst/camera';

// Request permission
const result = await requestPermission();
// result.granted === true if permission was given

// In a component:
const camera = useCamera({ autoRequestPermission: true });
// camera.permission?.granted, camera.takePhoto(), camera.cameraRef`,
    troubleshooting: [
      {
        issue: "Camera not showing on iOS",
        solution:
          "Ensure NSCameraUsageDescription is in Info.plist and rebuild the app",
      },
      {
        issue: "Permission denied on Android",
        solution:
          "Check AndroidManifest.xml has CAMERA permission and user granted it at runtime",
      },
      {
        issue: "Build fails with Vision Camera",
        solution:
          "Ensure you have the latest CocoaPods (iOS) or Gradle (Android) and clean build",
      },
    ],
  },

  audio: {
    packageName: "Audio",
    npmName: "@idealyst/audio",
    description:
      "Unified cross-platform audio for recording, playback, and PCM streaming using React Native Audio API",
    platforms: ["web", "native"],
    complexity: "complex",
    installation: {
      yarn: "yarn add @idealyst/audio react-native-audio-api",
      npm: "npm install @idealyst/audio react-native-audio-api",
    },
    peerDependencies: [
      {
        name: "react-native-audio-api",
        required: true,
        platforms: ["native"],
        note: "Core audio API for React Native (Web Audio API polyfill)",
      },
    ],
    ios: {
      podInstallRequired: true,
      infoPlistEntries: [
        {
          key: "NSMicrophoneUsageDescription",
          value: "$(PRODUCT_NAME) needs access to your microphone to record audio",
          description: "Required for recording: Microphone permission description",
        },
      ],
      additionalSteps: [
        "cd ios && pod install",
        "Ensure minimum iOS deployment target is 13.0 or higher",
        "For background audio, add audio background mode to Info.plist",
        "Audio session is auto-configured for playAndRecord mode",
      ],
    },
    android: {
      permissions: [
        {
          permission: "android.permission.RECORD_AUDIO",
          description: "Required for recording: Microphone access",
        },
      ],
      manifestEntries: [
        {
          location: "AndroidManifest.xml (inside <manifest>)",
          xml: `<uses-permission android:name="android.permission.RECORD_AUDIO" />`,
          description: "Microphone permission for recording",
        },
      ],
      additionalSteps: [
        "Ensure minSdkVersion is 21 or higher",
        "Permission must be requested at runtime on Android 6.0+",
        "No additional permissions required for playback only",
      ],
    },
    web: {
      notes: [
        "Uses Web Audio API for recording and playback",
        "Requires HTTPS in production for microphone access",
        "User must grant microphone permission in browser for recording",
        "No permissions required for playback only",
        "Supports PCM streaming for real-time TTS playback",
      ],
    },
    verification: `import { useRecorder, usePlayer, useAudio, AUDIO_PROFILES } from '@idealyst/audio';

// Initialize audio session (recommended)
const audio = useAudio();

// Recording
const recorder = useRecorder({ config: AUDIO_PROFILES.speech });
await recorder.start();
// ... later
await recorder.stop();

// File playback
const player = usePlayer();
await player.loadFile('/audio/music.mp3');
await player.play();

// PCM streaming (for TTS)
await player.loadPCMStream(AUDIO_PROFILES.speech);
await player.play();
player.feedPCMData(pcmData);`,
    troubleshooting: [
      {
        issue: "No audio data received during recording",
        solution:
          "Ensure microphone permission is granted and check subscribeToData callback",
      },
      {
        issue: "Build fails on iOS",
        solution:
          "Run pod install and ensure NSMicrophoneUsageDescription is set in Info.plist",
      },
      {
        issue: "Permission prompt not appearing on web",
        solution: "Ensure page is served over HTTPS (required for getUserMedia)",
      },
      {
        issue: "Recording and playback conflict on iOS",
        solution:
          "Use useAudio() hook to initialize session with playAndRecord category, or use SESSION_PRESETS.voiceChat",
      },
      {
        issue: "Audio cuts out when switching between recording and playback",
        solution:
          "Ensure audio session is configured with SESSION_PRESETS.default which enables simultaneous recording and playback",
      },
    ],
  },

  // ============================================================================
  // DATA & STORAGE PACKAGES
  // ============================================================================

  storage: {
    packageName: "Storage",
    npmName: "@idealyst/storage",
    description:
      "Cross-platform key-value storage with MMKV on native and localStorage on web",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/storage react-native-mmkv",
      npm: "npm install @idealyst/storage react-native-mmkv",
    },
    peerDependencies: [
      {
        name: "react-native-mmkv",
        required: true,
        platforms: ["native"],
        note: "High-performance storage for React Native",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: [
        "cd ios && pod install",
        "MMKV requires iOS 11.0 or higher",
      ],
    },
    android: {
      additionalSteps: [
        "No additional configuration required",
        "MMKV auto-links with React Native",
        "Ensure minSdkVersion is 21 or higher",
      ],
    },
    web: {
      notes: [
        "Uses localStorage as the storage backend",
        "Falls back gracefully if localStorage is unavailable",
        "API is identical across platforms",
      ],
    },
    verification: `import { storage } from '@idealyst/storage';

await storage.set('key', { data: 'value' });
const data = await storage.get('key');`,
  },

  datagrid: {
    packageName: "DataGrid",
    npmName: "@idealyst/datagrid",
    description:
      "High-performance virtualized data grid for large datasets",
    platforms: ["web", "native"],
    complexity: "simple",
    installation: {
      yarn: "yarn add @idealyst/datagrid @idealyst/components @idealyst/theme",
      npm: "npm install @idealyst/datagrid @idealyst/components @idealyst/theme",
    },
    peerDependencies: [
      {
        name: "@idealyst/components",
        required: true,
        platforms: ["web", "native"],
      },
      {
        name: "@idealyst/theme",
        required: true,
        platforms: ["web", "native"],
      },
      {
        name: "react-window",
        required: true,
        platforms: ["web"],
        note: "Virtualization library for web",
      },
    ],
    web: {
      additionalDependencies: ["react-window"],
      notes: ["Uses react-window for virtualized rendering on web"],
    },
  },

  // ============================================================================
  // AUTH PACKAGES
  // ============================================================================

  "oauth-client": {
    packageName: "OAuth Client",
    npmName: "@idealyst/oauth-client",
    description: "Universal OAuth2 client with PKCE support for web and React Native. Uses ASWebAuthenticationSession (iOS) and Chrome Custom Tabs (Android) via react-native-inappbrowser-reborn.",
    platforms: ["web", "native"],
    complexity: "complex",
    installation: {
      yarn: "yarn add @idealyst/oauth-client @idealyst/storage react-native-inappbrowser-reborn",
      npm: "npm install @idealyst/oauth-client @idealyst/storage react-native-inappbrowser-reborn",
    },
    peerDependencies: [
      {
        name: "@idealyst/storage",
        required: true,
        platforms: ["web", "native"],
        note: "Required for secure token storage",
      },
      {
        name: "react-native-inappbrowser-reborn",
        required: true,
        platforms: ["native"],
        note: "Required for in-app OAuth browser session (ASWebAuthenticationSession on iOS, Chrome Custom Tabs on Android)",
      },
    ],
    ios: {
      podInstallRequired: true,
      infoPlistEntries: [
        {
          key: "CFBundleURLTypes",
          value: `<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.yourapp</string>
    </array>
  </dict>
</array>`,
          description: "URL scheme for OAuth callback deep links",
        },
      ],
      additionalSteps: [
        "cd ios && pod install",
        "Replace 'com.yourapp' with your app's bundle identifier or custom scheme",
      ],
    },
    android: {
      manifestEntries: [
        {
          location: "AndroidManifest.xml (inside <activity> for MainActivity)",
          xml: `<intent-filter android:label="oauth_callback">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.yourapp" />
</intent-filter>`,
          description:
            "Deep link handler for OAuth callback. Replace 'com.yourapp' with your scheme.",
        },
      ],
      additionalSteps: [
        "Replace 'com.yourapp' with your app's package name or custom scheme",
        "Ensure the scheme matches your OAuth provider's redirect URI configuration",
      ],
    },
    web: {
      notes: [
        "Uses standard browser redirect for OAuth flow",
        "Tokens are stored in localStorage via @idealyst/storage",
        "Configure your OAuth provider to allow your web app's origin",
        "react-native-inappbrowser-reborn is NOT required for web",
      ],
    },
    verification: `import { createOAuthClient } from '@idealyst/oauth-client';

const oauth = createOAuthClient({
  oauthUrl: 'https://api.yourapp.com/auth/google',
  redirectUrl: 'com.yourapp://oauth/callback',
});

await oauth.authorize();`,
    troubleshooting: [
      {
        issue: "OAuth redirect not returning to app (iOS)",
        solution:
          "Ensure CFBundleURLSchemes in Info.plist matches your redirectUrl scheme. Run 'cd ios && pod install' after installing react-native-inappbrowser-reborn.",
      },
      {
        issue: "OAuth redirect not returning to app (Android)",
        solution:
          "Ensure intent-filter scheme in AndroidManifest matches your redirectUrl scheme",
      },
      {
        issue: "InAppBrowser is not available",
        solution:
          "Ensure react-native-inappbrowser-reborn is installed and linked. On iOS, run 'cd ios && pod install'. On Android, the library auto-links.",
      },
      {
        issue: "CORS errors on token exchange (web)",
        solution:
          "Token exchange must be done server-side or ensure provider supports CORS",
      },
    ],
  },

  // ============================================================================
  // UI PACKAGES
  // ============================================================================

  datepicker: {
    packageName: "DatePicker",
    npmName: "@idealyst/datepicker",
    description: "Cross-platform date and time picker components",
    platforms: ["web", "native"],
    complexity: "simple",
    installation: {
      yarn: "yarn add @idealyst/datepicker @idealyst/theme",
      npm: "npm install @idealyst/datepicker @idealyst/theme",
    },
    peerDependencies: [
      {
        name: "@idealyst/theme",
        required: true,
        platforms: ["web", "native"],
      },
      {
        name: "react-native-svg",
        required: false,
        platforms: ["native"],
        note: "Required for calendar icons",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: ["cd ios && pod install (if using react-native-svg)"],
    },
  },

  markdown: {
    packageName: "Markdown",
    npmName: "@idealyst/markdown",
    description:
      "Cross-platform markdown renderer with GitHub Flavored Markdown support",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/markdown @idealyst/theme",
      npm: "npm install @idealyst/markdown @idealyst/theme",
    },
    peerDependencies: [
      {
        name: "@idealyst/theme",
        required: true,
        platforms: ["web", "native"],
      },
      {
        name: "react-markdown remark-gfm",
        required: true,
        platforms: ["web"],
        note: "Required for web markdown rendering",
      },
      {
        name: "react-native-markdown-display react-native-webview",
        required: true,
        platforms: ["native"],
        note: "Required for native markdown rendering",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: [
        "cd ios && pod install",
        "WebView requires additional iOS configuration for some features",
      ],
    },
    android: {
      additionalSteps: [
        "No additional configuration for basic markdown",
        "WebView is included in React Native by default",
      ],
    },
    web: {
      additionalDependencies: ["react-markdown", "remark-gfm"],
    },
  },

  blur: {
    packageName: "Blur",
    npmName: "@idealyst/blur",
    description: "Cross-platform blur component",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/blur @react-native-community/blur",
      npm: "npm install @idealyst/blur @react-native-community/blur",
    },
    peerDependencies: [
      {
        name: "@react-native-community/blur",
        required: true,
        platforms: ["native"],
        note: "Native blur implementation",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: ["cd ios && pod install"],
    },
    android: {
      additionalSteps: [
        "Blur uses RenderScript which is included in Android SDK",
        "Ensure compileSdkVersion is 31 or higher",
      ],
    },
    web: {
      notes: ["Uses CSS backdrop-filter for blur effect on web"],
    },
  },

  lottie: {
    packageName: "Lottie",
    npmName: "@idealyst/lottie",
    description: "Cross-platform Lottie animation support",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/lottie lottie-react-native lottie-web",
      npm: "npm install @idealyst/lottie lottie-react-native lottie-web",
    },
    peerDependencies: [
      {
        name: "lottie-react-native",
        required: true,
        platforms: ["native"],
        note: "Native Lottie player",
      },
      {
        name: "lottie-web",
        required: true,
        platforms: ["web"],
        note: "Web Lottie player",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: ["cd ios && pod install"],
    },
    android: {
      additionalSteps: ["No additional configuration required"],
    },
  },

  animate: {
    packageName: "Animate",
    npmName: "@idealyst/animate",
    description: "Cross-platform animation utilities",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/animate react-native-reanimated",
      npm: "npm install @idealyst/animate react-native-reanimated",
    },
    peerDependencies: [
      {
        name: "react-native-reanimated",
        required: true,
        platforms: ["native"],
        note: "Core animation library",
      },
      {
        name: "react-native-svg",
        required: false,
        platforms: ["native"],
        note: "Required for animated SVGs",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: ["cd ios && pod install"],
    },
    android: {
      additionalSteps: [
        "Add Reanimated Babel plugin to babel.config.js:",
        "plugins: ['react-native-reanimated/plugin']",
        "Ensure Hermes is enabled for best performance",
      ],
    },
  },

  // ============================================================================
  // UTILITY PACKAGES
  // ============================================================================

  translate: {
    packageName: "Translate",
    npmName: "@idealyst/translate",
    description: "Internationalization (i18n) package with Babel plugin support",
    platforms: ["web", "native"],
    complexity: "simple",
    installation: {
      yarn: "yarn add @idealyst/translate i18next react-i18next",
      npm: "npm install @idealyst/translate i18next react-i18next",
    },
    peerDependencies: [
      {
        name: "i18next",
        required: true,
        platforms: ["web", "native"],
      },
      {
        name: "react-i18next",
        required: true,
        platforms: ["web", "native"],
      },
    ],
    verification: `import { TranslateProvider, useTranslation } from '@idealyst/translate';

<TranslateProvider translations={translations} defaultLanguage="en">
  <App />
</TranslateProvider>`,
  },

  config: {
    packageName: "Config",
    npmName: "@idealyst/config",
    description:
      "Cross-platform configuration and environment variable support",
    platforms: ["web", "native", "node"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/config react-native-config",
      npm: "npm install @idealyst/config react-native-config",
    },
    peerDependencies: [
      {
        name: "react-native-config",
        required: true,
        platforms: ["native"],
        note: "Required for native environment variables",
      },
    ],
    ios: {
      podInstallRequired: true,
      additionalSteps: [
        "cd ios && pod install",
        "Create .env file in project root",
        "Add .env to .gitignore",
      ],
    },
    android: {
      gradleChanges: [
        {
          file: "android/app/build.gradle",
          changes: `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`,
          description: "Add dotenv gradle plugin for environment variables",
        },
      ],
      additionalSteps: [
        "Create .env file in project root",
        "Add .env to .gitignore",
      ],
    },
    web: {
      notes: [
        "Uses Vite's import.meta.env or process.env depending on bundler",
        "Configure environment variables in your bundler (Vite, Webpack, etc.)",
      ],
    },
  },

  // ============================================================================
  // TOOLING PACKAGES
  // ============================================================================

  cli: {
    packageName: "CLI",
    npmName: "@idealyst/cli",
    description: "Command-line tool for generating Idealyst projects",
    platforms: ["node"],
    complexity: "simple",
    installation: {
      yarn: "yarn global add @idealyst/cli",
      npm: "npm install -g @idealyst/cli",
    },
    verification: `# Create a new workspace
npx @idealyst/cli init my-app

# Or use directly without installing
npx @idealyst/cli create mobile --type native`,
  },

  tooling: {
    packageName: "Tooling",
    npmName: "@idealyst/tooling",
    description: "Code analysis and validation utilities for Idealyst Framework",
    platforms: ["node"],
    complexity: "simple",
    installation: {
      yarn: "yarn add -D @idealyst/tooling",
      npm: "npm install -D @idealyst/tooling",
    },
    verification: `// vite.config.ts
import { idealystPlugin } from '@idealyst/tooling/vite';

export default {
  plugins: [idealystPlugin()],
};`,
  },

  "mcp-server": {
    packageName: "MCP Server",
    npmName: "@idealyst/mcp-server",
    description:
      "Model Context Protocol server for AI assistant integration",
    platforms: ["node"],
    complexity: "simple",
    installation: {
      yarn: "yarn add @idealyst/mcp-server",
      npm: "npm install @idealyst/mcp-server",
    },
    verification: `// .mcp.json (Claude Code)
{
  "mcpServers": {
    "idealyst": {
      "command": "node",
      "args": ["node_modules/@idealyst/mcp-server/dist/index.js"]
    }
  }
}`,
  },

  // ============================================================================
  // FILES PACKAGE
  // ============================================================================

  "files": {
    packageName: "Files",
    npmName: "@idealyst/files",
    description:
      "Cross-platform file picker, upload, and local file management for React and React Native",
    platforms: ["web", "native"],
    complexity: "moderate",
    installation: {
      yarn: "yarn add @idealyst/files",
      npm: "npm install @idealyst/files",
    },
    peerDependencies: [
      {
        name: "react-native-document-picker",
        required: true,
        platforms: ["native"],
        note: "Required for document selection on native",
      },
      {
        name: "react-native-image-picker",
        required: true,
        platforms: ["native"],
        note: "Required for image/video selection and camera capture",
      },
      {
        name: "react-native-blob-util",
        required: true,
        platforms: ["native"],
        note: "Required for file uploads with progress tracking and background support",
      },
    ],
    ios: {
      podInstallRequired: true,
      infoPlistEntries: [
        {
          key: "NSPhotoLibraryUsageDescription",
          value: "$(PRODUCT_NAME) needs access to your photo library to select images",
          description: "Required for photo library access",
        },
        {
          key: "NSCameraUsageDescription",
          value: "$(PRODUCT_NAME) needs access to your camera to take photos",
          description: "Required for camera capture",
        },
        {
          key: "NSMicrophoneUsageDescription",
          value: "$(PRODUCT_NAME) needs access to your microphone to record video",
          description: "Required for video recording with audio",
        },
        {
          key: "UIBackgroundModes",
          value: "<array><string>fetch</string></array>",
          description: "Required for background uploads (optional)",
        },
      ],
      additionalSteps: [
        "Run 'cd ios && pod install' after installing dependencies",
        "For background uploads, add 'fetch' to UIBackgroundModes in Info.plist",
      ],
    },
    android: {
      permissions: [
        {
          permission: "android.permission.READ_EXTERNAL_STORAGE",
          description: "Required for file access on Android 12 and below",
        },
        {
          permission: "android.permission.READ_MEDIA_IMAGES",
          description: "Required for image access on Android 13+",
        },
        {
          permission: "android.permission.READ_MEDIA_VIDEO",
          description: "Required for video access on Android 13+",
        },
        {
          permission: "android.permission.CAMERA",
          description: "Required for camera capture",
        },
      ],
      additionalSteps: [
        "Ensure minSdkVersion is at least 21 in android/build.gradle",
        "For Android 13+, use granular media permissions",
      ],
    },
    web: {
      notes: [
        "No additional configuration required for web",
        "Drag and drop works automatically in the DropZone component",
        "File picker uses native browser file input",
      ],
    },
    verification: `import { useFilePicker, useFileUpload } from '@idealyst/files';

function Test() {
  const { pick, files } = useFilePicker();
  const { addFiles, uploads } = useFileUpload();

  const handleUpload = async () => {
    const result = await pick({ allowedTypes: ['image'] });
    if (!result.cancelled) {
      addFiles(result.files, { url: '/api/upload' });
    }
  };

  return <Button onPress={handleUpload}>Upload</Button>;
}`,
    troubleshooting: [
      {
        issue: "File picker doesn't open on iOS",
        solution:
          "Ensure NSPhotoLibraryUsageDescription is set in Info.plist and permissions are granted",
      },
      {
        issue: "File picker doesn't open on Android",
        solution:
          "Check that storage permissions are requested at runtime for Android 13+",
      },
      {
        issue: "Upload progress not updating",
        solution:
          "Verify react-native-blob-util is installed and linked correctly",
      },
      {
        issue: "Background uploads fail on iOS",
        solution:
          "Add 'fetch' to UIBackgroundModes array in Info.plist",
      },
    ],
  },

  notifications: {
    packageName: "Notifications",
    npmName: "@idealyst/notifications",
    description:
      "Cross-platform push and local notifications. Push via Firebase Cloud Messaging (native) and Web Push API (web). Local via Notifee (native) and Notification API (web).",
    platforms: ["native", "web"],
    complexity: "complex",
    installation: {
      yarn: "yarn add @idealyst/notifications\n# Native push:\nyarn add @react-native-firebase/app @react-native-firebase/messaging\n# Native local:\nyarn add @notifee/react-native",
      npm: "npm install @idealyst/notifications\n# Native push:\nnpm install @react-native-firebase/app @react-native-firebase/messaging\n# Native local:\nnpm install @notifee/react-native",
    },
    peerDependencies: [
      {
        name: "@react-native-firebase/app",
        required: false,
        platforms: ["native"],
        note: "Required for push notifications on native. Firebase is the only Android push transport (FCM replaced GCM in 2019).",
      },
      {
        name: "@react-native-firebase/messaging",
        required: false,
        platforms: ["native"],
        note: "Required for push notifications on native. Wraps FCM (Android) and APNs (iOS).",
      },
      {
        name: "@notifee/react-native",
        required: false,
        platforms: ["native"],
        note: "Required for local notifications on native. Rich notifications, channels, categories, scheduling.",
      },
      {
        name: "react-native",
        required: false,
        platforms: ["native"],
      },
    ],
    ios: {
      podInstallRequired: true,
      infoPlistEntries: [
        {
          key: "UIBackgroundModes",
          value: "<array>\n  <string>remote-notification</string>\n</array>",
          description:
            "Enable background remote notifications. Required for push to work when app is in background.",
        },
      ],
      additionalSteps: [
        "Enable Push Notifications capability in Xcode: Signing & Capabilities → + Capability → Push Notifications",
        "Enable Background Modes → Remote notifications in Xcode",
        "Download GoogleService-Info.plist from Firebase Console and add to your iOS project root (same level as Info.plist)",
        "If not using Cocoapods auto-linking: add FirebaseAppDelegateProxyEnabled = YES to Info.plist",
        "For APNs: upload your APNs authentication key (.p8) or certificate to Firebase Console → Project Settings → Cloud Messaging",
      ],
    },
    android: {
      permissions: [
        {
          permission: "android.permission.POST_NOTIFICATIONS",
          description:
            "Required on Android 13+ (API 33) to show notifications. Must be requested at runtime.",
        },
        {
          permission: "android.permission.RECEIVE_BOOT_COMPLETED",
          description:
            "Required for scheduled notifications to persist across device reboots.",
        },
        {
          permission: "android.permission.VIBRATE",
          description:
            "Required for notification vibration patterns.",
        },
      ],
      gradleChanges: [
        {
          file: "android/build.gradle (project level)",
          changes:
            'buildscript {\n  dependencies {\n    // Add Google services Gradle plugin\n    classpath \'com.google.gms:google-services:4.4.0\'\n  }\n}',
          description:
            "Add Google Services plugin to project-level build.gradle",
        },
        {
          file: "android/app/build.gradle",
          changes:
            "apply plugin: 'com.google.gms.google-services'",
          description:
            "Apply Google Services plugin at the bottom of app-level build.gradle",
        },
      ],
      additionalSteps: [
        "Download google-services.json from Firebase Console and place in android/app/",
        "For Android 13+ (API 33): request POST_NOTIFICATIONS permission at runtime before calling register()",
        "Create a default notification channel in Application.onCreate() or use createChannel() from the package",
      ],
    },
    web: {
      notes: [
        "Call configurePush({ vapidKey }) before registering for push (get VAPID key from your push server or Firebase Console)",
        "Create a service worker (default: /firebase-messaging-sw.js) to handle background push messages",
        "Web push tokens are PushSubscription objects (JSON-serialized) — send to your server for push delivery",
        "Web local notification scheduling uses setTimeout — notifications are lost if the page is closed",
        "Badge API (navigator.setAppBadge) requires the page to be served over HTTPS and works in PWA context",
      ],
    },
    verification: `import {
  usePushNotifications,
  useLocalNotifications,
  useNotificationPermissions,
} from '@idealyst/notifications';

function Test() {
  const { status, requestPermission } = useNotificationPermissions();
  const { token, register } = usePushNotifications();
  const { displayNotification } = useLocalNotifications();

  const handleSetup = async () => {
    await requestPermission();
    const pushToken = await register();
    console.log('Push token:', pushToken);
    await displayNotification({
      title: 'Setup Complete',
      body: 'Notifications are working!',
    });
  };

  return <Button onPress={handleSetup}>Enable Notifications</Button>;
}`,
    troubleshooting: [
      {
        issue: "Push token is null on native",
        solution:
          "Ensure GoogleService-Info.plist (iOS) or google-services.json (Android) is properly configured. Verify Push Notifications capability is enabled in Xcode. Check that @react-native-firebase/app and @react-native-firebase/messaging are installed.",
      },
      {
        issue: "Notifications not showing on Android 13+",
        solution:
          "Android 13 (API 33) requires runtime POST_NOTIFICATIONS permission. Call requestPermission() before register(). Check that a default notification channel exists.",
      },
      {
        issue: "Background notifications not received on iOS",
        solution:
          "Enable Background Modes → Remote notifications in Xcode. Ensure UIBackgroundModes includes 'remote-notification' in Info.plist. Verify APNs key is uploaded to Firebase Console.",
      },
      {
        issue: "Web push subscription fails",
        solution:
          "Ensure configurePush({ vapidKey }) is called before getPushToken(). Verify the service worker is registered and accessible. Check that the page is served over HTTPS.",
      },
      {
        issue: "Local notifications not appearing on native",
        solution:
          "Verify @notifee/react-native is installed and linked. On Android, ensure a notification channel is created before displaying. On iOS, ensure notification permissions are granted.",
      },
      {
        issue: "Scheduled notifications lost on web",
        solution:
          "Web scheduling uses setTimeout which only works while the page is open. For persistent web scheduling, use a service worker with the Push API or a server-side scheduler.",
      },
    ],
  },
};

/**
 * Get installation guide for a package
 */
export function getInstallGuide(packageName: string): InstallGuide | undefined {
  const normalizedName = packageName.replace("@idealyst/", "").toLowerCase();
  return installGuides[normalizedName];
}

/**
 * Get all packages that require complex native setup
 */
export function getComplexPackages(): InstallGuide[] {
  return Object.values(installGuides).filter((g) => g.complexity === "complex");
}

/**
 * Get all packages by complexity level
 */
export function getPackagesByComplexity(
  complexity: "simple" | "moderate" | "complex"
): InstallGuide[] {
  return Object.values(installGuides).filter((g) => g.complexity === complexity);
}

/**
 * Format installation guide as markdown
 */
export function formatInstallGuideMarkdown(guide: InstallGuide): string {
  let md = `# ${guide.packageName} Installation Guide

**Package:** \`${guide.npmName}\`
**Platforms:** ${guide.platforms.join(", ")}
**Complexity:** ${guide.complexity}

${guide.description}

## Installation

\`\`\`bash
# Using Yarn
${guide.installation.yarn}

# Using npm
${guide.installation.npm}
\`\`\`
`;

  // Peer Dependencies
  if (guide.peerDependencies && guide.peerDependencies.length > 0) {
    md += `\n## Peer Dependencies\n\n`;
    for (const dep of guide.peerDependencies) {
      const required = dep.required ? "**Required**" : "Optional";
      const platforms = dep.platforms.join(", ");
      md += `- \`${dep.name}\` - ${required} (${platforms})`;
      if (dep.note) {
        md += ` - ${dep.note}`;
      }
      md += "\n";
    }
  }

  // iOS Configuration
  if (guide.ios && guide.platforms.includes("native")) {
    md += `\n## iOS Configuration\n\n`;

    if (guide.ios.podInstallRequired) {
      md += `\`\`\`bash
cd ios && pod install
\`\`\`\n\n`;
    }

    if (guide.ios.infoPlistEntries && guide.ios.infoPlistEntries.length > 0) {
      md += `### Info.plist Entries\n\nAdd the following to your \`ios/YourApp/Info.plist\`:\n\n\`\`\`xml\n`;
      for (const entry of guide.ios.infoPlistEntries) {
        md += `<!-- ${entry.description} -->\n`;
        md += `<key>${entry.key}</key>\n`;
        if (entry.value.includes("<")) {
          md += `${entry.value}\n`;
        } else {
          md += `<string>${entry.value}</string>\n`;
        }
        md += "\n";
      }
      md += `\`\`\`\n`;
    }

    if (guide.ios.additionalSteps && guide.ios.additionalSteps.length > 0) {
      md += `### Additional Steps\n\n`;
      for (const step of guide.ios.additionalSteps) {
        md += `- ${step}\n`;
      }
    }
  }

  // Android Configuration
  if (guide.android && guide.platforms.includes("native")) {
    md += `\n## Android Configuration\n\n`;

    if (guide.android.permissions && guide.android.permissions.length > 0) {
      md += `### Permissions\n\nAdd to \`android/app/src/main/AndroidManifest.xml\`:\n\n\`\`\`xml\n`;
      for (const perm of guide.android.permissions) {
        md += `<!-- ${perm.description} -->\n`;
        md += `<uses-permission android:name="${perm.permission}" />\n`;
      }
      md += `\`\`\`\n`;
    }

    if (guide.android.manifestEntries && guide.android.manifestEntries.length > 0) {
      md += `### Manifest Entries\n\n`;
      for (const entry of guide.android.manifestEntries) {
        md += `**${entry.location}:**\n`;
        md += `\n\`\`\`xml\n${entry.xml}\n\`\`\`\n\n`;
        md += `_${entry.description}_\n\n`;
      }
    }

    if (guide.android.gradleChanges && guide.android.gradleChanges.length > 0) {
      md += `### Gradle Changes\n\n`;
      for (const change of guide.android.gradleChanges) {
        md += `**${change.file}:**\n`;
        md += `\n\`\`\`groovy\n${change.changes}\n\`\`\`\n\n`;
        md += `_${change.description}_\n\n`;
      }
    }

    if (guide.android.additionalSteps && guide.android.additionalSteps.length > 0) {
      md += `### Additional Steps\n\n`;
      for (const step of guide.android.additionalSteps) {
        md += `- ${step}\n`;
      }
    }
  }

  // Web Configuration
  if (guide.web && guide.platforms.includes("web")) {
    md += `\n## Web Configuration\n\n`;

    if (guide.web.additionalDependencies && guide.web.additionalDependencies.length > 0) {
      md += `### Additional Dependencies\n\n\`\`\`bash\nyarn add ${guide.web.additionalDependencies.join(" ")}\n\`\`\`\n\n`;
    }

    if (guide.web.bundlerConfig) {
      md += `### Bundler Configuration\n\n\`\`\`js\n${guide.web.bundlerConfig}\n\`\`\`\n\n`;
    }

    if (guide.web.notes && guide.web.notes.length > 0) {
      md += `### Notes\n\n`;
      for (const note of guide.web.notes) {
        md += `- ${note}\n`;
      }
    }
  }

  // Verification
  if (guide.verification) {
    md += `\n## Verification\n\nTest your installation:\n\n\`\`\`tsx\n${guide.verification}\n\`\`\`\n`;
  }

  // Troubleshooting
  if (guide.troubleshooting && guide.troubleshooting.length > 0) {
    md += `\n## Troubleshooting\n\n`;
    for (const item of guide.troubleshooting) {
      md += `### ${item.issue}\n\n${item.solution}\n\n`;
    }
  }

  return md;
}
