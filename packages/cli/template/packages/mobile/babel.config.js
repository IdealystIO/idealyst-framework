module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Idealyst StyleBuilder plugin - expands $iterator patterns in defineStyle/extendStyle
    // Must run BEFORE react-native-unistyles/plugin
    ['@idealyst/theme/plugin', {
      autoProcessPaths: [
        '@idealyst/components',
        '@idealyst/navigation',
        '@idealyst/theme',
      ],
      // Path to your theme configuration file (relative to this babel.config.js)
      themePath: '../shared/src/unistyles.ts',
    }],
    // Unistyles plugin - processes StyleSheet.create calls
    ['react-native-unistyles/plugin', {
      autoProcessPaths: [
        '@idealyst/components',
        '@idealyst/navigation',
        '@idealyst/theme',
      ],
    }],
    // Reanimated 4 uses the worklets plugin
    'react-native-worklets/plugin',
  ],
};
