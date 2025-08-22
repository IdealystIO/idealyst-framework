const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-unistyles/plugin', {
      debug: true,
      root: 'src',
      // autoProcessPaths: ['@idealyst/components', '@idealyst/navigation', '@idealyst/theme'],
    }],
    ['module-resolver', {
      // This can be used to get live updates when developing the components
      alias: {
        '@idealyst/components': path.resolve(__dirname, '../../packages/components/src'),
        '@idealyst/navigation': path.resolve(__dirname, '../../packages/navigation/src'),
        '@idealyst/theme': path.resolve(__dirname, '../../packages/theme/src'),
        '@idealyst/datagrid': path.resolve(__dirname, '../../packages/datagrid/src'),
      },
    }],
    'react-native-reanimated/plugin',
  ],
};