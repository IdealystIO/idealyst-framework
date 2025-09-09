import React from 'react';
import { RouteParam } from '@idealyst/navigation';
import { Screen, Text, View, Icon } from '@idealyst/components';
import { trpc } from '../utils/trpc';

const HomeScreen = () => {
  // Example tRPC usage
  const { data, isLoading, error } = trpc.hello.useQuery({ name: 'World' });

  return (
    <Screen>
      <View spacing="lg">
        <Text size="xlarge" weight="bold">Home</Text>
        <Text size="medium">Welcome to your {{projectName}} app!</Text>
        <View spacing="md" style={{ marginTop: 24 }}>
          <Text size="small">
            This app uses tab navigation with tRPC integration. Navigate between tabs using the top bar or menu.
          </Text>
          
          {/* tRPC Example */}
          <View spacing="sm" style={{ marginTop: 20 }}>
            <Text size="medium" weight="semibold">tRPC Example:</Text>
            {isLoading && <Text>Loading...</Text>}
            {error && <Text>Error: {error.message}</Text>}
            {data && <Text>{data.greeting}</Text>}
          </View>
        </View>
      </View>
    </Screen>
  );
};

const ProfileScreen = () => (
  <Screen>
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Profile</Text>
      <Text size="medium">User profile and account settings</Text>
      <View spacing="md" style={{ marginTop: 24 }}>
        <Text size="small">
          Manage your account details and preferences here.
        </Text>
      </View>
    </View>
  </Screen>
);

const SettingsScreen = () => (
  <Screen>
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Settings</Text>
      <Text size="medium">App configuration and preferences</Text>
      <View spacing="md" style={{ marginTop: 24 }}>
        <Text size="small">
          Customize your app experience with various settings and options.
        </Text>
      </View>
    </View>
  </Screen>
);

const AppRouterWithTrpc: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: {
    type: "tab",
  },
  screenOptions: {
    title: 'Home',
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused, size }) => (
      <Icon name="home" color={focused ? 'blue' : 'gray'} size={size || 24} />
    ),
  },
  routes: [
    { 
      path: "profile", 
      component: ProfileScreen,
      screenOptions: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, size }) => (
          <Icon name="account" color={focused ? 'blue' : 'gray'} size={size || 24} />
        ),
      },
    },
    { 
      path: "settings", 
      component: SettingsScreen,
      screenOptions: {
        title: 'Settings',
        tabBarLabel: 'Settings', 
        tabBarIcon: ({ focused, size }) => (
          <Icon name="cog" color={focused ? 'blue' : 'gray'} size={size || 24} />
        ),
      },
    },
  ],
};

export default AppRouterWithTrpc;