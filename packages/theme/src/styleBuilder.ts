/**
 * StyleBuilder - Declarative styling system with extension support
 *
 * This module provides the API for defining and extending component styles.
 * - defineStyle: Define base styles for a component (used by library)
 * - extendStyle: Extend/override styles (used by consumer apps)
 *
 * The Babel plugin transforms these calls to:
 * 1. Expand $iterator patterns (theme.$intents, theme.sizes.$button, etc.)
 * 2. Replace with __defineStyle/__extendStyle from the registry
 *
 * @example
 * ```typescript
 * // In library (packages/components)
 * export const buttonStyles = defineStyle('Button', (theme) => ({
 *   button: {
 *     borderRadius: theme.radii.md,
 *     variants: {
 *       intent: {
 *         backgroundColor: theme.$intents.primary,
 *       },
 *     },
 *   },
 * }));
 *
 * // In consumer app
 * extendStyle('Button', (theme) => ({
 *   button: {
 *     borderRadius: theme.radii.lg, // Override
 *     variants: {
 *       rounded: { true: { borderRadius: 9999 } }, // Add new variant
 *     },
 *   },
 * }));
 * ```
 */

import { StyleSheet } from 'react-native-unistyles';
import { __defineStyle, __extendStyle, __overrideStyle } from './styleRegistry';
import type { ComponentStyleRegistry, ExtendStyleDef, OverrideStyleDef } from './componentStyles';

/**
 * Component names for type safety
 */
export type ComponentName =
  | 'Accordion'
  | 'ActivityIndicator'
  | 'Alert'
  | 'Avatar'
  | 'Badge'
  | 'Breadcrumb'
  | 'Button'
  | 'Card'
  | 'Checkbox'
  | 'Chip'
  | 'Dialog'
  | 'Divider'
  | 'Icon'
  | 'Image'
  | 'Input'
  | 'Link'
  | 'List'
  | 'Menu'
  | 'Popover'
  | 'Pressable'
  | 'Progress'
  | 'RadioButton'
  | 'Screen'
  | 'Select'
  | 'Skeleton'
  | 'Slider'
  | 'StyleBuilderTest'
  | 'SVGImage'
  | 'Switch'
  | 'TabBar'
  | 'Table'
  | 'Text'
  | 'TextArea'
  | 'Tooltip'
  | 'Video'
  | 'View';

/**
 * Style definition callback type
 */
export type StyleCallback<TTheme, TStyles> = (theme: TTheme) => TStyles;

/**
 * Define base styles for a component.
 *
 * Use this in the component library to define the default styles.
 * Consumer apps can extend these using `extendStyle`.
 *
 * The Babel plugin transforms this to expand $iterator patterns
 * and register with the style registry.
 *
 * @param componentName - The component name (e.g., 'Button', 'Text')
 * @param styles - Callback receiving theme, returns style definitions
 * @returns StyleSheet with the defined styles
 */
export function defineStyle<TTheme, TStyles>(
  componentName: ComponentName,
  styles: StyleCallback<TTheme, TStyles>
): ReturnType<typeof StyleSheet.create> {
  // This function is replaced by Babel with __defineStyle
  // Runtime fallback for non-transformed code
  return __defineStyle(componentName, styles as any);
}

/**
 * Extend existing component styles.
 *
 * Use this in consumer apps to override or add to library component styles.
 * Extensions are deep-merged with base styles.
 *
 * For registered components (Text, Button, etc.), provides full type safety.
 * Use module augmentation to register custom component types.
 *
 * @param componentName - The component name to extend
 * @param styles - Callback receiving theme, returns extension styles
 * @returns StyleSheet with merged styles
 *
 * @example
 * ```typescript
 * extendStyle('Text', (theme) => ({
 *   text: {
 *     padding: 10,
 *   },
 * }));
 * ```
 */
export function extendStyle<
  K extends keyof ComponentStyleRegistry | string,
  TTheme = any
>(
  componentName: K,
  styles: (theme: TTheme) => K extends keyof ComponentStyleRegistry
    ? ExtendStyleDef<K>
    : Record<string, any>
): ReturnType<typeof StyleSheet.create> {
  // This function is replaced by Babel with __extendStyle
  // Runtime fallback for non-transformed code
  return __extendStyle(componentName as string, styles as any);
}

/**
 * Override component styles completely (app-level).
 *
 * Use this in consumer apps to COMPLETELY REPLACE library component styles.
 * This takes priority over library defineStyle calls regardless of import order.
 *
 * For registered components (Text, Button, etc.), provides full type safety.
 * The override must match the same API as the base styles.
 *
 * @param componentName - The component name to override
 * @param styles - Callback receiving theme, returns complete replacement styles
 * @returns StyleSheet with override styles
 *
 * @example
 * ```typescript
 * overrideStyle('Text', (theme) => ({
 *   text: ({ color }) => ({
 *     color: theme.colors.text[color ?? 'primary'],
 *     fontSize: 16,
 *   }),
 * }));
 * ```
 */
export function overrideStyle<
  K extends keyof ComponentStyleRegistry | string,
  TTheme = any
>(
  componentName: K,
  styles: (theme: TTheme) => K extends keyof ComponentStyleRegistry
    ? OverrideStyleDef<K>
    : Record<string, any>
): ReturnType<typeof StyleSheet.create> {
  // This function is replaced by Babel with __overrideStyle
  // Runtime fallback for non-transformed code
  return __overrideStyle(componentName as string, styles as any);
}

/**
 * Re-export ThemeStyleWrapper for convenience
 */
export type { ThemeStyleWrapper } from './extensions';
