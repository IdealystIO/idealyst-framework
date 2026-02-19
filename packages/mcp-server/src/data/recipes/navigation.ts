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
};
