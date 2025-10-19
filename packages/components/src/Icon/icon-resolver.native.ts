/**
 * Native stub for icon-resolver.
 * This file should not be used on React Native as we use react-native-vector-icons instead.
 * If you're seeing this file being imported, check your import paths.
 */

/**
 * Stub implementation for React Native.
 * Always returns undefined as this utility is web-only.
 */
export function resolveIconPath(iconName: string): string | undefined {
  if (__DEV__) {
    console.warn(
      `[icon-resolver.native] resolveIconPath("${iconName}") was called on React Native. ` +
      `This is a web-only utility. Use react-native-vector-icons directly instead.`
    );
  }
  return undefined;
}

/**
 * Type guard to check if a value is an icon name string.
 * This implementation works cross-platform.
 */
export function isIconName(icon: any): icon is string {
  return typeof icon === 'string';
}
