import type { StyleProp } from 'react-native';

/**
 * Flattens a style prop (which can be a single style, an array of styles,
 * or nested arrays) into a single style object.
 */
export function flattenStyle<T extends object>(
  style: StyleProp<T> | React.CSSProperties | undefined
): React.CSSProperties {
  if (!style) {
    return {};
  }

  if (Array.isArray(style)) {
    return style.reduce<React.CSSProperties>((acc, s) => {
      return { ...acc, ...flattenStyle(s as StyleProp<T>) };
    }, {});
  }

  return style as React.CSSProperties;
}
