const path = require('path');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    // Handle workspace packages
    '@idealyst/components': {
      root: path.join(__dirname, '../components'),
    },
    '@idealyst/navigation': {
      root: path.join(__dirname, '../navigation'),
    },
    '@idealyst/theme': {
      root: path.join(__dirname, '../theme'),
    },
  },
  // Additional configuration for workspace
  watchFolders: [
    path.resolve(__dirname, '../../packages/components'),
    path.resolve(__dirname, '../../packages/navigation'),
    path.resolve(__dirname, '../../packages/theme'),
    path.resolve(__dirname, '../../node_modules'),
  ],
}; 