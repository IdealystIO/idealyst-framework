import { Theme } from '@idealyst/theme';
import { UnistylesRuntime } from 'react-native-unistyles';
import {
    ComponentStyleElements,
    ComponentName,
    StyleExtension,
} from './types';
import { deepMergeAll } from '../utils/deepMerge';

/**
 * Registry storing style extensions for each component.
 * Key is the component name, value is an array of extensions (applied in order).
 */
const extensionRegistry = new Map<ComponentName, StyleExtension<any>[]>();

/**
 * Registry storing complete style replacements for each component.
 * When set, the replacement is used instead of base styles + extensions.
 */
const replacementRegistry = new Map<ComponentName, StyleExtension<any>>();

/**
 * Compute all extensions for a given theme.
 * Returns an object with component names as keys and merged element extensions as values.
 */
function computeExtensionsForTheme(theme: Theme): Record<string, Record<string, any>> {
    const result: Record<string, Record<string, any>> = {};

    for (const [component, extensions] of extensionRegistry) {
        if (!extensions || extensions.length === 0) continue;

        // Resolve all extensions (call functions with theme)
        const resolved = extensions.map(ext =>
            typeof ext === 'function' ? ext(theme) : ext
        );

        // Merge all extensions in order (later ones win)
        result[component] = deepMergeAll(...resolved);
    }

    return result;
}

/**
 * Update theme's __extensions to trigger Unistyles reactivity.
 * This is called whenever extensions change.
 */
function syncExtensionsToThemes(): void {
    try {
        // Update both light and dark themes with computed extensions
        UnistylesRuntime.updateTheme('light', (currentTheme) => {
            const extensions = computeExtensionsForTheme(currentTheme);
            return {
                ...currentTheme,
                __extensions: extensions,
            };
        });

        UnistylesRuntime.updateTheme('dark', (currentTheme) => {
            const extensions = computeExtensionsForTheme(currentTheme);
            return {
                ...currentTheme,
                __extensions: extensions,
            };
        });
    } catch (error) {
        // UnistylesRuntime may not be available in all contexts (e.g., SSR)
        // Silently ignore errors - extensions will still work via getExtension
        console.warn('Unable to sync extensions to theme:', error);
    }
}

/**
 * Completely replace the styles of a component.
 *
 * Unlike `extendComponent` which merges with base styles, `replaceStyles`
 * completely overrides the default stylesheet. Extensions are NOT applied
 * when a replacement is set.
 *
 * **Use with caution:** You're responsible for providing all necessary styles,
 * including variant styles, platform-specific styles, and accessibility states.
 *
 * @param component - The component name to replace styles for
 * @param replacement - Complete style replacement, either as an object or a function receiving theme
 *
 * @example Complete replacement with theme access
 * ```typescript
 * import { replaceStyles } from '@idealyst/components';
 *
 * replaceStyles('Button', (theme) => ({
 *   button: {
 *     backgroundColor: theme.colors.surface.primary,
 *     borderRadius: 0,
 *     padding: 16,
 *     variants: {
 *       size: {
 *         sm: { padding: 8 },
 *         md: { padding: 16 },
 *         lg: { padding: 24 },
 *       },
 *     },
 *   },
 *   text: {
 *     color: theme.colors.text.primary,
 *     fontSize: 16,
 *   },
 *   icon: {
 *     width: 20,
 *     height: 20,
 *   },
 *   iconContainer: {
 *     display: 'flex',
 *     alignItems: 'center',
 *   },
 * }));
 * ```
 *
 * @example Clear replacement to restore defaults
 * ```typescript
 * clearReplacement('Button');
 * ```
 */
export function replaceStyles<K extends ComponentName>(
    component: K,
    replacement: StyleExtension<ComponentStyleElements[K]>
): void {
    replacementRegistry.set(component, replacement);
}

/**
 * Get the replacement styles for a component, if set.
 *
 * @param component - The component name
 * @param theme - The current theme (used if replacement is a function)
 * @returns The resolved replacement styles, or undefined if none set
 *
 * @internal
 */
