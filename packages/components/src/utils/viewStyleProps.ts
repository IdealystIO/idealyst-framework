import { Size } from '@idealyst/theme';

/**
 * Size variant type for view style props.
 * undefined = no variant applied (inherits default or no style)
 */
export type ViewStyleSize = Size;

/**
 * Base props shared by all components
 */
export interface BaseProps {
  /** Unique identifier for the element (maps to id on web, nativeID on native) */
  id?: string;
}

/**
 * Gap style props - for controlling gap/spacing between children
 */
export interface GapStyleProps {
  /** Gap between children (uses theme.sizes.view[size].spacing) */
  gap?: ViewStyleSize;
  /** Alias for gap - spacing between children */
  spacing?: ViewStyleSize;
}

/**
 * Padding style props - for controlling internal spacing
 */
export interface PaddingStyleProps {
  /** Padding on all sides (uses theme.sizes.view[size].padding) */
  padding?: ViewStyleSize;
  /** Vertical padding (top + bottom) */
  paddingVertical?: ViewStyleSize;
  /** Horizontal padding (left + right) */
  paddingHorizontal?: ViewStyleSize;
}

/**
 * Margin style props - for controlling external spacing
 */
export interface MarginStyleProps {
  /** Margin on all sides (uses theme.sizes.view[size].spacing) */
  margin?: ViewStyleSize;
  /** Vertical margin (top + bottom) */
  marginVertical?: ViewStyleSize;
  /** Horizontal margin (left + right) */
  marginHorizontal?: ViewStyleSize;
}

/**
 * Full container style props - includes all spacing options
 * For: View, Card, Screen, List, Accordion, Table, TabBar
 */
export interface ContainerStyleProps extends BaseProps, GapStyleProps, PaddingStyleProps, MarginStyleProps {}

/**
 * Text spacing style props - gap + padding only
 * For: Text (gap for inline elements, padding for block-level)
 */
export interface TextSpacingStyleProps extends BaseProps, GapStyleProps, PaddingStyleProps {}

/**
 * Pressable style props - padding only
 * For: Pressable
 */
export interface PressableSpacingStyleProps extends BaseProps, PaddingStyleProps {}

/**
 * Form input style props - margin only
 * For: Input, Select, TextArea, Checkbox, RadioButton, Switch, Slider
 */
export interface FormInputStyleProps extends BaseProps, MarginStyleProps {}
