/**
 * React Native configuration for monorepo setup
 *
 * This file tells the React Native CLI where to find the mobile project
 * and its dependencies in a Yarn workspace monorepo structure.
 */
module.exports = {
  project: {
    android: {
      sourceDir: './packages/mobile/android',
      appName: 'app',
      packageName: '{{androidPackageName}}',
    },
    ios: {
      sourceDir: './packages/mobile/ios',
    },
  },
  // Dependencies are auto-detected from node_modules
};
