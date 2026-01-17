import React from 'react';
import { Icon } from '@idealyst/components';
import type { NavigatorParam, TabBarScreenOptions } from '@idealyst/navigation';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

// Custom Layouts
import { ShowcaseTabLayout, ShowcaseStackLayout } from '../layouts/ShowcaseLayout';

/**
 * Tab Navigator - Contains 3 main tabs: Home, Explore, Profile
 */
const MainTabNavigator: NavigatorParam = {
  path: '',
  type: 'navigator',
  layout: 'tab',
  layoutComponent: ShowcaseTabLayout,
  routes: [
    {
      path: '',
      type: 'screen',
      component: HomeScreen,
      options: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name={focused ? 'home' : 'home-outline'}
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    },
    {
      path: 'explore',
      type: 'screen',
      component: ExploreScreen,
      options: {
        title: 'Explore',
        tabBarLabel: 'Explore',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name={focused ? 'compass' : 'compass-outline'}
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    },
    {
      path: 'profile',
      type: 'screen',
      component: ProfileScreen,
      options: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name={focused ? 'account' : 'account-outline'}
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    },
  ],
};

/**
 * Root Stack Navigator - Wraps tabs and adds Settings screen
 * Structure:
 * - Stack (root)
 *   - Tab Navigator (main tabs)
 *     - Home
 *     - Explore
 *     - Profile
 *   - Settings (modal-style screen on top of tabs)
 */
export const ShowcaseRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  layoutComponent: ShowcaseStackLayout,
  routes: [
    MainTabNavigator,
    {
      path: 'settings',
      type: 'screen',
      component: SettingsScreen,
      options: {
        title: 'Settings',
        headerShown: true,
      },
    },
  ],
};

export default ShowcaseRouter;
