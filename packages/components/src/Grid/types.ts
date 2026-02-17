import { Size } from '@idealyst/theme';
import type { Breakpoint } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import type { LayoutChangeEvent } from '../hooks/useWebLayout';

export type { LayoutChangeEvent };

/**
 * Responsive column count - either a fixed number or a breakpoint map.
 *
 * @example
 * ```tsx
 * // Fixed columns
 * <Grid columns={3} />
 *
 * // Responsive columns
 * <Grid columns={{ xs: 1, sm: 2, lg: 4 }} />
 * ```
 */
export type ResponsiveColumns = number | Partial<Record<Breakpoint, number>>;

/**
 * Gap size between grid items. Uses theme spacing values.
 */
export type GridGap = Size;

/**
 * Cross-platform grid layout component.
 *
 * Arranges children into columns with consistent gap spacing.
 * Supports responsive column counts that adapt to screen size.
 *
 * - **Web**: Uses CSS Grid for optimal layout performance.
 * - **Native**: Uses percentage-based widths with flexbox wrapping.
 *
 * @example
 * ```tsx
 * <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 *   <Card>Item 4</Card>
 * </Grid>
 * ```
 */
export interface GridProps extends ContainerStyleProps {
  /** Grid content - each direct child becomes a grid item */
  children?: ReactNode;

  /**
   * Number of columns. Can be a fixed number or responsive breakpoint map.
   * @default 1
   */
  columns?: ResponsiveColumns;

  /**
   * Gap between grid items (both rows and columns).
   * Uses theme spacing values (theme.sizes.view[size].spacing).
   * @default 'md'
   */
  gap?: GridGap;

  /** Additional styles applied to the grid container */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Called when the grid's layout changes */
  onLayout?: (event: LayoutChangeEvent) => void;
}
