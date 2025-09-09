import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from 'vite-plugin-babel'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    babel({
      filter: (id) => (id.includes('node_modules/@idealyst/') || id.includes('packages/')) && /\.(js|jsx|ts|tsx)$/.test(id),
      babelConfig: {
        presets: [
          ['@babel/preset-typescript', {
            isTSX: true,
            allExtensions: true,
          }]
        ],
        plugins: [
          ['babel-plugin-react-compiler', { target: '19' }],
          ['react-native-unistyles/plugin', {
            root: 'src',
            autoProcessPaths: ['@idealyst/components', '@idealyst/navigation', '@idealyst/theme', '@idealyst/datagrid', '@idealyst/datepicker'],
          }],
          ['@idealyst/components/plugin/web', { root: 'src' }]
        ]
      }
    }),
    // Then process everything else with React plugin
    react(),
  ],
  resolve: {
    alias: {
      // Use absolute path to resolve react-native-web properly
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
      '@react-native/normalize-colors': path.resolve(__dirname, 'node_modules/@react-native/normalize-colors'),
      '@idealyst/components': path.resolve(__dirname, '../../packages/components/src'),
      '@idealyst/navigation': path.resolve(__dirname, '../../packages/navigation/src'),
      '@idealyst/theme': path.resolve(__dirname, '../../packages/theme/src'),
      '@idealyst/datagrid': path.resolve(__dirname, '../../packages/datagrid/src'),
      '@idealyst/datepicker': path.resolve(__dirname, '../../packages/datepicker/src'),
      '@idealyst/storage': path.resolve(__dirname, '../../packages/storage/src'),
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
    include: [
      'react-native-web',
      '@react-native/normalize-colors',
      'react-native-unistyles',
      'react-native-unistyles/web',
      '@mdi/react',
      '@mdi/js',
      'react-window',
    ],
    exclude: [
      'react-native-edge-to-edge',
      'react-native-nitro-modules',
      '@idealyst/cli',
      '@idealyst/components',
      '@idealyst/navigation', 
      '@idealyst/theme',
      '@idealyst/datagrid',
      '@idealyst/datepicker',
      '@testproject/shared',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
}) 