/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { ExampleStackRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';

function App() {
  return (
    <NavigatorProvider route={ExampleStackRouter} />
  );
}

export default App;
