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
        '@idealyst/datagrid',
        '@idealyst/datepicker',
        // Filesystem paths (for when Metro resolves to local source)
        'packages/components',
        'packages/navigation',
        'packages/theme',
        'packages/datagrid',
        'packages/datepicker',
      ],
      debug: false,
      themePath: '../shared/src/unistyles.ts'
    }],
    ['react-native-unistyles/plugin', {
      root: 'src',
      debug: false,
      autoProcessPaths: [
        // Aliased paths
        '@idealyst/components',
        '@idealyst/navigation',
        '@idealyst/theme',
        '@idealyst/datagrid',
        '@idealyst/datepicker',
        // Filesystem paths
        'packages/components',
        'packages/navigation',
        'packages/theme',
        'packages/datagrid',
        'packages/datepicker',
      ]
    }],
    // Reanimated 4 uses worklets plugin (add back when ready to test)
    'react-native-worklets/plugin',
  ],

};