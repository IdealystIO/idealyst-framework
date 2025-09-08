/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExampleTabRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';

function App() {
  return (
    <SafeAreaProvider>
      <NavigatorProvider route={ExampleTabRouter} />
    </SafeAreaProvider>
  );
}

export default App;
