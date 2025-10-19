module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-unistyles/plugin', {
      root: 'src',
      autoProcessPaths: ['@idealyst/components', '@idealyst/navigation', '@idealyst/theme'],
    }],
    'react-native-reanimated/plugin',
    ['module-resolver', {
      alias: {
          // Use absolute path to resolve react-native-web properly
          'react-native': './node_modules/react-native',
          'react-native-unistyles': './node_modules/react-native-unistyles',
          '@mdi/react': './node_modules/@mdi/react',
          '@mdi/js': './node_modules/@mdi/js',
          '@react-native/normalize-colors': './node_modules/@react-native/normalize-colors',
          // Ensure we use the source code of our packages for live development
          '@idealyst/components': '../../../../packages/components/src',
          '@idealyst/navigation': '../../../../packages/navigation/src',
          '@idealyst/theme': '../../../../packages/theme/src',
        },
    }]
  ],

};