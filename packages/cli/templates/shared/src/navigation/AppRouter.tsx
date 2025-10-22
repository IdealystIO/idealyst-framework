import React from 'react';
import { NavigatorParam } from '@idealyst/navigation';
import { Screen, Text, View, Icon } from '@idealyst/components';
import { HelloWorld } from '../components/HelloWorld';

const HomeScreen = () => (
  <Screen>
    <View spacing="lg">
      <Text size="xl" weight="bold">Home</Text>
      <Text size="md">Welcome to your {{projectName}} app!</Text>
      <View spacing="md" style={{ marginTop: 24 }}>
        <Text size="sm">
          This app uses tab navigation. Navigate between tabs using the bottom bar on mobile or the top tabs on web.
        </Text>
      </View>
      
      {/* API Testing Component */}
      <View spacing="md" style={{ marginTop: 32 }}>
        <Text size="md" weight="semibold">API Test</Text>
        <HelloWorld name="{{projectName}}" />
      </View>
    </View>
  </Screen>
);

const ProfileScreen = () => (
  <Screen>
    <View spacing="lg">
      <Text size="xl" weight="bold">Profile</Text>
      <Text size="md">User profile and account settings</Text>
      <View spacing="md" style={{ marginTop: 24 }}>
        <Text size="sm">
          Manage your account details and preferences here.
        </Text>
      </View>
    </View>
  </Screen>
);

const SettingsScreen = () => (
  <Screen>
    <View spacing="lg">
      <Text size="xl" weight="bold">Settings</Text>
      <Text size="md">App configuration and preferences</Text>
      <View spacing="md" style={{ marginTop: 24 }}>
        <Text size="sm">
          Customize your app experience with various settings and options.
        </Text>
      </View>
    </View>
  </Screen>
);

const AppRouter: NavigatorParam = {
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
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, size }) => (
          <Icon name="home" color={focused ? 'blue' : 'gray'} size={size || 24} />
        ),
      },
    },
    {
      type: 'screen',
      path: '/profile',
      component: ProfileScreen,
      options: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, size }) => (
          <Icon name="account" color={focused ? 'blue' : 'gray'} size={size || 24} />
        ),
      },
    },
    {
      type: 'screen',
      path: '/settings',
      component: SettingsScreen,
      options: {
        title: 'Settings',
        tabBarLabel: 'Settings', 
        tabBarIcon: ({ focused, size }) => (
          <Icon name="cog" color={focused ? 'blue' : 'gray'} size={size || 24} />
        ),
      },
    },
  ],
};

export default AppRouter;