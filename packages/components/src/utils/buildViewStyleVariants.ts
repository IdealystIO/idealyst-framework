import { Theme, Size, Styles } from '@idealyst/theme';

/**
 * Builds gap variants from theme.sizes.view
 * Uses the 'spacing' value from ViewSizeValue
 */
export function buildGapVariants(theme: Theme): Record<Size, Styles> {
  const variants = {} as Record<Size, Styles>;
  for (const size in theme.sizes.view) {
    variants[size as Size] = {
      gap: theme.sizes.view[size as Size].spacing,
    };
  }
  return variants;
}

/**
 * Builds padding variants from theme.sizes.view
 * Uses the 'padding' value from ViewSizeValue
 */
export function buildPaddingVariants(theme: Theme): Record<Size, Styles> {
  const variants = {} as Record<Size, Styles>;
  for (const size in theme.sizes.view) {
    variants[size as Size] = {
      padding: theme.sizes.view[size as Size].padding,
    };
  }
  return variants;
}

/**
 * Builds paddingVertical variants from theme.sizes.view
 */
export function buildPaddingVerticalVariants(theme: Theme): Record<Size, Styles> {
  const variants = {} as Record<Size, Styles>;
  for (const size in theme.sizes.view) {
    variants[size as Size] = {
      paddingVertical: theme.sizes.view[size as Size].padding,
    };
  }
  return variants;
}

/**
 * Builds paddingHorizontal variants from theme.sizes.view
 */
export function buildPaddingHorizontalVariants(theme: Theme): Record<Size, Styles> {
  const variants = {} as Record<Size, Styles>;
  for (const size in theme.sizes.view) {
    variants[size as Size] = {
      paddingHorizontal: theme.sizes.view[size as Size].padding,
    };
  }
  return variants;
}

/**
 * Builds margin variants from theme.sizes.view
 * Uses the 'spacing' value from ViewSizeValue (same as gap)
 */
export function buildMarginVariants(theme: Theme): Record<Size, Styles> {
  const variants = {} as Record<Size, Styles>;
  for (const size in theme.sizes.view) {
    variants[size as Size] = {
      margin: theme.sizes.view[size as Size].spacing,
    };
  }
  return variants;
}

/**
 * Builds marginVertical variants from theme.sizes.view
 */
export function buildMarginVerticalVariants(theme: Theme): Record<Size, Styles> {
  const variants = {} as Record<Size, Styles>;
  for (const size in theme.sizes.view) {
    variants[size as Size] = {
      marginVertical: theme.sizes.view[size as Size].spacing,
    };
  }
  return variants;
}

/**
 * Builds marginHorizontal variants from theme.sizes.view
 */
export function buildMarginHorizontalVariants(theme: Theme): Record<Size, Styles> {
  const variants = {} as Record<Size, Styles>;
  for (const size in theme.sizes.view) {
    variants[size as Size] = {
      marginHorizontal: theme.sizes.view[size as Size].spacing,
    };
  }
  return variants;
}

/**
 * Convenience function to build all container style variants at once
 * Returns all gap, padding, and margin variants
 */
export function buildContainerStyleVariants(theme: Theme) {
  return {
    gap: buildGapVariants(theme),
    padding: buildPaddingVariants(theme),
    paddingVertical: buildPaddingVerticalVariants(theme),
    paddingHorizontal: buildPaddingHorizontalVariants(theme),
    margin: buildMarginVariants(theme),
    marginVertical: buildMarginVerticalVariants(theme),
    marginHorizontal: buildMarginHorizontalVariants(theme),
  };
}

/**
 * Convenience function to build padding-only variants
 * For components that only need padding support
 */
export function buildPaddingStyleVariants(theme: Theme) {
  return {
    padding: buildPaddingVariants(theme),
    paddingVertical: buildPaddingVerticalVariants(theme),
    paddingHorizontal: buildPaddingHorizontalVariants(theme),
  };
}

/**
 * Convenience function to build margin-only variants
 * For form input components that only need margin support
 */
export function buildMarginStyleVariants(theme: Theme) {
  return {
    margin: buildMarginVariants(theme),
    marginVertical: buildMarginVerticalVariants(theme),
    marginHorizontal: buildMarginHorizontalVariants(theme),
  };
}

/**
 * Convenience function to build text spacing variants (gap + padding)
 * For Text component
 */
export function buildTextSpacingVariants(theme: Theme) {
  return {
    gap: buildGapVariants(theme),
    padding: buildPaddingVariants(theme),
    paddingVertical: buildPaddingVerticalVariants(theme),
    paddingHorizontal: buildPaddingHorizontalVariants(theme),
  };
}
