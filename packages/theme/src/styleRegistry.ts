/**
 * Style Registry - Runtime merging of defineStyle and extendStyle
 *
 * This module provides a registry for component styles that supports:
 * - Base style definitions from the library (defineStyle)
 * - Extensions/overrides from consumer apps (extendStyle)
 * - Runtime merging with deep merge semantics
 */

import { StyleSheet } from 'react-native-unistyles';

// Type for style callbacks
type StyleCallback<T = any> = (theme: any) => T;

// Registry entry
interface StyleEntry {
    base?: StyleCallback;
    extensions: StyleCallback[];
}

// Global registry
const styleRegistry: Record<string, StyleEntry> = {};

/**
 * Deep merge two objects, with source values taking priority.
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
    const result = { ...target } as T;

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = (target as any)[key];

            if (
                sourceValue !== null &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                targetValue !== null &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue)
            ) {
                (result as any)[key] = deepMerge(targetValue, sourceValue);
            } else if (sourceValue !== undefined) {
                (result as any)[key] = sourceValue;
            }
        }
    }

    return result;
}

/**
 * Register base styles for a component.
 * Called by defineStyle - transformed by Babel plugin.
 *
 * @param componentName - Component name (e.g., 'Button', 'Text')
 * @param styles - Style callback receiving theme
 */
export function registerBaseStyle(componentName: string, styles: StyleCallback): void {
    if (!styleRegistry[componentName]) {
        styleRegistry[componentName] = { extensions: [] };
    }
    styleRegistry[componentName].base = styles;
}

/**
 * Register style extensions for a component.
 * Called by extendStyle - transformed by Babel plugin.
 *
 * @param componentName - Component name to extend
 * @param styles - Extension style callback receiving theme
 */
export function registerExtension(componentName: string, styles: StyleCallback): void {
    if (!styleRegistry[componentName]) {
        styleRegistry[componentName] = { extensions: [] };
    }
    styleRegistry[componentName].extensions.push(styles);
}

/**
 * Get merged styles for a component.
 * Merges base styles with all registered extensions.
 *
 * @param componentName - Component name
 * @returns Merged style callback
 */
export function getMergedStyles(componentName: string): StyleCallback | undefined {
    const entry = styleRegistry[componentName];
    if (!entry?.base) return undefined;

    if (entry.extensions.length === 0) {
        return entry.base;
    }

    // Return a merged callback
    return (theme: any) => {
        let result = entry.base!(theme);

        for (const ext of entry.extensions) {
            const extStyles = ext(theme);
            result = deepMerge(result, extStyles);
        }

        return result;
    };
}

/**
 * Create a stylesheet with extension support.
 * This is what defineStyle and extendStyle ultimately call.
 *
 * @param componentName - Component name for the registry
 * @param styles - Style callback
 * @param isExtension - Whether this is an extension (true) or base (false)
 */
export function createRegisteredStyle(
    componentName: string,
    styles: StyleCallback,
    isExtension: boolean
): ReturnType<typeof StyleSheet.create> {
    if (isExtension) {
        registerExtension(componentName, styles);
    } else {
        registerBaseStyle(componentName, styles);
    }

    // Get merged styles and create stylesheet
    const merged = getMergedStyles(componentName);
    if (!merged) {
        return StyleSheet.create(styles);
    }

    return StyleSheet.create(merged);
}

/**
 * Check if a component has registered extensions.
 */
export function hasExtensions(componentName: string): boolean {
    return (styleRegistry[componentName]?.extensions.length ?? 0) > 0;
}

/**
 * Get list of all registered components.
 */
export function getRegisteredComponents(): string[] {
    return Object.keys(styleRegistry);
}

/**
 * Clear registry (useful for testing).
 */
export function clearRegistry(): void {
    for (const key in styleRegistry) {
        delete styleRegistry[key];
    }
}
