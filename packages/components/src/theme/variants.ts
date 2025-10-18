/**
 * Theme Variant Types
 *
 * Re-exports standardized types from @idealyst/theme package.
 * This file maintains backward compatibility while centralizing type definitions.
 *
 * @deprecated Import types directly from @idealyst/theme instead
 */

// Re-export all standardized types from the theme package
export type {
  IntentVariant,
  SizeVariant,
  IconSize,
  ButtonSize,
  BadgeSize,
  ColorVariant,
  PaletteColor,
  SemanticColorVariant,
  BackgroundVariant,
  BorderVariant,
  DisplayColorVariant,
  SpacingVariant,
  RadiusVariant,
  InteractiveVariant,
  PaddingVariant,
  FontWeightVariant,
  TextAlignVariant,
  LineHeightVariant,
  IntentMapping,
  BreakpointVariant,
  // Convenient aliases
  Intent,
  Size,
  Color,
  Background,
  SemanticColor,
  Spacing,
  Radius,
  Interactive,
  FontWeight,
  TextAlign,
} from '@idealyst/theme';

// Legacy type aliases for backward compatibility
import type { ColorShade } from '@idealyst/theme';
export type ColorPaletteShade = ColorShade; 