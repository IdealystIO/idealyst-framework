/**
 * Navigation Recipes - Tab, drawer, stack, and responsive navigation patterns
 */

import { Recipe } from "./types.js";

export const navigationRecipes: Record<string, Recipe> = {
  "tab-navigation": {
    name: "Tab Navigation",
    description: "Bottom tab navigation with icons and badges",
    category: "navigation",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import type { TabNavigatorParam } from '@idealyst/navigation';
import { Icon, View, Text, Card } from '@idealyst/components';

function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }} gap="md">
      <Text typography="h5" weight="bold">Home</Text>
      {/* Card is a simple container — NO Card.Content, Card.Header, etc. Just put children inside */}
      <Card padding="md" gap="sm">
        <Text typography="subtitle1" weight="semibold">Welcome</Text>
        <Text typography="body2" color="secondary">This is the home screen</Text>
      </Card>
    </View>
  );
}

function SearchScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text typography="h5">Search</Text></View>;
}

function NotificationsScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text typography="h5">Notifications</Text></View>;
}

function ProfileScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text typography="h5">Profile</Text></View>;
}

const route: TabNavigatorParam = {
  type: 'navigator',
  path: '/',
  layout: 'tab',
  routes: [
    {
      type: 'screen',
      path: '/',
      component: HomeScreen,
      options: {
        title: 'Home',
        tabBarIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home-outline'} size="sm" />
        ),
      },
    },
    {
      type: 'screen',
      path: '/search',
      component: SearchScreen,
      options: {
        title: 'Search',
        tabBarIcon: ({ focused }) => (
          <Icon name="magnify" size="sm" />
        ),
      },
    },
    {
      type: 'screen',
      path: '/notifications',
      component: NotificationsScreen,
      options: {
        title: 'Notifications',
        tabBarIcon: ({ focused }) => (
          <Icon name={focused ? 'bell' : 'bell-outline'} size="sm" />
        ),
        tabBarBadge: 3,
      },
    },
    {
      type: 'screen',
      path: '/profile',
      component: ProfileScreen,
      options: {
        title: 'Profile',
        tabBarIcon: ({ focused }) => (
          <Icon name={focused ? 'account' : 'account-outline'} size="sm" />
        ),
      },
    },
  ],
};

export function App() {
  return <NavigatorProvider route={route} />;
}`,
    explanation: `Tab navigation setup with:
- NavigatorProvider wraps the app with a route configuration object
- TabNavigatorParam defines the tab layout with routes array
- Each route has type: 'screen', a path, component, and options
- tabBarIcon renders icons that change when focused
- tabBarBadge shows a badge count on the tab
- Works on both web and native`,
    tips: [
      "Use outline/filled icon variants to indicate focus state",
      "Keep tab count to 3-5 for best usability",
      "Use tabBarBadge for notification counts instead of manual Badge component",
      "Nest a StackNavigatorParam inside a tab route for detail screens",
      "Card is a plain container — put children directly inside <Card>. There are NO Card.Content, Card.Header, or Card.Body sub-components",
    ],
    relatedRecipes: ["drawer-navigation", "responsive-navigation"],
  },

  "drawer-navigation": {
    name: "Drawer Navigation",
    description: "Side drawer menu with navigation items and user profile",
    category: "navigation",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `import React from 'react';
import { NavigatorProvider, useNavigator } from '@idealyst/navigation';
import type { DrawerNavigatorParam, DrawerSidebarProps } from '@idealyst/navigation';
import { View, Text, Icon, Avatar, Pressable, Divider } from '@idealyst/components';
import type { IconName } from '@idealyst/components';

function HomeScreen() {
  return <View style={{ flex: 1, padding: 16 }}><Text typography="h5">Home</Text></View>;
}

function DashboardScreen() {
  return <View style={{ flex: 1, padding: 16 }}><Text typography="h5">Dashboard</Text></View>;
}

function SettingsScreen() {
  return <View style={{ flex: 1, padding: 16 }}><Text typography="h5">Settings</Text></View>;
}

