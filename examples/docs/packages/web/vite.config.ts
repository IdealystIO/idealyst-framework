import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from 'vite-plugin-babel'
import path from 'path'
// Note: Config imports must use relative path; runtime code uses @idealyst/tooling with alias
import { idealystDocsPlugin } from '../../../../packages/tooling/src/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Idealyst docs plugin generates component registry
    idealystDocsPlugin({
      componentPaths: [path.resolve(__dirname, '../../../../packages/components/src')],
      themePath: path.resolve(__dirname, '../shared/src/styles.ts'),
      debug: true,
    }),
    babel({
      filter: (id) =>
        id.includes("node_modules/@idealyst/") ||
        (id.includes("/packages/") && /\.(tsx?|jsx?)$/.test(id)),
      babelConfig: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }],
          [
            "@babel/preset-typescript",
            {
              isTSX: true,
              allExtensions: true,
            },
          ],
        ],
        plugins: [
          // Idealyst plugin runs FIRST to expand $iterator patterns
          [
            path.resolve(__dirname, "../../../../packages/theme/src/babel/plugin.js"),
            {
              autoProcessPaths: [
                'packages/components',
                'packages/navigation',
                'packages/theme',
                'packages/shared',
                '@idealyst/components',
                '@idealyst/navigation',
                '@idealyst/theme',
                '@idealyst/datagrid',
                '@idealyst/datepicker',
                '@idealyst/translate',
                '@idealyst/tooling',
                '@idealyst/markdown',
              ],
              themePath: '../shared/src/styles.ts',
            }
          ],
          // Unistyles plugin runs SECOND to process expanded StyleSheet.create
          [
            "react-native-unistyles/plugin",
            {
              root: "src",
              autoProcessPaths: [
                "packages/components",
                "packages/navigation",
                "packages/theme",
                "packages/shared",
                "@idealyst/components",
                "@idealyst/navigation",
                "@idealyst/theme",
                "@idealyst/datagrid",
                "@idealyst/datepicker",
                "@idealyst/translate",
                "@idealyst/tooling",
                "@idealyst/markdown",
              ],
            },
          ],
          [path.resolve(__dirname, "../../../../packages/components/plugin/web.js")],
        ],
      },
    }),
    // React plugin with React Compiler enabled
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", {}],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      // Use absolute path to resolve react-native-web properly
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
      'react-native-unistyles': path.resolve(__dirname, 'node_modules/react-native-unistyles'),
      '@mdi/react': path.resolve(__dirname, 'node_modules/@mdi/react'),
      '@mdi/js': path.resolve(__dirname, 'node_modules/@mdi/js'),
      '@react-native/normalize-colors': path.resolve(__dirname, 'node_modules/@react-native/normalize-colors'),
      // Ensure we use the source code of our packages for live development
      '@idealyst/components': path.resolve(__dirname, '../../../../packages/components/src'),
      '@idealyst/navigation': path.resolve(__dirname, '../../../../packages/navigation/src'),
      '@idealyst/theme': path.resolve(__dirname, '../../../../packages/theme/src'),
      '@idealyst/datagrid': path.resolve(__dirname, '../../../../packages/datagrid/src'),
      '@idealyst/datepicker': path.resolve(__dirname, '../../../../packages/datepicker/src'),
      '@idealyst/translate': path.resolve(__dirname, '../../../../packages/translate/src'),
      '@idealyst/tooling': path.resolve(__dirname, '../../../../packages/tooling/src'),
      '@idealyst/markdown': path.resolve(__dirname, '../../../../packages/markdown/src'),
    },
    // Platform-specific file resolution
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.js', '.jsx'],
    // Ensure proper resolution of package exports
    conditions: ['browser', 'import', 'module', 'default'],
    // Ensure workspace dependencies resolve properly
    preserveSymlinks: false
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(true),
  },
  optimizeDeps: {
    exclude: [
      '@idealyst/components',
      '@idealyst/navigation',
      '@idealyst/theme',
      '@idealyst/datagrid',
      '@idealyst/datepicker',
      '@idealyst/translate',
      '@idealyst/tooling',
      '@test-select-demo/shared',
      '@idealyst/markdown',
    ],
    esbuildOptions: {
      resolveExtensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".jsx", ".js"],
      loader: {
        ".tsx": "tsx",
        ".ts": "ts",
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
  },
}) 