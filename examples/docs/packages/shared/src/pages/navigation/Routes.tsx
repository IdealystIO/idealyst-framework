import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function NavigationRoutesPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Route Configuration
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Routes in Idealyst are defined using TypeScript types that provide full type safety
          and autocomplete. Learn how to configure NavigatorParam and RouteParam.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          NavigatorParam Types
        </Text>

        <CodeBlock
          title="NavigatorParam Union Type"
          code={`type NavigatorParam =
  | TabNavigatorParam
  | StackNavigatorParam
  | DrawerNavigatorParam;

// Common base for all navigators
type BaseNavigatorParam = {
  path: string;              // Route path segment
  type: 'navigator';         // Identifies as navigator
  options?: NavigatorOptions; // Header/layout options
};`}
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Stack Navigator
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Traditional push/pop navigation with a navigation stack. Each new screen
          is pushed onto the stack and can be popped with a back action.
        </Text>

        <CodeBlock
          title="Stack Navigator Example"
          code={`import { NavigatorParam } from '@idealyst/navigation';

const StackRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  options: {
    headerShown: true,        // Show header with title
    headerTitle: 'My App',    // Default title
  },
  routes: [
    {
      path: '/',
      type: 'screen',
      component: HomeScreen,
      options: { title: 'Home' }
    },
    {
      path: 'details/:id',
      type: 'screen',
      component: DetailsScreen,
      options: { title: 'Details' }
    },
  ],
};`}
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Tab Navigator
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Bottom tab bar navigation. Screens persist in memory when switching tabs.
          Each tab can have its own icon and label.
        </Text>

        <CodeBlock
          title="Tab Navigator Example"
          code={`import { NavigatorParam, TabBarScreenOptions } from '@idealyst/navigation';
import Icon from '@mdi/react';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';

const TabRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'tab',
  routes: [
    {
      path: '/',
      type: 'screen',
      component: HomeScreen,
      options: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Icon path={mdiHome} color={color} size={size} />
        ),
      } as TabBarScreenOptions
    },
    {
      path: 'profile',
      type: 'screen',
      component: ProfileScreen,
      options: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Icon path={mdiAccount} color={color} size={size} />
        ),
        tabBarBadge: 3, // Show notification badge
      } as TabBarScreenOptions
    },
    {
      path: 'settings',
      type: 'screen',
      component: SettingsScreen,
      options: {
        title: 'Settings',
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <Icon path={mdiCog} color={color} size={size} />
        ),
      } as TabBarScreenOptions
    },
  ],
};`}
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Drawer Navigator
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Side menu navigation with a custom sidebar component. Perfect for documentation
          sites, admin panels, and apps with many top-level sections.
        </Text>

        <CodeBlock title="Drawer Navigator Example">
{`import { NavigatorParam, DrawerSidebarProps } from '@idealyst/navigation';

// Custom sidebar component
function MySidebar({ insets }: DrawerSidebarProps) {
  const { navigate } = useNavigator();

  return (
    <View style={{ paddingTop: insets?.top }}>
      <Text>My Sidebar</Text>
      <Button onPress={() => navigate({ path: '/' })}>
        Home
      </Button>
      <Button onPress={() => navigate({ path: '/docs' })}>
        Documentation
      </Button>
    </View>
  );
}

const DrawerRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'drawer',
  sidebarComponent: MySidebar, // Custom sidebar
  options: {
    headerShown: false, // Hide default header
  },
  routes: [
    { path: '/', type: 'screen', component: HomeScreen },
    { path: 'docs', type: 'screen', component: DocsScreen },
    { path: 'about', type: 'screen', component: AboutScreen },
  ],
};`}
        </CodeBlock>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Nested Navigation
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Routes can be nested to create complex navigation hierarchies. Each nested
          navigator maintains its own navigation state.
        </Text>

        <CodeBlock title="Nested Navigation Example">
{`const AppRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'tab',
  routes: [
    // Home tab with its own stack
    {
      path: '/',
      type: 'navigator',
      layout: 'stack',
      routes: [
        { path: '/', type: 'screen', component: HomeScreen },
        { path: 'details/:id', type: 'screen', component: DetailsScreen },
      ],
      options: { tabBarLabel: 'Home' },
    },
    // Profile tab with its own stack
    {
      path: 'profile',
      type: 'navigator',
      layout: 'stack',
      routes: [
        { path: '/', type: 'screen', component: ProfileScreen },
        { path: 'edit', type: 'screen', component: EditProfileScreen },
      ],
      options: { tabBarLabel: 'Profile' },
    },
  ],
};`}
        </CodeBlock>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Screen Options
        </Text>

        <Card variant="outlined" style={{ padding: 20, marginBottom: 24 }}>
          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>title</Text>
            <Text typography="body2" color="tertiary">
              Screen title displayed in the header. Also used for document title on web.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>headerShown</Text>
            <Text typography="body2" color="tertiary">
              Whether to show the navigation header. Set to false for custom headers.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>headerTitle</Text>
            <Text typography="body2" color="tertiary">
              Custom header title. Can be a string, component, or React element.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>headerLeft / headerRight</Text>
            <Text typography="body2" color="tertiary">
              Custom components for left/right header slots. HeaderLeft overrides back button.
            </Text>
          </View>

          <View>
            <Text weight="semibold" style={{ marginBottom: 4 }}>headerBackVisible</Text>
            <Text typography="body2" color="tertiary">
              Whether to show the back button in the header. Defaults to true when applicable.
            </Text>
          </View>
        </Card>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Tab Bar Options
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>tabBarLabel</Text>
            <Text typography="body2" color="tertiary">
              Label displayed below the tab icon. Defaults to screen title.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>tabBarIcon</Text>
            <Text typography="body2" color="tertiary">
              Function that returns an icon component. Receives focused, color, and size props.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>tabBarBadge</Text>
            <Text typography="body2" color="tertiary">
              Badge to display on the tab icon. Can be a string or number.
            </Text>
          </View>

          <View>
            <Text weight="semibold" style={{ marginBottom: 4 }}>tabBarVisible</Text>
            <Text typography="body2" color="tertiary">
              Whether to show this screen in the tab bar. Set to false to hide.
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
