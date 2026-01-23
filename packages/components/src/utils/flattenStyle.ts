import type { StyleProp } from 'react-native';

/**
 * Flattens a style prop (which can be a single style, an array of styles,
 * or nested arrays) into a single style object.
 *
 * This is needed on web because React Native's StyleProp allows arrays,
 * but web components need a flat object for destructuring and spreading.
 */
export function flattenStyle<T extends object>(
  style: StyleProp<T> | React.CSSProperties | undefined
): React.CSSProperties {
  if (!style) {
    return {};
  }

  if (Array.isArray(style)) {
    // Recursively flatten and merge all styles in the array
    return style.reduce<React.CSSProperties>((acc, s) => {
      return { ...acc, ...flattenStyle(s as StyleProp<T>) };
    }, {});
  }

  // Single style object
  return style as React.CSSProperties;
}
