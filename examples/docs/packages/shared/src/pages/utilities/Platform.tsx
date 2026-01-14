import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function PlatformPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Platform
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          A cross-platform utility for detecting the current platform and selecting
          platform-specific values. Works identically on web and native.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Import
        </Text>

        <CodeBlock
          code={`import { Platform } from '@idealyst/components';`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Platform Detection
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Use boolean properties to check the current platform:
        </Text>

        <CodeBlock
          title="Platform properties"
          code={`import { Platform } from '@idealyst/components';

// Current platform system
Platform.system   // 'web' | 'ios' | 'android'

// Boolean checks
Platform.isWeb      // true on web, false on native
Platform.isNative   // true on iOS/Android, false on web
Platform.isIOS      // true only on iOS
Platform.isAndroid  // true only on Android`}
        />

        <CodeBlock
          title="Conditional rendering"
          code={`import { Platform, View, Text } from '@idealyst/components';

function MyComponent() {
  return (
    <View>
      {Platform.isWeb && (
        <Text>This only shows on web</Text>
      )}
      {Platform.isNative && (
        <Text>This only shows on mobile</Text>
      )}
      {Platform.isIOS && (
        <Text>iOS-specific content</Text>
      )}
    </View>
  );
}`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Platform.select()
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Select a value based on the current platform. Supports platform-specific values,
          a <Text weight="semibold">native</Text> fallback for iOS/Android, and a{' '}
          <Text weight="semibold">default</Text> fallback for any platform.
        </Text>

        <CodeBlock
          title="Basic usage"
          code={`import { Platform } from '@idealyst/components';

// Select different values per platform
const padding = Platform.select({
  web: 24,
  ios: 16,
  android: 12,
});

// Use 'native' as fallback for both iOS and Android
const fontFamily = Platform.select({
  web: 'Inter, sans-serif',
  native: 'System',
});

// Use 'default' as universal fallback
const borderRadius = Platform.select({
  ios: 12,
  default: 8,  // Used for web and Android
});`}
        />

        <CodeBlock
          title="With styles"
          code={`import { Platform, View } from '@idealyst/components';

function Card({ children }) {
  return (
    <View
      style={{
        padding: Platform.select({
          web: 24,
          native: 16,
        }),
        // Web uses box-shadow, native uses elevation
        ...Platform.select({
          web: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
          android: {
            elevation: 4,
          },
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
        }),
      }}
    >
      {children}
    </View>
  );
}`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Resolution Order
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Platform.select() resolves values in the following order:
        </Text>

        <View style={{ gap: 12, marginBottom: 24 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>On Web</Text>
            <Text typography="body2" color="tertiary" style={{ fontFamily: 'monospace' }}>
              web → default → undefined
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>On iOS</Text>
            <Text typography="body2" color="tertiary" style={{ fontFamily: 'monospace' }}>
              ios → native → default → undefined
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>On Android</Text>
            <Text typography="body2" color="tertiary" style={{ fontFamily: 'monospace' }}>
              android → native → default → undefined
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          TypeScript Types
        </Text>

        <CodeBlock
          title="Type definitions"
          code={`type PlatformSystem = 'web' | 'ios' | 'android';

type PlatformSelectSpec<T> = {
  web?: T;
  ios?: T;
  android?: T;
  native?: T;   // Fallback for ios and android
  default?: T;  // Fallback for any platform
};

interface PlatformAPI {
  system: PlatformSystem;
  isWeb: boolean;
  isNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  select<T>(spec: PlatformSelectSpec<T>): T | undefined;
}`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Common Patterns
        </Text>

        <CodeBlock
          title="Platform-specific imports"
          code={`// Instead of conditional imports, use Platform.select for values
// For platform-specific components, use .web.tsx / .native.tsx files

// ✅ Good: Platform-specific values
const hitSlop = Platform.select({
  native: { top: 10, bottom: 10, left: 10, right: 10 },
  web: undefined,
});

// ✅ Good: Platform-specific component files
// Button.web.tsx  - web implementation
// Button.native.tsx - native implementation
// index.ts - re-exports based on platform`}
        />

        <CodeBlock
          title="Navigation behavior"
          code={`import { Platform } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';

function BackButton() {
  const { goBack, canGoBack } = useNavigator();

  // Only show back button on native (web has browser back)
  if (Platform.isWeb) {
    return null;
  }

  return (
    <Button
      intent="secondary"
      onPress={goBack}
      disabled={!canGoBack}
    >
      Back
    </Button>
  );
}`}
        />

        <CodeBlock
          title="Keyboard handling"
          code={`import { Platform } from '@idealyst/components';

function SearchInput() {
  return (
    <Input
      placeholder="Search..."
      // Native needs explicit keyboard type
      keyboardType={Platform.select({
        native: 'web-search',
        web: undefined,
      })}
      // Native needs return key configuration
      returnKeyType={Platform.select({
        native: 'search',
        web: undefined,
      })}
    />
  );
}`}
        />
      </View>
    </Screen>
  );
}
