module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Idealyst StyleBuilder plugin - expands $iterator patterns in defineStyle/extendStyle
    ['../../../../packages/theme/src/babel/plugin.js', {
      // Include both aliased and filesystem paths
      autoProcessPaths: [
        // Aliased paths
        '@idealyst/components',
        '@idealyst/navigation',
        '@idealyst/theme',
        '@idealyst-showcase/shared',
        // Filesystem paths (for when Metro resolves to local source)
        'packages/components',
        'packages/navigation',
        'packages/theme',
      ],
      debug: false,
      themePath: '../shared/src/styles.ts'
    }],
    ['react-native-unistyles/plugin', {
      root: 'src',
      debug: false,
      autoProcessPaths: [
        // Aliased paths
        '@idealyst/components',
        '@idealyst/navigation',
        '@idealyst/theme',
        '@idealyst-showcase/shared',
        // Filesystem paths
        'packages/components',
        'packages/navigation',
        'packages/theme',
      ]
    }],
    // Reanimated 4 uses worklets plugin
    'react-native-worklets/plugin',
  ],
};
