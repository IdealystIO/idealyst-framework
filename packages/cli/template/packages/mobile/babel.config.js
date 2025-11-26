module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-unistyles/plugin', {
      root: 'src',
      autoProcessPaths: ['@idealyst/components', '@idealyst/navigation', '@idealyst/theme'],
    }],
    'react-native-reanimated/plugin'
  ],
};