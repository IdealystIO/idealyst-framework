import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function NavigationOverviewPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Navigation Overview
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Idealyst provides a unified navigation system that works identically on web and native.
          Define your routes once with full TypeScript support, and get platform-optimized
          navigation automatically.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Architecture
        </Text>

        <View
          background="inverse"
          style={{
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <Text
            typography="body2"
            color="inverse"
            style={{ fontFamily: 'monospace', lineHeight: 20 }}
          >
{`┌─────────────────────────────────────────────────┐
│           NavigatorProvider                      │
│  (Wraps app with routing context)                │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│         NavigatorParam (Route Config)            │
│  • Stack layouts (push/pop navigation)           │
│  • Tab layouts (bottom tab bar)                  │
│  • Drawer layouts (side menu)                    │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│           Platform Adapters                      │
│  • Web: react-router-dom                         │
│  • Native: @react-navigation/native              │
└─────────────────────────────────────────────────┘`}
          </Text>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Key Concepts
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>NavigatorProvider</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Root component that wraps your app and provides navigation context.
              Pass your route configuration via the <Text weight="semibold">route</Text> prop.
            </Text>
          </Card>

          <Card variant="outlined" style={{ padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>NavigatorParam</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Type for route configuration objects. Supports three layouts: stack, tab, and drawer.
              Routes can be nested to create complex navigation hierarchies.
            </Text>
          </Card>

          <Card variant="outlined" style={{ padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>useNavigator()</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Hook for programmatic navigation. Provides navigate(), goBack(), and current
              route information. Works identically on all platforms.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Quick Start
        </Text>

        <CodeBlock title="Basic Navigation Setup">
{`import { NavigatorProvider, NavigatorParam } from '@idealyst/navigation';
import { HomeScreen } from './screens/Home';
import { ProfileScreen } from './screens/Profile';
import { SettingsScreen } from './screens/Settings';

// Define your routes
const AppRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  routes: [
    { path: '/', type: 'screen', component: HomeScreen },
    { path: 'profile', type: 'screen', component: ProfileScreen },
    { path: 'settings', type: 'screen', component: SettingsScreen },
  ],
};

// Wrap your app
export function App() {
  return <NavigatorProvider route={AppRouter} />;
}`}
        </CodeBlock>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Layout Types
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <Card variant="outlined" style={{ flex: 1, minWidth: 200, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Stack</Text>
            <Text typography="body2" color="tertiary">
              Push/pop navigation with back button. Default for most apps.
            </Text>
          </Card>

          <Card variant="outlined" style={{ flex: 1, minWidth: 200, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Tab</Text>
            <Text typography="body2" color="tertiary">
              Bottom tab bar navigation. Great for main app sections.
            </Text>
          </Card>

          <Card variant="outlined" style={{ flex: 1, minWidth: 200, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Drawer</Text>
            <Text typography="body2" color="tertiary">
              Side menu navigation. Perfect for docs and admin panels.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Navigation Example
        </Text>

        <CodeBlock title="Using useNavigator()">
{`import { useNavigator } from '@idealyst/navigation';
import { Button } from '@idealyst/components';

function HomeScreen() {
  const { navigate, goBack } = useNavigator();

  return (
    <View>
      {/* Path-based navigation */}
      <Button onPress={() => navigate({ path: '/profile' })}>
        Go to Profile
      </Button>

      {/* With parameters */}
      <Button onPress={() => navigate({ path: '/profile/123' })}>
        View User 123
      </Button>

      {/* Go back */}
      <Button onPress={() => goBack()}>
        Go Back
      </Button>
    </View>
  );
}`}
        </CodeBlock>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Platform Differences
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>Web</Text>
            <Text typography="body2" color="tertiary">
              Uses react-router-dom under the hood. URLs are real browser URLs
              with proper history management and deep linking.
            </Text>
          </View>

          <View>
            <Text weight="semibold" style={{ marginBottom: 4 }}>Native</Text>
            <Text typography="body2" color="tertiary">
              Uses @react-navigation/native with platform-specific transitions,
              gestures, and native navigation patterns.
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
