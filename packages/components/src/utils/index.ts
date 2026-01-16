// View/container style variant builders
export {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
  buildContainerStyleVariants,
  buildPaddingStyleVariants,
  buildMarginStyleVariants,
  buildTextSpacingVariants,
} from './buildViewStyleVariants';

// General style helpers
export { deepMerge, isPlainObject } from './styleHelpers';

// Accessibility utilities
export * from './accessibility';

// Cross-platform ref types
export type {
  IdealystElement,
  AnchorElement,
  AnchorRef,
  ComponentElement,
  WebElement,
  NativeElement,
  CrossPlatformElement,
  CrossPlatformRef,
} from './refTypes';
