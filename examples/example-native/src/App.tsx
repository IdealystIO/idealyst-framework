/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
} from 'react-native';

import { ExampleStackRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';


function App() {  

  const backgroundStyle = {
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <NavigatorProvider route={ExampleStackRouter} />
    </SafeAreaView>
  );
}

export default App;
