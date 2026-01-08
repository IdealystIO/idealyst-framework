import React from 'react';
import { View, Text, Card, Button, Screen } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';
import { CodeBlock } from '../../components/CodeBlock';
import { LivePreview } from '../../components/LivePreview';

export function UseNavigatorPage() {
  const { navigate, goBack } = useNavigator();

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text size="xl" weight="bold" style={{ marginBottom: 16 }}>
          useNavigator Hook
        </Text>

        <Text style={{ marginBottom: 32, lineHeight: 26, color: '#333333' }}>
          The <Text weight="semibold">useNavigator()</Text> hook provides programmatic
          navigation capabilities. It works identically on web and native platforms.
        </Text>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          Basic Usage
        </Text>

        <CodeBlock title="useNavigator Hook">
{`import { useNavigator } from '@idealyst/navigation';

function MyComponent() {
  const { navigate, goBack, currentPath } = useNavigator();

  // Navigate to a path
  const handleNavigate = () => {
    navigate({ path: '/profile' });
  };

  // Go back to previous screen
  const handleBack = () => {
    goBack();
  };

  return (
    <View>
      <Text>Current: {currentPath}</Text>
      <Button onPress={handleNavigate}>Go to Profile</Button>
      <Button onPress={handleBack}>Go Back</Button>
    </View>
  );
}`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Live Example
        </Text>

        <LivePreview title="Navigation Demo">
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Button onPress={() => navigate({ path: '/' })} size="sm">
              Go Home
            </Button>
            <Button onPress={() => navigate({ path: '/theme/overview' })} size="sm" intent="neutral">
              Theme Docs
            </Button>
            <Button onPress={() => navigate({ path: '/components/overview' })} size="sm" intent="success">
              Components
            </Button>
            <Button onPress={() => goBack()} size="sm" type="outlined">
              Go Back
            </Button>
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Return Values
        </Text>

        <Card variant="outlined" style={{ padding: 20, marginBottom: 24 }}>
          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>navigate(options)</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Navigate to a new screen. Accepts an object with a <Text weight="semibold">path</Text> property.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>goBack()</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Navigate back to the previous screen in the navigation stack. No-op if at root.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>currentPath</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              The current route path as a string. Useful for highlighting active navigation items.
            </Text>
          </View>

          <View>
            <Text weight="semibold" style={{ marginBottom: 4 }}>params</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Route parameters extracted from the URL pattern (e.g., :id becomes params.id).
            </Text>
          </View>
        </Card>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Path-Based Navigation
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          All navigation in Idealyst uses path-based routing. Paths can include
          parameters and query strings.
        </Text>

        <CodeBlock title="Navigation Patterns">
{`const { navigate } = useNavigator();

// Simple path navigation
navigate({ path: '/home' });

// Nested paths
navigate({ path: '/settings/profile' });

// Dynamic parameters (if route defined as /users/:id)
navigate({ path: '/users/123' });

// Deep nested paths
navigate({ path: '/products/electronics/phones/iphone-15' });`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Accessing Route Parameters
        </Text>

        <CodeBlock title="Route Parameters">
{`// Route defined as: { path: 'users/:userId', ... }

function UserProfile() {
  const { params } = useNavigator();

  // Access the userId parameter
  const userId = params.userId;

  return <Text>Viewing user: {userId}</Text>;
}

// Navigate with parameter
navigate({ path: '/users/42' });
// -> params.userId === '42'`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Common Patterns
        </Text>

        <CodeBlock title="Navigation Patterns">
{`// Conditional navigation based on state
const handleSubmit = async () => {
  const success = await saveData();
  if (success) {
    navigate({ path: '/success' });
  }
};

// Navigation with confirmation
const handleDelete = () => {
  if (confirm('Are you sure?')) {
    deleteItem();
    goBack();
  }
};

// Navigate and replace history (prevents back)
// Use for login -> dashboard flows
navigate({ path: '/dashboard', replace: true });

// Active link highlighting
const { currentPath } = useNavigator();
const isActive = currentPath === '/home';

<Button
  intent={isActive ? 'primary' : 'neutral'}
  onPress={() => navigate({ path: '/home' })}
>
  Home
</Button>`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          TypeScript Types
        </Text>

        <CodeBlock title="Hook Type Definition">
{`type NavigateOptions = {
  path: string;
  replace?: boolean; // Replace current history entry
};

type UseNavigatorReturn = {
  navigate: (options: NavigateOptions) => void;
  goBack: () => void;
  currentPath: string;
  params: Record<string, string>;
};

// Usage with types
const {
  navigate,
  goBack,
  currentPath,
  params
}: UseNavigatorReturn = useNavigator();`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Platform Behavior
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Card variant="outlined" style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Web</Text>
            <Text size="sm" style={{ color: '#666666', lineHeight: 22 }}>
              {`• Updates browser URL
• Supports browser back/forward
• Deep linking works automatically
• SEO-friendly URLs
• History API integration`}
            </Text>
          </Card>

          <Card variant="outlined" style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Native</Text>
            <Text size="sm" style={{ color: '#666666', lineHeight: 22 }}>
              {`• Native navigation gestures
• Platform-specific transitions
• Deep link handling
• Stack-based navigation
• Hardware back button support`}
            </Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
