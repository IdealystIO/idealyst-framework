/**
 * Type declarations for react-native in bundler module resolution mode.
 *
 * When using moduleResolution: "bundler", TypeScript cannot properly resolve
 * react-native's type exports. This file re-exports the commonly used types
 * to make them available for type checking.
 */

declare module 'react-native' {
  // Style types from StyleSheet
  export type {
    StyleProp,
  } from 'react-native/Libraries/StyleSheet/StyleSheet';

  export type {
    ViewStyle,
    TextStyle,
    ImageStyle,
  } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

  // Component prop types
  export type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
  export type { ImageSourcePropType } from 'react-native/Libraries/Image/ImageSource';

  // Event types
  export type {
    NativeSyntheticEvent,
    GestureResponderEvent,
    NativeScrollEvent,
  } from 'react-native/Libraries/Types/CoreEventTypes';

  export type {
    TextInputFocusEventData,
    TextInputChangeEventData,
  } from 'react-native/Libraries/Components/TextInput/TextInput';

  // Utilities
  export { Dimensions } from 'react-native/Libraries/Utilities/Dimensions';
  export { Platform } from 'react-native/Libraries/Utilities/Platform';

  // Accessibility
  export type { AccessibilityRole } from 'react-native/Libraries/Components/View/ViewAccessibility';
}
