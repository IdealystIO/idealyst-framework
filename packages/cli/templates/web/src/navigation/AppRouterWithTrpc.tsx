import React from 'react';
import { NavigatorParam } from '@idealyst/navigation';
import { Screen, Text, View, Icon, Button } from '@idealyst/components';
import { trpc } from '../utils/trpc';

const HomeScreen = () => {
  // Example tRPC usage
  const [name, setName] = React.useState('{{projectName}}');
  const { data, isLoading, error, refetch } = trpc.hello.useQuery({ name });

  return (
    <Screen>
      <View spacing="lg">
        <Text size="xlarge" weight="bold">Home</Text>
        <Text size="medium">Welcome to your {{projectName}} app!</Text>
        <View spacing="md" style={{ marginTop: 24 }}>
          <Text size="small">
            This app uses tab navigation with tRPC integration. Navigate between tabs using the top bar or menu.
          </Text>
          
          {/* tRPC API Test */}
          <View spacing="sm" style={{ marginTop: 20 }}>
            <Text size="medium" weight="semibold">API Test (tRPC):</Text>
            <View spacing="xs">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <Button variant="outlined" onPress={() => refetch()} size="small">
                Test tRPC API
              </Button>
            </View>
            
            {/* Results */}
            <View style={{ marginTop: 12 }}>
              {isLoading && <Text size="small">Loading...</Text>}
              {error && <Text size="small" color="error">Error: {error.message}</Text>}
              {data && <Text size="small">✅ {data.greeting}</Text>}
            </View>
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

const AppRouterWithTrpc: NavigatorParam = {
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

export default AppRouterWithTrpc;