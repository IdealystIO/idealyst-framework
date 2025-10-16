/**
 * Runtime utility for resolving MDI icon names to their SVG paths.
 * This is used when icon names are passed dynamically (e.g., in arrays)
 * and cannot be transformed by the Babel plugin at build time.
 */

import * as mdiIcons from '@mdi/js';

/**
 * Formats an icon name from kebab-case to the MDI export name format.
 * Examples:
 *   "home" -> "mdiHome"
 *   "account-circle" -> "mdiAccountCircle"
 *   "star-outline" -> "mdiStarOutline"
 */
function formatIconName(name: string): string {
  if (!name || typeof name !== 'string') {
    return 'mdiHelpCircle';
  }

  // Remove mdi: prefix if present
  const cleanName = name.startsWith('mdi:') ? name.substring(4) : name;

  // Check if the name contains only valid characters
  if (!/^[a-zA-Z0-9-_]+$/.test(cleanName)) {
    console.warn(
      `[icon-resolver] Invalid icon name "${name}" (contains special characters), using "help-circle" as fallback`
    );
    return 'mdiHelpCircle';
  }

  // Convert kebab-case to PascalCase
  const pascalCase = cleanName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return `mdi${pascalCase}`;
}

/**
 * Resolves an icon name to its SVG path data.
 * Returns undefined if the icon is not found.
 *
 * @param iconName - The icon name in kebab-case (e.g., "home", "account-circle")
 * @returns The SVG path string or undefined if not found
 */
export function resolveIconPath(iconName: string): string | undefined {
  const mdiIconName = formatIconName(iconName);
  const iconPath = (mdiIcons as any)[mdiIconName];

  if (!iconPath) {
    console.warn(
      `[icon-resolver] Icon "${iconName}" (${mdiIconName}) not found in @mdi/js, using help-circle as fallback`
    );
    return (mdiIcons as any).mdiHelpCircle;
  }

  return iconPath;
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
