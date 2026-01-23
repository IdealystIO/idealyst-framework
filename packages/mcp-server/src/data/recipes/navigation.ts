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
import { Router } from '@idealyst/navigation';
import { Icon, Badge, View, Text } from '@idealyst/components';

function HomeScreen() {
  return <View><Text>Home</Text></View>;
}

function SearchScreen() {
  return <View><Text>Search</Text></View>;
}

function NotificationsScreen() {
  return <View><Text>Notifications</Text></View>;
}

function ProfileScreen() {
  return <View><Text>Profile</Text></View>;
}

const routes = {
  home: {
    path: '/',
    screen: HomeScreen,
    options: {
      title: 'Home',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Icon name={focused ? 'home' : 'home-outline'} size={24} />
      ),
    },
  },
  search: {
    path: '/search',
    screen: SearchScreen,
    options: {
      title: 'Search',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Icon name="magnify" size={24} />
      ),
    },
  },
  notifications: {
    path: '/notifications',
    screen: NotificationsScreen,
    options: {
      title: 'Notifications',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <View>
          <Icon name={focused ? 'bell' : 'bell-outline'} size={24} />
          <Badge count={3} style={{ position: 'absolute', top: -4, right: -8 }} />
        </View>
      ),
    },
  },
  profile: {
    path: '/profile',
    screen: ProfileScreen,
    options: {
      title: 'Profile',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Icon name={focused ? 'account' : 'account-outline'} size={24} />
      ),
    },
  },
};

export function App() {
  return <Router routes={routes} navigator="tabs" tabBarPosition="bottom" />;
}`,
    explanation: `Tab navigation setup with:
- Four tabs with icons that change when focused
- Badge on notifications tab for unread count
- Type-safe route configuration
- Works on both web and native`,
    tips: [
      "Use outline/filled icon variants to indicate focus state",
      "Keep tab count to 3-5 for best usability",
      "Consider hiding tabs on certain screens (like detail views)",
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
import { Router, useNavigator } from '@idealyst/navigation';
import { View, Text, Icon, Avatar, Pressable, Divider } from '@idealyst/components';

function DrawerContent() {
  const { navigate, currentRoute } = useNavigator();

  const menuItems = [
    { route: 'home', icon: 'home', label: 'Home' },
    { route: 'dashboard', icon: 'view-dashboard', label: 'Dashboard' },
    { route: 'settings', icon: 'cog', label: 'Settings' },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Avatar source={{ uri: 'https://example.com/avatar.jpg' }} size="lg" />
        <Text variant="title" style={{ marginTop: 12 }}>John Doe</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <View style={{ gap: 4 }}>
        {menuItems.map((item) => (
          <Pressable key={item.route} onPress={() => navigate(item.route)}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: currentRoute === item.route ? 'rgba(0,0,0,0.1)' : 'transparent',
            }}>
              <Icon name={item.icon} size={24} />
              <Text>{item.label}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const routes = {
  home: { path: '/', screen: HomeScreen },
  dashboard: { path: '/dashboard', screen: DashboardScreen },
  settings: { path: '/settings', screen: SettingsScreen },
};

export function App() {
  return <Router routes={routes} navigator="drawer" drawerContent={DrawerContent} />;
}`,
    explanation: `Drawer navigation includes:
- Custom drawer content with user profile
- Active state highlighting for current route
- Grouped menu items with icons
- Works on both web (sidebar) and native (slide-out drawer)`,
    tips: [
      "Add a hamburger menu button to open drawer on native",
      "Consider using drawer on tablet/desktop, tabs on mobile",
      "Add gesture support for swipe-to-open on native",
    ],
    relatedRecipes: ["tab-navigation", "responsive-navigation"],
  },

  "responsive-navigation": {
    name: "Responsive Navigation",
    description: "Adaptive navigation that switches between tabs and drawer based on screen size",
    category: "navigation",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/navigation", "@idealyst/theme"],
    code: `import React from 'react';
import { Router } from '@idealyst/navigation';
import { useBreakpoint } from '@idealyst/theme';

export function App() {
  const breakpoint = useBreakpoint();
  const isLargeScreen = breakpoint === 'lg' || breakpoint === 'xl';

  return (
    <Router
      routes={routes}
      navigator={isLargeScreen ? 'drawer' : 'tabs'}
      drawerContent={isLargeScreen ? DrawerContent : undefined}
      tabBarPosition="bottom"
    />
  );
}`,
    explanation: `Responsive navigation that:
- Uses tabs on mobile/small screens
- Switches to drawer on tablet/desktop
- Adapts automatically based on breakpoints`,
    tips: [
      "Test on various screen sizes",
      "Consider tablet portrait vs landscape",
      "Use consistent navigation patterns within each mode",
    ],
    relatedRecipes: ["tab-navigation", "drawer-navigation"],
  },
};
