const path = require('path');

const ReactCompilerConfig = {
  target: '19' // React 19 is used in this project
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['babel-plugin-react-compiler', ReactCompilerConfig],
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
        '@idealyst/datepicker': path.resolve(__dirname, '../../packages/datepicker/src'),
      },
    }],
    'react-native-reanimated/plugin',
  ],
};