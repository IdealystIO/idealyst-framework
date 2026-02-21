/**
 * StyleBuilder - Declarative styling system with extension support
 *
 * All transformations happen at BUILD TIME via Babel plugin.
 * These functions are replaced with StyleSheet.create calls.
 *
 * For extensions to work, import your extension file BEFORE components:
 *
 * ```typescript
 * // App.tsx
 * import './style-extensions'; // FIRST
 * import { Text } from '@idealyst/components'; // SECOND
 * ```
 */

import { StyleSheet } from 'react-native-unistyles';
import type { ComponentStyleRegistry, ExtendStyleDef, OverrideStyleDef } from './componentStyles';

export type ComponentName =
  | 'Accordion'
  | 'ActivityIndicator'
  | 'Alert'
  | 'Avatar'
  | 'Badge'
  | 'Breadcrumb'
  | 'Button'
  | 'CameraPreview'
  | 'Card'
  | 'Checkbox'
  | 'Chip'
  | 'DatePickerCalendar'
  | 'DateTimeInput'
  | 'DateTimePicker'
  | 'Dialog'
  | 'Divider'
  | 'DropZone'
  | 'FilePickerButton'
  | 'Form'
  | 'Grid'
  | 'Icon'
  | 'IconButton'
  | 'Image'
  | 'Input'
  | 'Link'
  | 'List'
  | 'Menu'
  | 'MenuItem'
  | 'Popover'
  | 'Pressable'
  | 'Progress'
  | 'RadioButton'
  | 'Screen'
  | 'Select'
  | 'Skeleton'
  | 'Slider'
  | 'SVGImage'
  | 'Switch'
  | 'TabBar'
  | 'Table'
  | 'Text'
  | 'TextArea'
  | 'TextInput'
  | 'TimePicker'
  | 'Tooltip'
  | 'UploadProgress'
  | 'Video'
  | 'View';

export type StyleCallback<TTheme, TStyles> = (theme: TTheme) => TStyles;

/**
 * Permissive variant type that accepts any variant configuration.
 * The actual variant names are determined at build time by Unistyles.
 */
export type PermissiveVariants = Record<string, string | number | boolean | undefined>;

/**
 * Return type for defineStyle that preserves style keys and adds useVariants.
 * Style values are typed as 'any' to allow both static styles and dynamic functions.
 */
export type DefineStyleResult<TStyles> = {
  [K in keyof TStyles]: TStyles[K];
} & {
  /**
   * Apply variant values to the stylesheet.
   * Variant names are inferred from the 'variants' property in style definitions.
   */
  useVariants: (variants: PermissiveVariants) => void;
};

/**
 * Define base styles for a component.
 * Babel transforms this to StyleSheet.create with merged extensions.
 */
export function defineStyle<TTheme, TStyles extends Record<string, unknown>>(
  _componentName: ComponentName,
  styles: StyleCallback<TTheme, TStyles>
): DefineStyleResult<TStyles> {
  // Babel replaces this - runtime fallback for dev
  return StyleSheet.create(styles as any) as DefineStyleResult<TStyles>;
}

/**
 * Extend existing component styles (merged at build time).
 * Import BEFORE components for extensions to apply.
 *
 * Accepts either a plain style object or a theme callback:
 * ```typescript
 * // Plain object (no theme access needed)
 * extendStyle('Text', { text: { fontFamily: 'MyFont' } });
 *
 * // Theme callback (when you need theme tokens)
 * extendStyle('Text', (theme) => ({ text: { color: theme.colors.text.primary } }));
 * ```
 */
export function extendStyle<K extends keyof ComponentStyleRegistry>(
  componentName: K,
  styles: ExtendStyleDef<K> | ((theme: any) => ExtendStyleDef<K>)
): void;
export function extendStyle<K extends string>(
  componentName: K,
  styles: Record<string, any> | ((theme: any) => Record<string, any>)
): void;
export function extendStyle(
  _componentName: string,
  _styles: any
): void {
  // Babel removes this call and merges into defineStyle
}

/**
 * Override component styles completely (replaces base at build time).
 * Import BEFORE components for overrides to apply.
 *
 * Accepts either a plain style object or a theme callback:
 * ```typescript
 * // Plain object
 * overrideStyle('Text', { text: { fontFamily: 'MyFont' } });
 *
 * // Theme callback
 * overrideStyle('Text', (theme) => ({ text: { color: theme.colors.text.primary } }));
 * ```
 */
export function overrideStyle<K extends keyof ComponentStyleRegistry>(
  componentName: K,
  styles: OverrideStyleDef<K> | ((theme: any) => OverrideStyleDef<K>)
): void;
export function overrideStyle<K extends string>(
  componentName: K,
  styles: Record<string, any> | ((theme: any) => Record<string, any>)
): void;
export function overrideStyle(
  _componentName: string,
  _styles: any
): void {
  // Babel removes this call and replaces defineStyle
}

export type { ThemeStyleWrapper } from './extensions';