function DrawerContent(props: DrawerSidebarProps) {
  const { navigate } = useNavigator();

  const menuItems: { path: string; icon: IconName; label: string }[] = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/dashboard', icon: 'view-dashboard', label: 'Dashboard' },
    { path: '/settings', icon: 'cog', label: 'Settings' },
  ];

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: (props.insets?.top ?? 0) + 16 }}>
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Avatar src="https://example.com/avatar.jpg" size="lg" />
        <Text typography="h6" weight="semibold" style={{ marginTop: 12 }}>John Doe</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <View style={{ gap: 4 }}>
        {menuItems.map((item) => (
          <Pressable key={item.path} onPress={() => navigate({ path: item.path })}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              padding: 12,
              borderRadius: 8,
            }}>
              <Icon name={item.icon} size="sm" />
              <Text typography="body1">{item.label}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const route: DrawerNavigatorParam = {
  type: 'navigator',
  path: '/',
  layout: 'drawer',
  sidebarComponent: DrawerContent,
  routes: [
    { type: 'screen', path: '/', component: HomeScreen, options: { title: 'Home' } },
    { type: 'screen', path: '/dashboard', component: DashboardScreen, options: { title: 'Dashboard' } },
    { type: 'screen', path: '/settings', component: SettingsScreen, options: { title: 'Settings' } },
  ],
};

export function App() {
  return <NavigatorProvider route={route} />;
}`,
    explanation: `Drawer navigation includes:
- NavigatorProvider with a DrawerNavigatorParam configuration
- Custom sidebarComponent for the drawer content
- DrawerSidebarProps provides safe area insets on mobile
- useNavigator() hook to navigate between screens
- navigate() takes an object: { path: '/settings' }
- Works on both web (sidebar) and native (slide-out drawer)`,
    tips: [
      "Use DrawerSidebarProps insets to avoid notches and status bars",
      "Type icon props as IconName (from @idealyst/components) not string",
      "navigate() always takes an object with a 'path' key",
    ],
    relatedRecipes: ["tab-navigation", "responsive-navigation"],
  },

  "responsive-navigation": {
    name: "Responsive Navigation",
    description: "Adaptive navigation that switches between tabs and drawer based on screen size",
    category: "navigation",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/navigation", "@idealyst/theme"],
    code: `import React, { useMemo } from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import type { TabNavigatorParam, DrawerNavigatorParam, ScreenParam, TabBarScreenOptions } from '@idealyst/navigation';
import { useResponsiveStyle } from '@idealyst/theme';
import { Icon, View, Text } from '@idealyst/components';

function HomeScreen() {
  return <View style={{ flex: 1, padding: 16 }}><Text typography="h5">Home</Text></View>;
}

function SearchScreen() {
  return <View style={{ flex: 1, padding: 16 }}><Text typography="h5">Search</Text></View>;
}

// Shared screen definitions
const screens: ScreenParam<TabBarScreenOptions>[] = [
  {
    type: 'screen',
    path: '/',
    component: HomeScreen,
    options: {
      title: 'Home',
      tabBarIcon: ({ focused }) => <Icon name={focused ? 'home' : 'home-outline'} size="sm" />,
    },
  },
  {
    type: 'screen',
    path: '/search',
    component: SearchScreen,
    options: {
      title: 'Search',
      tabBarIcon: ({ focused }) => <Icon name="magnify" size="sm" />,
    },
  },
];

export function App() {
  // useResponsiveStyle returns different values based on breakpoint
  const isLargeScreen = useResponsiveStyle({ base: false, md: true });

  const route = useMemo(() => {
    if (isLargeScreen) {
      return {
        type: 'navigator' as const,
        path: '/',
        layout: 'drawer' as const,
        routes: screens,
      } satisfies DrawerNavigatorParam;
    }
    return {
      type: 'navigator' as const,
      path: '/',
      layout: 'tab' as const,
      routes: screens,
    } satisfies TabNavigatorParam;
  }, [isLargeScreen]);

  return <NavigatorProvider route={route} />;
}`,
    explanation: `Responsive navigation that:
- Uses tabs on mobile/small screens
- Switches to drawer on tablet/desktop
- Shares screen definitions between layouts
- Adapts automatically based on breakpoints`,
    tips: [
      "Test on various screen sizes",
      "Consider tablet portrait vs landscape",
      "Use consistent navigation patterns within each mode",
    ],
    relatedRecipes: ["tab-navigation", "drawer-navigation"],
  },

  "web-sidebar-layout": {
    name: "Web Sidebar Layout",
    description:
      "Sidebar layout for web with header, route-driven menu, and active highlighting. Shows the complete .web.tsx / .native.tsx platform file structure required for layoutComponent.",
    category: "navigation",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `// ============================================================
// File 1: layouts/AppLayout.web.tsx  (the REAL layout — web only)
// ============================================================
import React from 'react';
import { Outlet, useNavigator } from '@idealyst/navigation';
import type { StackLayoutProps } from '@idealyst/navigation';
import { View, Text, Pressable, Icon, Divider } from '@idealyst/components';
import type { IconName } from '@idealyst/components';

export function AppLayout({ routes, currentPath, options }: StackLayoutProps) {
  const { navigate } = useNavigator();

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar */}
      <View style={{ width: 260, borderRightWidth: 1, borderRightColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
        {/* Logo / App name */}
        <View style={{ height: 56, justifyContent: 'center', paddingHorizontal: 16 }}>
          <Text typography="h6" weight="bold">{options?.headerTitle || 'My App'}</Text>
        </View>

        <Divider />

        {/* Menu items built from routes */}
        <View style={{ padding: 8, gap: 2 }}>
          {routes.map((route) => {
            const isActive = currentPath === route.fullPath
              || currentPath.startsWith(route.fullPath + '/');

            return (
              <Pressable
                key={route.fullPath}
                onPress={() => navigate({ path: route.fullPath })}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: isActive ? 'rgba(0,122,255,0.08)' : 'transparent',
                }}
              >
                <Icon
                  name={(route.options?.icon as IconName) || 'circle-outline'}
                  size="sm"
                  color={isActive ? '#007AFF' : '#666'}
                />
                <Text
                  typography="body2"
                  weight={isActive ? 'semibold' : 'regular'}
                  style={{ color: isActive ? '#007AFF' : '#333' }}
                >
                  {route.options?.title || route.path}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Page content — rendered via Outlet, NOT children */}
      <View style={{ flex: 1 }}>
        <Outlet />
      </View>
    </View>
  );
}

// ============================================================
// File 2: layouts/AppLayout.native.tsx  (no-op mock for native)
// ============================================================
// Native ignores layoutComponent, so this is just a placeholder.
export function AppLayout() {
  return null;
}

// ============================================================
// File 3: layouts/index.ts  (base — needed for module resolution)
// ============================================================
export { AppLayout } from './AppLayout.web';

// ============================================================
// File 4: layouts/index.web.ts
// ============================================================
export { AppLayout } from './AppLayout.web';

// ============================================================
// File 5: layouts/index.native.ts
// ============================================================
export { AppLayout } from './AppLayout.native';

// ============================================================
// File 6: AppRouter.ts  (wiring)
// ============================================================
import { AppLayout } from './layouts';
import type { NavigatorParam } from '@idealyst/navigation';
// import your screen components here

const appRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  layoutComponent: AppLayout,  // web only — native ignores this
  options: { headerTitle: 'Dashboard' },
  routes: [
    { path: '',        type: 'screen', component: HomeScreen,     options: { title: 'Home',     icon: 'home'            } },
    { path: 'tasks',   type: 'screen', component: TasksScreen,    options: { title: 'Tasks',    icon: 'clipboard-list'  } },
    { path: 'team',    type: 'screen', component: TeamScreen,     options: { title: 'Team',     icon: 'account-group'   } },
    { path: 'settings',type: 'screen', component: SettingsScreen, options: { title: 'Settings', icon: 'cog'             } },
  ],
};`,
    explanation: `Web sidebar layout with complete platform file structure:

1. **AppLayout.web.tsx** — The real layout. Receives StackLayoutProps (routes, currentPath, options). Builds a sidebar from routes, highlights the active item, and renders page content via \`<Outlet />\` from \`@idealyst/navigation\`.
2. **AppLayout.native.tsx** — No-op mock. Native ignores layoutComponent, so this just returns null.
3. **index.ts** — Base re-export (needed for module resolution when bundler doesn't support platform extensions).
4. **index.web.ts / index.native.ts** — Platform-specific re-exports.
5. **AppRouter.ts** — Sets \`layoutComponent: AppLayout\` on the navigator. Each route's \`options.icon\` and \`options.title\` drive the sidebar menu.

Key points:
- Import \`Outlet\` from \`@idealyst/navigation\`, NOT from \`react-router-dom\`
- StackLayoutProps has NO \`children\` prop — use \`<Outlet />\` instead
- \`layoutComponent\` is web-only; native uses its own native navigator UI`,
    tips: [
      "Import Outlet from @idealyst/navigation, NEVER from react-router-dom",
      "StackLayoutProps does NOT include children — render content with <Outlet />",
      "Always create both .web.tsx and .native.tsx files with platform index files, plus a base index.ts",
      "Use route.fullPath (not route.path) for navigation and active state comparison",
      "Use currentPath.startsWith(route.fullPath + '/') for nested route highlighting",
    ],
    relatedRecipes: [
      "web-tab-layout",
      "web-collapsible-sidebar",
      "drawer-navigation",
    ],
  },

  "web-tab-layout": {
    name: "Web Tab Layout",
    description:
      "Custom top tab bar for web that renders tabBarIcon, tabBarLabel, and tabBarBadge from route options. Complete platform file structure included.",
    category: "navigation",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `// ============================================================
// File 1: layouts/TabLayout.web.tsx  (the REAL layout — web only)
// ============================================================
import React from 'react';
import { Outlet, useNavigator } from '@idealyst/navigation';
import type { TabLayoutProps } from '@idealyst/navigation';
import { View, Text, Pressable, Badge, Icon } from '@idealyst/components';

export function TabLayout({ routes, currentPath }: TabLayoutProps) {
  const { navigate } = useNavigator();

  return (
    <View style={{ flex: 1 }}>
      {/* Top tab bar */}
      <View style={{
        flexDirection: 'row',
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
      }}>
        {routes.map((route) => {
          const isActive = currentPath === route.fullPath;
          const opts = route.options;

          return (
            <Pressable
              key={route.fullPath}
              onPress={() => navigate({ path: route.fullPath })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingHorizontal: 16,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? '#007AFF' : 'transparent',
              }}
            >
              {/* Render tabBarIcon — can be a string or render function */}
              {opts?.tabBarIcon && (
                <View style={{ position: 'relative' }}>
                  {typeof opts.tabBarIcon === 'string'
                    ? <Icon name={opts.tabBarIcon as any} size="sm" intent={isActive ? 'primary' : undefined} />
                    : opts.tabBarIcon({
                        focused: isActive,
                        color: isActive ? '#007AFF' : '#8E8E93',
                        size: 'sm',
                      })}
                  {/* Badge */}
                  {opts.tabBarBadge != null && (
                    <Badge
                      size="sm"
                      intent="danger"
                      style={{ position: 'absolute', top: -4, right: -8 }}
                    >
                      {opts.tabBarBadge}
                    </Badge>
                  )}
                </View>
              )}

              {/* Label */}
              {opts?.tabBarLabel && (
                <Text
                  typography="body2"
                  weight={isActive ? 'semibold' : 'regular'}
                  style={{ color: isActive ? '#007AFF' : '#8E8E93' }}
                >
                  {opts.tabBarLabel}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Page content — rendered via Outlet, NOT children */}
      <View style={{ flex: 1 }}>
        <Outlet />
      </View>
    </View>
  );
}

// ============================================================
// File 2: layouts/TabLayout.native.tsx  (no-op mock for native)
// ============================================================
export function TabLayout() {
  return null;
}

// ============================================================
// File 3: layouts/index.ts  (base — needed for module resolution)
// ============================================================
export { TabLayout } from './TabLayout.web';

// ============================================================
// File 4: layouts/index.web.ts
// ============================================================
export { TabLayout } from './TabLayout.web';

// ============================================================
// File 5: layouts/index.native.ts
// ============================================================
export { TabLayout } from './TabLayout.native';

// ============================================================
// File 6: AppRouter.ts  (wiring)
// ============================================================
import { TabLayout } from './layouts';
import type { NavigatorParam } from '@idealyst/navigation';
import { Icon } from '@idealyst/components';
// import your screen components here

const appRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'tab',
  layoutComponent: TabLayout,  // web only — native uses its own tab bar
  routes: [
    {
      path: '',
      type: 'screen',
      component: HomeScreen,
      options: {
        tabBarLabel: 'Home',
        // Function form: ignore size param, use Size token. Use focused for icon variants.
        tabBarIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home-outline'} size="sm" />
        ),
      },
    },
    {
      path: 'search',
      type: 'screen',
      component: SearchScreen,
      options: {
        tabBarLabel: 'Search',
        tabBarIcon: 'magnify',  // String form: just the icon name
      },
    },
    {
      path: 'notifications',
      type: 'screen',
      component: NotificationsScreen,
      options: {
        tabBarLabel: 'Alerts',
        tabBarIcon: ({ focused }) => (
          <Icon name={focused ? 'bell' : 'bell-outline'} size="sm" />
        ),
        tabBarBadge: 5,
      },
    },
    {
      path: 'profile',
      type: 'screen',
      component: ProfileScreen,
      options: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => (
          <Icon name={focused ? 'account' : 'account-outline'} size="sm" />
        ),
      },
    },
  ],
};`,
    explanation: `Web tab layout with complete platform file structure:

1. **TabLayout.web.tsx** — Receives TabLayoutProps (routes, currentPath). Renders a top tab bar by mapping over routes and reading tabBarIcon, tabBarLabel, and tabBarBadge from each route's options. Content renders via \`<Outlet />\`.
2. **TabLayout.native.tsx** — No-op mock. Native uses its own bottom tab bar.
3. **index.ts** — Base re-export (needed for module resolution when bundler doesn't support platform extensions).
4. **index.web.ts / index.native.ts** — Platform-specific re-exports.
5. **AppRouter.ts** — Sets \`layoutComponent: TabLayout\` on a tab navigator.

Key points:
- tabBarIcon can be a string (icon name) OR a render function — check typeof before calling
- String form: layout renders <Icon name={tabBarIcon} size="sm" /> automatically
- Function form: receives { focused, color, size }. WARNING: ignore the size param — use a Size token ('sm', 'md') instead
- tabBarBadge renders a small count indicator (use Badge component)
- Import Outlet from @idealyst/navigation, NOT react-router-dom`,
    tips: [
      "TabLayoutProps has NO children prop — use <Outlet /> for content",
      "tabBarIcon can be a string ('home') or a function. Check typeof before calling.",
      "When using the function form, ignore the size param and use a Size token like 'sm'",
      "tabBarBadge can be string or number — check with != null",
      "Use route.fullPath for navigation and active state, not route.path",
      "Always create a base index.ts alongside index.web.ts and index.native.ts",
    ],
    relatedRecipes: [
      "web-sidebar-layout",
      "web-collapsible-sidebar",
      "tab-navigation",
    ],
  },

  "web-collapsible-sidebar": {
    name: "Web Collapsible Sidebar Layout",
    description:
      "Collapsible sidebar (260px expanded / 64px collapsed) with toggle button, header bar, avatar, and 5+ menu items. Advanced web layout with full platform file structure.",
    category: "navigation",
    difficulty: "advanced",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `// ============================================================
// File 1: layouts/DashboardLayout.web.tsx  (real layout)
// ============================================================
import React, { useState } from 'react';
import { Outlet, useNavigator } from '@idealyst/navigation';
import type { StackLayoutProps } from '@idealyst/navigation';
import { View, Text, Pressable, Icon, Avatar, Divider } from '@idealyst/components';
import type { IconName } from '@idealyst/components';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 64;

export function DashboardLayout({ routes, currentPath, options }: StackLayoutProps) {
  const { navigate } = useNavigator();
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <View style={{ flex: 1 }}>
      {/* Header bar */}
      <View style={{
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
        gap: 12,
      }}>
        {/* Hamburger toggle */}
        <Pressable onPress={() => setCollapsed(!collapsed)}>
          <Icon name="menu" size="sm" />
        </Pressable>

        <Text typography="h6" weight="bold" style={{ flex: 1 }}>
          {options?.headerTitle || 'Dashboard'}
        </Text>

        {/* Right side — avatar */}
        <Avatar src="https://i.pravatar.cc/40" size="sm" />
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Collapsible sidebar */}
        <View style={{
          width: sidebarWidth,
          borderRightWidth: 1,
          borderRightColor: '#e0e0e0',
          backgroundColor: '#fafafa',
          overflow: 'hidden',
        }}>
          <View style={{ padding: 8, gap: 2 }}>
            {routes.map((route) => {
              const isActive = currentPath === route.fullPath
                || currentPath.startsWith(route.fullPath + '/');
              const iconName = (route.options?.icon as IconName) || 'circle-outline';

              return (
                <Pressable
                  key={route.fullPath}
                  onPress={() => navigate({ path: route.fullPath })}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingVertical: 10,
                    paddingHorizontal: collapsed ? 20 : 12,
                    borderRadius: 8,
                    backgroundColor: isActive ? 'rgba(0,122,255,0.08)' : 'transparent',
                  }}
                >
                  <Icon
                    name={iconName}
                    size="sm"
                    color={isActive ? '#007AFF' : '#666'}
                  />
                  {!collapsed && (
                    <Text
                      typography="body2"
                      weight={isActive ? 'semibold' : 'regular'}
                      style={{ color: isActive ? '#007AFF' : '#333' }}
                    >
                      {route.options?.title || route.path}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Collapse toggle at bottom */}
          <View style={{ marginTop: 'auto', padding: 8 }}>
            <Divider style={{ marginBottom: 8 }} />
            <Pressable
              onPress={() => setCollapsed(!collapsed)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 10,
                paddingHorizontal: collapsed ? 20 : 12,
                borderRadius: 8,
              }}
            >
              <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size="sm" color="#666" />
              {!collapsed && (
                <Text typography="body2" style={{ color: '#666' }}>Collapse</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Page content — rendered via Outlet, NOT children */}
        <View style={{ flex: 1 }}>
          <Outlet />
        </View>
      </View>
    </View>
  );
}

// ============================================================
// File 2: layouts/DashboardLayout.native.tsx  (no-op mock)
// ============================================================
export function DashboardLayout() {
  return null;
}

// ============================================================
// File 3: layouts/index.ts  (base — needed for module resolution)
// ============================================================
export { DashboardLayout } from './DashboardLayout.web';

// ============================================================
// File 4: layouts/index.web.ts
// ============================================================
export { DashboardLayout } from './DashboardLayout.web';

// ============================================================
// File 5: layouts/index.native.ts
// ============================================================
export { DashboardLayout } from './DashboardLayout.native';

// ============================================================
// File 6: AppRouter.ts  (wiring)
// ============================================================
import { DashboardLayout } from './layouts';
import type { NavigatorParam } from '@idealyst/navigation';
// import your screen components here

const appRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  layoutComponent: DashboardLayout,
  options: { headerTitle: 'Admin Panel' },
  routes: [
    { path: '',          type: 'screen', component: DashboardScreen, options: { title: 'Dashboard', icon: 'view-dashboard' } },
    { path: 'users',     type: 'screen', component: UsersScreen,     options: { title: 'Users',     icon: 'account-group'  } },
    { path: 'analytics', type: 'screen', component: AnalyticsScreen, options: { title: 'Analytics', icon: 'chart-line'     } },
    { path: 'messages',  type: 'screen', component: MessagesScreen,  options: { title: 'Messages',  icon: 'email-outline'  } },
    { path: 'settings',  type: 'screen', component: SettingsScreen,  options: { title: 'Settings',  icon: 'cog'            } },
  ],
};`,
    explanation: `Collapsible sidebar layout with full platform structure:

1. **DashboardLayout.web.tsx** — Header bar with hamburger toggle + avatar. Sidebar toggles between 260px and 64px. When collapsed, only icons show. Active route is highlighted. Content renders via \`<Outlet />\`.
2. **DashboardLayout.native.tsx** — No-op mock for native.
3. **index.ts** — Base re-export (needed for module resolution when bundler doesn't support platform extensions).
4. **index.web.ts / index.native.ts** — Platform-specific re-exports.
5. **AppRouter.ts** — Wires layoutComponent with 5 routes, each with title and icon.

Key patterns:
- \`useState\` for collapse state — toggle via hamburger or bottom chevron
- \`overflow: 'hidden'\` to clip text when collapsed
- Width changes instantly on toggle — do NOT use CSS \`transition\` (not valid ViewStyle)
- Active highlighting using \`currentPath.startsWith(route.fullPath + '/')\``,
    tips: [
      "Import Outlet from @idealyst/navigation, NEVER from react-router-dom",
      "StackLayoutProps has NO children — use <Outlet /> for page content",
      "Do NOT use CSS transition or as React.CSSProperties — just set width directly",
      "Always create .native.tsx no-op mocks — native ignores layoutComponent",
      "Always create a base index.ts alongside index.web.ts and index.native.ts for module resolution",
      "Cast route.options.icon to IconName for type safety",
    ],
    relatedRecipes: [
      "web-sidebar-layout",
      "web-tab-layout",
      "drawer-navigation",
    ],
  },
};
