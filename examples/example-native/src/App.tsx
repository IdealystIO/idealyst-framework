/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExampleTabRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';
import Storage from '@idealyst/storage';

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
      <NavigatorProvider route={ExampleTabRouter} />
    </SafeAreaProvider>
  );
}

export default App;
