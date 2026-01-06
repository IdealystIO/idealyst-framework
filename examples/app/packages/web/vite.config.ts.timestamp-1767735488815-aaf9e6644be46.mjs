// vite.config.ts
import { defineConfig } from "file:///home/nicho/Development/idealyst-framework/examples/app/packages/web/node_modules/vite/dist/node/index.js";
import react from "file:///home/nicho/Development/idealyst-framework/examples/app/packages/web/node_modules/@vitejs/plugin-react/dist/index.js";
import babel from "file:///home/nicho/Development/idealyst-framework/examples/app/packages/web/node_modules/vite-plugin-babel/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/nicho/Development/idealyst-framework/examples/app/packages/web";
var vite_config_default = defineConfig({
  plugins: [
    babel({
      filter: (id) => id.includes("node_modules/@idealyst/") || id.includes("/packages/") && /\.(tsx?|jsx?)$/.test(id),
      babelConfig: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }],
          [
            "@babel/preset-typescript",
            {
              isTSX: true,
              allExtensions: true
            }
          ]
        ],
        plugins: [
          [
            "react-native-unistyles/plugin",
            {
              root: "src",
              autoProcessPaths: [
                "@idealyst/components",
                "@idealyst/navigation",
                "@idealyst/theme"
              ]
            }
          ],
          [path.resolve(__vite_injected_original_dirname, "../../../../packages/components/plugin/web.js"), { root: "src" }]
        ]
      }
    }),
    // Then process everything else with React plugin
    react()
  ],
  resolve: {
    alias: {
      // Use absolute path to resolve react-native-web properly
      "react-native": path.resolve(__vite_injected_original_dirname, "node_modules/react-native-web"),
      "react-native-unistyles": path.resolve(__vite_injected_original_dirname, "node_modules/react-native-unistyles"),
      "@mdi/react": path.resolve(__vite_injected_original_dirname, "node_modules/@mdi/react"),
      "@mdi/js": path.resolve(__vite_injected_original_dirname, "node_modules/@mdi/js"),
      "@react-native/normalize-colors": path.resolve(__vite_injected_original_dirname, "node_modules/@react-native/normalize-colors"),
      // Ensure we use the source code of our packages for live development
      "@idealyst/components": path.resolve(__vite_injected_original_dirname, "../../../../packages/components/src"),
      "@idealyst/navigation": path.resolve(__vite_injected_original_dirname, "../../../../packages/navigation/src"),
      "@idealyst/theme": path.resolve(__vite_injected_original_dirname, "../../../../packages/theme/src"),
      "@idealyst/datagrid": path.resolve(__vite_injected_original_dirname, "../../../../packages/datagrid/src"),
      "@idealyst/datepicker": path.resolve(__vite_injected_original_dirname, "../../../../packages/datepicker/src")
    },
    // Platform-specific file resolution
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".js", ".jsx"],
    // Ensure proper resolution of package exports
    conditions: ["browser", "import", "module", "default"],
    // Ensure workspace dependencies resolve properly
    preserveSymlinks: false
  },
  define: {
    global: "globalThis",
    __DEV__: JSON.stringify(true)
  },
  optimizeDeps: {
    exclude: [
      "@idealyst/components",
      "@idealyst/navigation",
      "@idealyst/theme",
      "@idealyst/datagrid",
      "@idealyst/datepicker",
      "@test-select-demo/shared"
    ],
    esbuildOptions: {
      resolveExtensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".jsx", ".js"],
      loader: {
        ".tsx": "tsx",
        ".ts": "ts"
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uaWNoby9EZXZlbG9wbWVudC9pZGVhbHlzdC1mcmFtZXdvcmsvZXhhbXBsZXMvYXBwL3BhY2thZ2VzL3dlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbmljaG8vRGV2ZWxvcG1lbnQvaWRlYWx5c3QtZnJhbWV3b3JrL2V4YW1wbGVzL2FwcC9wYWNrYWdlcy93ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbmljaG8vRGV2ZWxvcG1lbnQvaWRlYWx5c3QtZnJhbWV3b3JrL2V4YW1wbGVzL2FwcC9wYWNrYWdlcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGJhYmVsIGZyb20gJ3ZpdGUtcGx1Z2luLWJhYmVsJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBiYWJlbCh7XG4gICAgICBmaWx0ZXI6IChpZCkgPT5cbiAgICAgICAgaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXMvQGlkZWFseXN0L1wiKSB8fFxuICAgICAgICAoaWQuaW5jbHVkZXMoXCIvcGFja2FnZXMvXCIpICYmIC9cXC4odHN4P3xqc3g/KSQvLnRlc3QoaWQpKSxcbiAgICAgIGJhYmVsQ29uZmlnOiB7XG4gICAgICAgIHByZXNldHM6IFtcbiAgICAgICAgICBbXCJAYmFiZWwvcHJlc2V0LXJlYWN0XCIsIHsgcnVudGltZTogXCJhdXRvbWF0aWNcIiB9XSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtdHlwZXNjcmlwdFwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc1RTWDogdHJ1ZSxcbiAgICAgICAgICAgICAgYWxsRXh0ZW5zaW9uczogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFwicmVhY3QtbmF0aXZlLXVuaXN0eWxlcy9wbHVnaW5cIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcm9vdDogXCJzcmNcIixcbiAgICAgICAgICAgICAgYXV0b1Byb2Nlc3NQYXRoczogW1xuICAgICAgICAgICAgICAgIFwiQGlkZWFseXN0L2NvbXBvbmVudHNcIixcbiAgICAgICAgICAgICAgICBcIkBpZGVhbHlzdC9uYXZpZ2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJAaWRlYWx5c3QvdGhlbWVcIixcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21wb25lbnRzL3BsdWdpbi93ZWIuanNcIiksIHsgcm9vdDogXCJzcmNcIiB9XSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgLy8gVGhlbiBwcm9jZXNzIGV2ZXJ5dGhpbmcgZWxzZSB3aXRoIFJlYWN0IHBsdWdpblxuICAgIHJlYWN0KCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgLy8gVXNlIGFic29sdXRlIHBhdGggdG8gcmVzb2x2ZSByZWFjdC1uYXRpdmUtd2ViIHByb3Blcmx5XG4gICAgICAncmVhY3QtbmF0aXZlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9yZWFjdC1uYXRpdmUtd2ViJyksXG4gICAgICAncmVhY3QtbmF0aXZlLXVuaXN0eWxlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvcmVhY3QtbmF0aXZlLXVuaXN0eWxlcycpLFxuICAgICAgJ0BtZGkvcmVhY3QnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL0BtZGkvcmVhY3QnKSxcbiAgICAgICdAbWRpL2pzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9AbWRpL2pzJyksXG4gICAgICAnQHJlYWN0LW5hdGl2ZS9ub3JtYWxpemUtY29sb3JzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9AcmVhY3QtbmF0aXZlL25vcm1hbGl6ZS1jb2xvcnMnKSxcbiAgICAgIC8vIEVuc3VyZSB3ZSB1c2UgdGhlIHNvdXJjZSBjb2RlIG9mIG91ciBwYWNrYWdlcyBmb3IgbGl2ZSBkZXZlbG9wbWVudFxuICAgICAgJ0BpZGVhbHlzdC9jb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBvbmVudHMvc3JjJyksXG4gICAgICAnQGlkZWFseXN0L25hdmlnYXRpb24nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vLi4vLi4vcGFja2FnZXMvbmF2aWdhdGlvbi9zcmMnKSxcbiAgICAgICdAaWRlYWx5c3QvdGhlbWUnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vLi4vLi4vcGFja2FnZXMvdGhlbWUvc3JjJyksXG4gICAgICAnQGlkZWFseXN0L2RhdGFncmlkJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uLy4uLy4uL3BhY2thZ2VzL2RhdGFncmlkL3NyYycpLFxuICAgICAgJ0BpZGVhbHlzdC9kYXRlcGlja2VyJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uLy4uLy4uL3BhY2thZ2VzL2RhdGVwaWNrZXIvc3JjJyksXG4gICAgfSxcbiAgICAvLyBQbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHJlc29sdXRpb25cbiAgICBleHRlbnNpb25zOiBbJy53ZWIudHN4JywgJy53ZWIudHMnLCAnLnRzeCcsICcudHMnLCAnLmpzJywgJy5qc3gnXSxcbiAgICAvLyBFbnN1cmUgcHJvcGVyIHJlc29sdXRpb24gb2YgcGFja2FnZSBleHBvcnRzXG4gICAgY29uZGl0aW9uczogWydicm93c2VyJywgJ2ltcG9ydCcsICdtb2R1bGUnLCAnZGVmYXVsdCddLFxuICAgIC8vIEVuc3VyZSB3b3Jrc3BhY2UgZGVwZW5kZW5jaWVzIHJlc29sdmUgcHJvcGVybHlcbiAgICBwcmVzZXJ2ZVN5bWxpbmtzOiBmYWxzZVxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcbiAgICBfX0RFVl9fOiBKU09OLnN0cmluZ2lmeSh0cnVlKSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogW1xuICAgICAgJ0BpZGVhbHlzdC9jb21wb25lbnRzJyxcbiAgICAgICdAaWRlYWx5c3QvbmF2aWdhdGlvbicsXG4gICAgICAnQGlkZWFseXN0L3RoZW1lJyxcbiAgICAgICdAaWRlYWx5c3QvZGF0YWdyaWQnLFxuICAgICAgJ0BpZGVhbHlzdC9kYXRlcGlja2VyJyxcbiAgICAgICdAdGVzdC1zZWxlY3QtZGVtby9zaGFyZWQnLFxuICAgIF0sXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHJlc29sdmVFeHRlbnNpb25zOiBbXCIud2ViLnRzeFwiLCBcIi53ZWIudHNcIiwgXCIudHN4XCIsIFwiLnRzXCIsIFwiLmpzeFwiLCBcIi5qc1wiXSxcbiAgICAgIGxvYWRlcjoge1xuICAgICAgICBcIi50c3hcIjogXCJ0c3hcIixcbiAgICAgICAgXCIudHNcIjogXCJ0c1wiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0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
