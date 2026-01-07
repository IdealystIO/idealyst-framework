/**
 * Idealyst Configuration
 *
 * This file defines the theme configuration for your Idealyst application.
 * Run the generator to create flat, Unistyles-compatible style files:
 *
 *   npx ts-node ../../packages/theme/src/config/cli.ts ./idealyst.config.ts ./generated
 */

import { defineConfig } from '@idealyst/theme/config';
import { lightTheme } from '@idealyst/theme/lightTheme';
import { darkTheme } from '@idealyst/theme/darkTheme';

export default defineConfig({
    themes: {
        light: lightTheme,
        dark: darkTheme,
    },

    // Optional: Extend component styles
    extensions: {
        // Example: Add custom border radius to all buttons
        // Button: {
        //     button: {
        //         borderRadius: 16,
        //     },
        // },

        // Example: Theme-aware extensions using a function
        // Card: (theme) => ({
        //     card: {
        //         borderWidth: 1,
        //         borderColor: theme.colors.border.primary,
        //     },
        // }),
    },

    // Optional: Output configuration
    output: {
        dir: './generated',
        format: 'typescript',
    },
});
