module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@idealyst/theme/plugin', {
        themePath: '../shared/src/theme/styles.ts',
        autoProcessPaths: [
          '@idealyst/components',
          '@idealyst-docs/shared',
        ],
      }],
    ],
  };
};
