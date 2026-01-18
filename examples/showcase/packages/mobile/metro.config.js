const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const extraNodeModules = {
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'react-native-unistyles': path.resolve(__dirname, 'node_modules/react-native-unistyles'),
  '@idealyst/components': path.resolve(__dirname, '../../../../packages/components/src'),
  '@idealyst/navigation': path.resolve(__dirname, '../../../../packages/navigation/src'),
  '@idealyst/navigation/examples': path.resolve(__dirname, '../../../../packages/navigation/src/examples'),
  '@idealyst/theme': path.resolve(__dirname, '../../../../packages/theme/src'),
};

const config = {
  projectRoot: __dirname,
  watchFolders: [
    // Add the workspace root to watch folders so Metro can watch workspace packages
    path.resolve(__dirname, '../..'),
    // Add the monorepo packages directory
    path.resolve(__dirname, '../../../../packages'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      // Add the workspace root node_modules
      path.resolve(__dirname, '../..', 'node_modules'),
    ],
    // Important for Idealyst to use .native extensions for React Native (eg: @idealyst/components/src/Button/Button.native.tsx)
    sourceExts: ['native.tsx', 'native.ts', 'tsx', 'ts', 'native.jsx', 'native.js', 'jsx', 'js', 'json', 'cjs'],
    extraNodeModules,
    disableHierarchicalLookup: true,
    // Force @idealyst packages to resolve to local source
    resolveRequest: (context, moduleName, platform) => {
      // Check if this is an @idealyst package
      for (const [alias, aliasPath] of Object.entries(extraNodeModules)) {
        if (moduleName === alias || moduleName.startsWith(alias + '/')) {
          const subPath = moduleName.slice(alias.length);
          const resolvedPath = subPath ? path.join(aliasPath, subPath) : aliasPath;
          return context.resolveRequest(context, resolvedPath, platform);
        }
      }
      // Default resolution for everything else
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  watcher: {
    // When configuring custom components with .native extensions, make sure the watcher looks for them
    additionalExts: ['native.tsx', 'native.ts', 'native.jsx', 'native.js'],
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));
