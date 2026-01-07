/**
 * StyleBuilder - Declarative styling system with extension support
 *
 * This module provides the API for defining and extending component styles.
 * - defineStyle: Define base styles for a component (used by library)
 * - extendStyle: Extend/override styles (used by consumer apps)
 *
 * The Babel plugin transforms these calls to:
 * 1. Expand $iterator patterns (theme.$intents, theme.sizes.$button, etc.)
 * 2. Register styles with the runtime registry for merging
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
import { createRegisteredStyle } from './styleRegistry';

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
 * The Babel plugin transforms this to:
 * 1. Expand $iterator patterns
 * 2. Register with the style registry
 * 3. Return a StyleSheet
 *
 * @param componentName - The component name (e.g., 'Button', 'Text')
 * @param styles - Callback receiving theme, returns style definitions
 * @returns StyleSheet with the defined styles
 *
 * @example
 * ```typescript
 * export const buttonStyles = defineStyle('Button', (theme) => ({
 *   button: {
 *     backgroundColor: theme.colors.surface.primary,
 *     variants: {
 *       intent: {
 *         backgroundColor: theme.$intents.primary,
 *       },
 *     },
 *   },
 * }));
 * ```
 */
export function defineStyle<TTheme, TStyles>(
  componentName: ComponentName,
  styles: StyleCallback<TTheme, TStyles>
): ReturnType<typeof StyleSheet.create> {
  // Runtime: register base styles and create stylesheet
  // Babel transforms the styles callback before this runs
  return createRegisteredStyle(componentName, styles as any, false);
}

/**
 * Extend existing component styles.
 *
 * Use this in consumer apps to override or add to library component styles.
 * Extensions are deep-merged with base styles at runtime.
 *
 * - Override values by specifying the same path
 * - Add new variants by adding new keys
 * - Multiple extensions are merged in order
 *
 * @param componentName - The component name to extend
 * @param styles - Callback receiving theme, returns extension styles
 * @returns StyleSheet with merged styles
 *
 * @example
 * ```typescript
 * // Override border radius and add a custom variant
 * extendStyle('Button', (theme) => ({
 *   button: {
 *     borderRadius: theme.radii.lg, // Override base
 *     variants: {
 *       brand: { // Add new variant value
 *         backgroundColor: theme.colors.brand.primary,
 *       },
 *     },
 *   },
 * }));
 * ```
 */
export function extendStyle<TTheme, TStyles>(
  componentName: ComponentName | string,
  styles: StyleCallback<TTheme, TStyles>
): ReturnType<typeof StyleSheet.create> {
  // Runtime: register extension and create merged stylesheet
  // Babel transforms the styles callback before this runs
  return createRegisteredStyle(componentName as ComponentName, styles as any, true);
}

/**
 * Re-export ThemeStyleWrapper for convenience
 */
export type { ThemeStyleWrapper } from './extensions';
