import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { UnistylesRegistry } from 'react-native-unistyles';
import { lightTheme, darkTheme } from '@idealyst/theme';
import { DocsApp } from '@idealyst-docs/shared';

// Register themes
UnistylesRegistry
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'light',
  });

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <DocsApp />
    </>
  );
}
