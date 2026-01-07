/**
 * Idealyst Configuration Types
 *
 * This module defines the structure for idealyst.config.ts files.
 * The config is used to generate flat, Unistyles-compatible style files.
 */

import type { Theme } from '../theme';

/**
 * Component extension definition.
 * Can be either static styles or a function that receives the theme.
 */
export type ComponentExtension<T = Record<string, any>> =
    | T
    | ((theme: Theme) => T);

/**
 * Extension definitions for all components.
 */
export interface ComponentExtensions {
    View?: ComponentExtension<{
        view?: Record<string, any>;
    }>;
    Button?: ComponentExtension<{
        button?: Record<string, any>;
        text?: Record<string, any>;
        icon?: Record<string, any>;
        iconContainer?: Record<string, any>;
    }>;
    Text?: ComponentExtension<{
        text?: Record<string, any>;
    }>;
    Card?: ComponentExtension<{
        card?: Record<string, any>;
    }>;
    Input?: ComponentExtension<{
        wrapper?: Record<string, any>;
        input?: Record<string, any>;
        label?: Record<string, any>;
        hint?: Record<string, any>;
    }>;
    Screen?: ComponentExtension<{
        screen?: Record<string, any>;
        screenContent?: Record<string, any>;
    }>;
    // Add more components as needed...
    [key: string]: ComponentExtension | undefined;
}

/**
 * Theme definition in the config.
 */
export interface ThemeDefinition {
    /**
     * The built theme object.
     * Created using createTheme() or fromTheme() builders.
     */
    theme: Theme;

    /**
     * Optional name for this theme variant.
     * Defaults to 'light' for the first theme, 'dark' for the second.
     */
    name?: string;
}

/**
 * Main Idealyst configuration structure.
 */
export interface IdealystConfig {
    /**
     * Theme definitions.
     * At minimum, define light and dark themes.
     */
    themes: {
        light: Theme;
        dark: Theme;
        [key: string]: Theme;
    };

    /**
     * Global component style extensions.
     * These are merged with base component styles.
     */
    extensions?: ComponentExtensions;

    /**
     * Output configuration.
     */
    output?: {
        /**
         * Directory to output generated style files.
         * Relative to config file location.
         * @default './generated'
         */
        dir?: string;

        /**
         * Whether to generate TypeScript or JavaScript.
         * @default 'typescript'
         */
        format?: 'typescript' | 'javascript';
    };
}

/**
 * Helper to define a config with full type inference.
 */
export function defineConfig(config: IdealystConfig): IdealystConfig {
    return config;
}
