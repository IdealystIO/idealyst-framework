import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { useNavigator, useCurrentPath } from '@idealyst/navigation';
import { CodeBlock } from '../../components/CodeBlock';
import { LivePreview } from '../../components/LivePreview';

export function NavigationHooksPage() {
  const { navigate } = useNavigator();
  const currentPath = useCurrentPath();

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Navigation Hooks
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Idealyst Navigation provides several hooks for accessing navigation state
          and route information. These hooks work identically on web and native platforms.
        </Text>

        {/* useCurrentPath */}
        <Text weight="semibold" typography="h3" style={{ marginBottom: 16 }}>
          useCurrentPath
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Returns the current path the user is on. This is useful for displaying
          breadcrumbs, active navigation indicators, or any UI that depends on
          the current location.
        </Text>

        <CodeBlock
          title="useCurrentPath Hook"
          code={`import { useCurrentPath } from '@idealyst/navigation';

function Breadcrumb() {
  const currentPath = useCurrentPath();

  return (
    <View>
      <Text>You are here: {currentPath}</Text>
    </View>
  );
}`}
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 24, marginBottom: 12 }}>
          Live Example
        </Text>

        <LivePreview title="Current Path Display">
          <Card style={{ padding: 16 }}>
            <Text typography="body2" color="tertiary" style={{ marginBottom: 4 }}>
              Current Path:
            </Text>
            <Text typography="h4" weight="semibold">
              {currentPath}
            </Text>
          </Card>
        </LivePreview>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Common Use Cases
        </Text>

        <CodeBlock
          title="Active Navigation Highlighting"
          code={`import { useCurrentPath } from '@idealyst/navigation';

function NavItem({ path, label }) {
  const currentPath = useCurrentPath();
  const isActive = currentPath === path;

  return (
    <Button
      intent={isActive ? 'primary' : 'neutral'}
      type={isActive ? 'filled' : 'ghost'}
    >
      {label}
    </Button>
  );
}`}
        />

        <CodeBlock
          title="Breadcrumbs"
          code={`import { useCurrentPath } from '@idealyst/navigation';

function Breadcrumbs() {
  const currentPath = useCurrentPath();
  const segments = currentPath.split('/').filter(Boolean);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Text>Home</Text>
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          <Text>/</Text>
          <Text>{segment}</Text>
        </React.Fragment>
      ))}
    </View>
  );
}`}
        />

        {/* useParams */}
        <Text weight="semibold" typography="h3" style={{ marginTop: 48, marginBottom: 16 }}>
          useParams
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Returns the route parameters extracted from dynamic path segments.
          For example, if your route is defined as <Text weight="semibold">/users/:id</Text>,
          useParams will return an object containing the <Text weight="semibold">id</Text> value.
        </Text>

        <CodeBlock
          title="useParams Hook"
          code={`import { useParams } from '@idealyst/navigation';

// Route: /users/:userId/posts/:postId

function PostDetail() {
  const params = useParams<{ userId: string; postId: string }>();

  return (
    <View>
      <Text>User ID: {params.userId}</Text>
      <Text>Post ID: {params.postId}</Text>
    </View>
  );
}`}
        />

        {/* useNavigationState */}
        <Text weight="semibold" typography="h3" style={{ marginTop: 48, marginBottom: 16 }}>
          useNavigationState
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Access state data passed during navigation. On web, state is passed as
          URL query parameters. On native, it's passed via route params.
        </Text>

        <CodeBlock
          title="useNavigationState Hook"
          code={`import { useNavigator, useNavigationState } from '@idealyst/navigation';

// Navigating with state
function SourceScreen() {
  const { navigate } = useNavigator();

  const handleStart = () => {
    navigate({
      path: '/recording',
      state: { autostart: true }
    });
  };

  return <Button onPress={handleStart}>Start Recording</Button>;
}

// Receiving state
function RecordingScreen() {
  const { autostart } = useNavigationState<{ autostart?: boolean }>();

  useEffect(() => {
    if (autostart) {
      startRecording();
    }
  }, [autostart]);

  return <View>...</View>;
}`}
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 24, marginBottom: 12 }}>
          Consuming State
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          On web, you can remove query parameters after reading them using the
          <Text weight="semibold"> consume</Text> option. This is useful for one-time
          state that shouldn't persist in the URL.
        </Text>

        <CodeBlock
          title="Consuming State"
          code={`// URL: /recording?autostart=true

const { autostart } = useNavigationState<{ autostart?: boolean }>({
  consume: ['autostart']
});

// autostart = true
// URL becomes: /recording (parameter removed)`}
        />

        {/* Platform Behavior */}
        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Platform Behavior
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Card style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Web</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              {`• useCurrentPath uses React Router's useLocation
• useParams uses React Router's useParams
• useNavigationState parses URL query params`}
            </Text>
          </Card>

          <Card style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Native</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              {`• useCurrentPath uses React Navigation's useRoute
• useParams uses React Navigation's route.params
• useNavigationState uses route.params`}
            </Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
