const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = {
  projectRoot: __dirname,
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
    // Important for Idealyst to use .native extensions for React Native (eg: @idealyst/components/src/Button/Button.native.tsx)
    sourceExts: ['native.tsx', 'native.ts', 'tsx', 'ts', 'native.jsx', 'native.js', 'jsx', 'js', 'json', 'svg'],
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
  },
  watchFolders: [
    // This is for debug purposes only - Babel should be updated to alias the packages to get live
    path.resolve(__dirname, '../../packages/components'),
    path.resolve(__dirname, '../../packages/navigation'),
    path.resolve(__dirname, '../../packages/theme'),
    path.resolve(__dirname, '../../packages/datagrid'),
    path.resolve(__dirname, '../../packages/datepicker'),
    path.resolve(__dirname, '../../packages/storage'),
    path.resolve(__dirname, 'src'),
  ],
  watcher: {
    // When configuring custom components with .native extensions, make sure the watcher looks for them
    additionalExts: ['native.tsx', 'native.ts', 'native.jsx', 'native.js'],
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));