export function getReplacement<K extends ComponentName>(
    component: K,
    theme: Theme
): Partial<ComponentStyleElements[K]> | undefined {
    const replacement = replacementRegistry.get(component);
    if (!replacement) {
        return undefined;
    }
    return typeof replacement === 'function' ? replacement(theme) : replacement;
}

/**
 * Clear the style replacement for a specific component.
 * After clearing, the component will use base styles + extensions again.
 *
 * @param component - The component name to clear replacement for
 *
 * @example
 * ```typescript
 * import { clearReplacement } from '@idealyst/components';
 *
 * clearReplacement('Button');
 * ```
 */
export function clearReplacement<K extends ComponentName>(component: K): void {
    replacementRegistry.delete(component);
}

/**
 * Clear all style replacements.
 *
 * @example
 * ```typescript
 * import { clearAllReplacements } from '@idealyst/components';
 *
 * clearAllReplacements();
 * ```
 */
export function clearAllReplacements(): void {
    replacementRegistry.clear();
}

/**
 * Check if a component has a style replacement set.
 *
 * @param component - The component name to check
 * @returns true if the component has a replacement set
 *
 * @example
 * ```typescript
 * import { hasReplacement } from '@idealyst/components';
 *
 * if (hasReplacement('Button')) {
 *   console.log('Button styles are completely replaced');
 * }
 * ```
 */
export function hasReplacement<K extends ComponentName>(component: K): boolean {
    return replacementRegistry.has(component);
}

/**
 * Globally extend the styles of a component.
 *
 * Extensions affect ALL instances of that component app-wide.
 * Extensions are merged with base styles - extension styles win on conflict.
 *
 * **Precedence rules:**
 * - Extensions override base component styles
 * - Later extensions override earlier extensions
 * - Setting a value to `undefined` removes that style property
 * - Nested objects (like `_web`, `variants`) are deep merged
 *
 * @param component - The component name to extend (e.g., 'Button', 'Card')
 * @param extension - Style overrides, either as an object or a function receiving theme
 *
 * @example Static extension
 * ```typescript
 * import { extendComponent } from '@idealyst/components';
 *
 * extendComponent('Button', {
 *   button: {
 *     borderRadius: 20,
 *     shadowColor: '#000',
 *     shadowOffset: { width: 0, height: 2 },
 *     shadowOpacity: 0.25,
 *     shadowRadius: 4,
 *   },
 *   text: {
 *     textTransform: 'uppercase',
 *     letterSpacing: 1,
 *   },
 * });
 * ```
 *
 * @example Theme-aware extension
 * ```typescript
 * extendComponent('Button', (theme) => ({
 *   button: {
 *     ...theme.shadows.lg,
 *     backgroundColor: theme.colors.surface.secondary,
 *   },
 *   text: {
 *     color: theme.colors.text.primary,
 *   },
 * }));
 * ```
 *
 * @example Multiple extensions (later ones have higher precedence)
 * ```typescript
 * // Base brand styles
 * extendComponent('Button', {
 *   button: { borderRadius: 8 },
 * });
 *
 * // Feature-specific override (wins over base)
 * extendComponent('Button', {
 *   button: { borderRadius: 20 },
 * });
 * // Result: borderRadius is 20
 * ```
 *
 * @example Removing a style property
 * ```typescript
 * extendComponent('Button', {
 *   button: {
 *     shadowColor: undefined,  // Removes shadowColor
 *     shadowOpacity: undefined, // Removes shadowOpacity
 *   },
 * });
 * ```
 *
 * @example Web-specific styles
 * ```typescript
 * extendComponent('Button', {
 *   button: {
 *     _web: {
 *       cursor: 'pointer',
 *       transition: 'all 0.2s ease',
 *       _hover: {
 *         transform: 'scale(1.02)',
 *       },
 *     },
 *   },
 * });
 * ```
 */
