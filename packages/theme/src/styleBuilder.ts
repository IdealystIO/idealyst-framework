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
  | 'Card'
  | 'Checkbox'
  | 'Chip'
  | 'DatePickerCalendar'
  | 'DateTimeInput'
  | 'DateTimePicker'
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
  | 'SVGImage'
  | 'Switch'
  | 'TabBar'
  | 'Table'
  | 'Text'
  | 'TextArea'
  | 'TimePicker'
  | 'Tooltip'
  | 'Video'
  | 'View';

export type StyleCallback<TTheme, TStyles> = (theme: TTheme) => TStyles;

/**
 * Define base styles for a component.
 * Babel transforms this to StyleSheet.create with merged extensions.
 */
export function defineStyle<TTheme, TStyles>(
  _componentName: ComponentName,
  styles: StyleCallback<TTheme, TStyles>
): ReturnType<typeof StyleSheet.create> {
  // Babel replaces this - runtime fallback for dev
  return StyleSheet.create(styles as any);
}

/**
 * Extend existing component styles (merged at build time).
 * Import BEFORE components for extensions to apply.
 */
export function extendStyle<K extends keyof ComponentStyleRegistry>(
  componentName: K,
  styles: (theme: any) => ExtendStyleDef<K>
): void;
export function extendStyle<K extends string>(
  componentName: K,
  styles: (theme: any) => Record<string, any>
): void;
export function extendStyle(
  _componentName: string,
  _styles: (theme: any) => any
): void {
  // Babel removes this call and merges into defineStyle
}

/**
 * Override component styles completely (replaces base at build time).
 * Import BEFORE components for overrides to apply.
 */
export function overrideStyle<K extends keyof ComponentStyleRegistry>(
  componentName: K,
  styles: (theme: any) => OverrideStyleDef<K>
): void;
export function overrideStyle<K extends string>(
  componentName: K,
  styles: (theme: any) => Record<string, any>
): void;
export function overrideStyle(
  _componentName: string,
  _styles: (theme: any) => any
): void {
  // Babel removes this call and replaces defineStyle
}

export type { ThemeStyleWrapper } from './extensions';
