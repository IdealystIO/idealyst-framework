/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExampleHybridRouter, ExampleTabRouter, CustomStackLayout } from '@idealyst/navigation/examples';
import { NavigatorProvider, NavigatorParam, useNavigator } from '@idealyst/navigation';
import { Button, Screen, Text } from '@idealyst/components';
import Storage from '@idealyst/storage';
import OAuthTest from './OAuthTest';

const RootScreen = () => {
  const navigator = useNavigator();

  return (
    <Screen>
      <Text size="large" weight="bold">OAuth Client Test App</Text>
      <Text>Choose a test to run:</Text>
      <Button 
        variant="contained"
        intent="primary"
        onPress={() => navigator.navigate({ path: '/oauth', vars: {} })}
      >
        OAuth Test
      </Button>
      <Button 
        variant="outlined"
        intent="neutral"
        onPress={() => navigator.navigate({ path: '/tab', vars: {} })}
      >
        Original Examples
      </Button>
    </Screen>
  );
};

// Custom router with OAuth test
const OAuthTestRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  layoutComponent: CustomStackLayout,
  routes: [
    {
      type: 'screen',
      path: '/',
      component: RootScreen,
      options: {
        title: 'OAuth Test App',
      },
    },
    {
      type: 'screen',
      path: '/oauth',
      component: OAuthTest,
      options: {
        title: 'OAuth Client Test',
      },
    },
    {
      type: 'navigator',
      path: '/tab',
      layout: 'tab',
      routes: [
        {
          type: 'screen',
          path: '/a',
          component: () => <Text>Tab A Example</Text>,
          options: {
            title: 'Tab Example',
          },
        },
        {
          type: 'screen',
          path: '/b',
          component: () => <Text>Tab B Example</Text>,
          options: {
            title: 'B',
          },
        },
      ]
    },
  ]
};

// Main App component
function App() {
  useEffect(() => {
    // Initialize storage on app start
    Storage.getItem('app_initialized').then(value => {
      if (!value) {
        console.log('App initialized for the first time.');
        Storage.setItem('app_initialized', 'true');
      } else {
        console.log('App has been initialized before.');
      }
    });
  }, []);
  
  return (
    <SafeAreaProvider>
      <NavigatorProvider route={OAuthTestRouter} />
    </SafeAreaProvider>
  );
}

export default App;
