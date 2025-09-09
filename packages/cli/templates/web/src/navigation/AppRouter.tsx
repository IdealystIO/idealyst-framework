import React from 'react';
import { RouteParam } from '@idealyst/navigation';
import { Screen, Text, View, Icon } from '@idealyst/components';

// Simple API test component for web-only projects  
const ApiTest = () => {
  const [result, setResult] = React.useState<string>('Click to test API');
  
  const testApi = async () => {
    try {
      setResult('Testing...');
      // Simple fetch test - replace with actual API endpoint
      const response = await fetch('/api/test');
      if (response.ok) {
        setResult('✅ API connection successful!');
      } else {
        setResult('❌ API connection failed');
      }
    } catch (error) {
      setResult('❌ API connection failed');
    }
  };

  return (
    <View spacing="sm">
      <Text size="small">{result}</Text>
      <button onClick={testApi} style={{ padding: '8px 16px', marginTop: '8px' }}>
        Test API
      </button>
    </View>
  );
};

const HomeScreen = () => (
  <Screen>
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Home</Text>
      <Text size="medium">Welcome to your {{projectName}} app!</Text>
      <View spacing="md" style={{ marginTop: 24 }}>
        <Text size="small">
          This app uses tab navigation. Navigate between tabs using the top bar or menu.
        </Text>
      </View>
      
      {/* API Testing Component */}
      <View spacing="md" style={{ marginTop: 32 }}>
        <Text size="medium" weight="semibold">API Test</Text>
        <ApiTest />
      </View>
    </View>
  </Screen>
);

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

const AppRouter: RouteParam = {
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

export default AppRouter;