// Overload for static object extension
export function extendComponent<K extends ComponentName>(
    component: K,
    extension: Partial<ComponentStyleElements[K]>
): void;
// Overload for theme-aware function extension
export function extendComponent<K extends ComponentName>(
    component: K,
    extension: (theme: Theme) => Partial<ComponentStyleElements[K]>
): void;
// Implementation
export function extendComponent<K extends ComponentName>(
    component: K,
    extension: StyleExtension<ComponentStyleElements[K]>
): void {
    const existing = extensionRegistry.get(component) ?? [];
    existing.push(extension);
    extensionRegistry.set(component, existing);

    // Sync extensions to theme for Unistyles reactivity
    syncExtensionsToThemes();
}

/**
 * Get the resolved extension for a component.
 *
 * This is an internal function used by component stylesheets to retrieve
 * and apply extensions. All registered extensions are merged in order,
 * with later extensions taking precedence.
 *
 * @param component - The component name
 * @param theme - The current theme (used if extension is a function)
 * @returns The resolved merged extension styles, or undefined if none registered
 *
 * @internal
 */
export function getExtension<K extends ComponentName>(
    component: K,
    theme: Theme
): Partial<ComponentStyleElements[K]> | undefined {
    const extensions = extensionRegistry.get(component);

    if (!extensions || extensions.length === 0) {
        return undefined;
    }

    // Resolve all extensions (call functions with theme)
    const resolved = extensions.map(ext =>
        typeof ext === 'function' ? ext(theme) : ext
    );

    // Merge all extensions in order (later ones win)
    return deepMergeAll(...resolved) as Partial<ComponentStyleElements[K]>;
}

/**
 * Clear all extensions for a specific component.
 *
 * @param component - The component name to clear extensions for
 *
 * @example
 * ```typescript
 * import { clearExtension } from '@idealyst/components';
 *
 * // Remove all Button extensions
 * clearExtension('Button');
 * ```
 */
export function clearExtension<K extends ComponentName>(component: K): void {
    extensionRegistry.delete(component);

    // Sync extensions to theme for Unistyles reactivity
    syncExtensionsToThemes();
}

/**
 * Clear all component extensions.
 *
 * @example
 * ```typescript
 * import { clearAllExtensions } from '@idealyst/components';
 *
 * // Remove all component extensions
 * clearAllExtensions();
 * ```
 */
export function clearAllExtensions(): void {
    extensionRegistry.clear();

    // Sync extensions to theme for Unistyles reactivity
    syncExtensionsToThemes();
}

/**
 * Check if a component has any extensions registered.
 *
 * @param component - The component name to check
 * @returns true if the component has at least one extension
 *
 * @example
 * ```typescript
 * import { hasExtension } from '@idealyst/components';
 *
 * if (hasExtension('Button')) {
 *   console.log('Button has custom styles');
 * }
 * ```
 */
export function hasExtension<K extends ComponentName>(component: K): boolean {
    const extensions = extensionRegistry.get(component);
    return extensions !== undefined && extensions.length > 0;
}

/**
 * Get all registered component extensions.
 * Useful for debugging or inspecting what extensions are active.
 *
 * @returns Array of component names that have extensions
 *
 * @example
 * ```typescript
 * import { getExtendedComponents } from '@idealyst/components';
 *
 * const extended = getExtendedComponents();
 * console.log('Extended components:', extended);
 * // ['Button', 'Card', 'Input']
 * ```
 */
export function getExtendedComponents(): ComponentName[] {
    return Array.from(extensionRegistry.keys()).filter(key => {
        const extensions = extensionRegistry.get(key);
        return extensions && extensions.length > 0;
    });
}

/**
 * Get the number of extensions registered for a component.
 * Useful for debugging.
 *
 * @param component - The component name
 * @returns Number of extensions registered
 *
 * @example
 * ```typescript
 * import { getExtensionCount } from '@idealyst/components';
 *
 * console.log('Button extensions:', getExtensionCount('Button'));
 * // 3
 * ```
 */
export function getExtensionCount<K extends ComponentName>(component: K): number {
    return extensionRegistry.get(component)?.length ?? 0;
}
