/**
 * Runtime utility for resolving MDI icon names to their SVG paths.
 *
 * Icons are looked up from the IconRegistry, which is populated at build time
 * by the Babel plugin. This replaces the previous approach of importing all
 * 7,447 icons from @mdi/js.
 */

import { IconRegistry } from './IconRegistry';

/**
 * Resolves an icon name to its SVG path data from the registry.
 * Returns undefined if the icon is not registered.
 *
 * @param iconName - The icon name in kebab-case (e.g., "home", "account-circle")
 * @returns The SVG path string or undefined if not found
 */
export function resolveIconPath(iconName: string): string | undefined {
  const path = IconRegistry.get(iconName);

  if (!path && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[icon-resolver] Icon "${iconName}" is not registered. ` +
      `Add it to the 'icons' array in your babel config.`
    );
  }

  return path;
}

/**
 * Checks if a given value is an icon name (string) or a React component.
 *
 * @param icon - The icon value to check
 * @returns true if the icon is a string (icon name), false otherwise
 */
export function isIconName(icon: any): icon is string {
  return typeof icon === 'string';
}
