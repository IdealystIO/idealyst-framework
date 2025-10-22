/**
 * Standardized Type Definitions for @idealyst/theme
 *
 * This file defines the core type system used across all components for consistency.
 * All components should import these types rather than defining their own.
 */

// =============================================================================
// INTENT SYSTEM - For action-oriented components
// =============================================================================

/**
 * Intent variants for actionable components (buttons, inputs, alerts, etc.)
 * These map to semantic meanings with contextual colors (main, on, container, etc.)
 */
export type IntentVariant =
  | 'primary'   // Main brand actions
  | 'success'   // Positive actions (save, confirm)
  | 'error'     // Destructive actions (delete, cancel)
  | 'warning'   // Caution actions
  | 'neutral'   // Secondary/neutral actions
  | 'info';     // Informational actions

// =============================================================================
// SIZE SYSTEM - For component sizing
// =============================================================================

/**
 * Base size values - the complete set of available sizes
 * Component-specific size types should pick from these values
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Component-specific size types (examples - components define their own)
// These show which sizes each component type supports

/**
 * Icon sizes - supports full range for flexibility
 */
export type IconSize = SizeVariant;

/**
 * Button/Input/Chip sizes - standard 3-size range
 */
export type ButtonSize = Extract<SizeVariant, 'sm' | 'md' | 'lg'>;

/**
 * Badge sizes - typically smaller range
 */
export type BadgeSize = Extract<SizeVariant, 'sm' | 'md' | 'lg'>;

// =============================================================================
// COLOR SYSTEM - For display components
// =============================================================================

/**
 * Base color names from the standard color palette
 */
export type BaseColorName =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'amber'
  | 'gray'
  | 'black'
  | 'white';

/**
 * Color shades available in each palette
 */
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Color variant with optional shade (e.g., 'blue' or 'blue.500')
 */
export type ColorVariant = BaseColorName | `${BaseColorName}.${ColorShade}`;

/**
 * Palette color variant - alias for ColorVariant
 */
export type PaletteColor = ColorVariant;

// =============================================================================
// SEMANTIC COLOR VARIANTS
// =============================================================================

/**
 * Text color variants for text elements
 */
export type TextColorVariant =
  | 'primary'             // Main text color (dark on light, light on dark)
  | 'secondary'           // Secondary text color
  | 'tertiary'            // Tertiary text color
  | 'inverse'             // Inverse of primary (light on light, dark on dark)
  | 'inverse-secondary'   // Inverse of secondary
  | 'inverse-tertiary'    // Inverse of tertiary
  | 'disabled'            // Disabled state color
  | 'muted'               // Muted/subdued color
  | 'placeholder';        // Placeholder text color

/**
 * Semantic color variants for text and display elements (deprecated, use TextColorVariant)
 * @deprecated Use TextColorVariant instead
 */
export type SemanticColorVariant =
  | 'primary'      // Main text/content color
  | 'secondary'    // Secondary text/content color
  | 'disabled'     // Disabled state color
  | 'inverse'      // Inverse/contrast color
  | 'muted'        // Muted/subdued color
  | 'placeholder'; // Placeholder text color

/**
 * Background color variants for surfaces
 */
export type BackgroundVariant =
  | 'transparent'         // Transparent background
  | 'primary'             // Main background (white on light, dark on dark)
  | 'secondary'           // Secondary background (off-white/gray on light)
  | 'tertiary'            // Tertiary background
  | 'elevated'            // Elevated surface (with shadow)
  | 'overlay'             // Overlay/modal background
  | 'inverse'             // Inverse of primary (dark on light, light on dark)
  | 'inverse-secondary'   // Inverse of secondary
  | 'inverse-tertiary';   // Inverse of tertiary

/**
 * Border color variants
 */
export type BorderVariant =
  | 'primary'      // Main border
  | 'secondary'    // Secondary border
  | 'focus'        // Focus state border
  | 'error'        // Error state border
  | 'disabled';    // Disabled state border

/**
 * Combined color variant including palette and text colors
 */
export type DisplayColorVariant = ColorVariant | TextColorVariant;

// =============================================================================
// SPACING SYSTEM
// =============================================================================

/**
 * Spacing variants matching theme.spacing keys
 */
export type SpacingVariant = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// =============================================================================
// BORDER RADIUS SYSTEM
// =============================================================================

/**
 * Border radius variants matching theme.borderRadius keys
 */
export type RadiusVariant = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';

// =============================================================================
// COMPONENT VARIANT SYSTEMS
// =============================================================================

/**
 * Common button/interactive component variants
 */
export type InteractiveVariant =
  | 'contained'    // Filled background
  | 'outlined'     // Border only
  | 'text'         // No background or border
  | 'ghost';       // Subtle background on hover

/**
 * Common padding/size presets
 */
export type PaddingVariant = 'none' | 'sm' | 'md' | 'lg';

// =============================================================================
// TEXT/TYPOGRAPHY VARIANTS
// =============================================================================

/**
 * Font weight variants matching theme.typography.fontWeight
 */
export type FontWeightVariant =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

/**
 * Text alignment options
 */
export type TextAlignVariant = 'left' | 'center' | 'right' | 'justify';

/**
 * Line height variants matching theme.typography.lineHeight
 */
export type LineHeightVariant = 'tight' | 'normal' | 'relaxed';

// =============================================================================
// HELPER TYPES
// =============================================================================

/**
 * Intent mapping structure
 */
export type IntentMapping = {
  palette: ColorVariant;
  main: ColorShade;
  on: string;
  container: ColorShade;
  onContainer: ColorShade;
  light: ColorShade;
  dark: ColorShade;
  border: ColorShade;
};

/**
 * Responsive breakpoint names
 */
export type BreakpointVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Re-export all types for convenience
 */
export type {
  IntentVariant as Intent,
  SizeVariant as Size,
  ColorVariant as Color,
  ColorShade as Shade,
  BackgroundVariant as Background,
  TextColorVariant as TextColor,
  SemanticColorVariant as SemanticColor,
  SpacingVariant as Spacing,
  RadiusVariant as Radius,
  InteractiveVariant as Interactive,
  FontWeightVariant as FontWeight,
  TextAlignVariant as TextAlign,
};
