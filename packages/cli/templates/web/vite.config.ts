import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from 'vite-plugin-babel'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    babel({
      filter: (id) => id.includes("node_modules/@idealyst/") || id.includes("/packages/"),
      babelConfig: {
        presets: [
          ['@babel/preset-typescript', {
            isTSX: true,
            allExtensions: true,
          }]
        ],
        plugins: [
          ['react-native-unistyles/plugin', {
            root: 'src',
            autoProcessPaths: ['@idealyst/components', '@idealyst/navigation', '@idealyst/theme'],
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
    ],
    exclude: [
      'react-native-edge-to-edge',
      'react-native-nitro-modules',
      '@idealyst/components',
      '@idealyst/navigation', 
      '@idealyst/theme',
      '@{{workspaceScope}}/shared',
    ],
    esbuildOptions: {
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.jsx': 'jsx',
        '.js': 'jsx' // Important: treat .js files as JSX for React Native compatibility
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
}) 