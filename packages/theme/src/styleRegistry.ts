/**
 * Style Registry - Two-phase style system
 *
 * Phase 1 (Build time): Babel expands $iterator patterns
 * Phase 2 (Runtime): Registry merges defineStyle + extendStyle and creates StyleSheet
 *
 * Semantics:
 * - defineStyle('Component', ...) - REPLACES any previously defined base styles
 * - extendStyle('Component', ...) - Applied in order of import/definition
 *
 * Order of operations:
 * 1. Library defineStyle runs (sets base styles)
 * 2. Consumer extendStyle runs (adds to extensions array in import order)
 * 3. On first style access, base + extensions are merged into one StyleSheet
 *
 * Usage:
 * 1. Library uses defineStyle('Component', ...) - registers base
 * 2. Consumer uses extendStyle('Component', ...) - registers extension
 * 3. Consumer imports extensions BEFORE components in app entry
 * 4. Components get merged stylesheets automatically
 */

import { StyleSheet } from 'react-native-unistyles';

// Style callback type
type StyleCallback = (theme: any) => any;

// Registry entry for a component
interface ComponentStyles {
    base?: StyleCallback;
    baseIsOverride?: boolean; // True if set by overrideStyle (app-level, can't be replaced)
    extensions: StyleCallback[];
    stylesheet?: ReturnType<typeof StyleSheet.create>;
    dirty: boolean; // Needs re-creation
}

// Global registry
const registry: Record<string, ComponentStyles> = {};

// Track initialization state
let isInitialized = false;

/**
 * Deep merge two objects, with source values taking priority.
 * Special handling for dynamic styles (functions that return style objects).
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
    const result = { ...target } as T;

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = (target as any)[key];

            // Special case: both are functions (dynamic styles)
            // Wrap to call both and merge their results
            if (typeof targetValue === 'function' && typeof sourceValue === 'function') {
                const baseFn = targetValue;
                const extFn = sourceValue;
                (result as any)[key] = (...args: any[]) => {
                    const baseResult = baseFn(...args);
                    const extResult = extFn(...args);
                    return deepMerge(baseResult, extResult);
                };
            }
            // Special case: target is a function (dynamic style), source is an object
            // Wrap the function to merge extension properties into its result
            else if (
                typeof targetValue === 'function' &&
                sourceValue !== null &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue)
            ) {
                const originalFn = targetValue;
                const extensionObj = sourceValue;
                (result as any)[key] = (...args: any[]) => {
                    const baseResult = originalFn(...args);
                    return deepMerge(baseResult, extensionObj);
                };
            }
            // Both are plain objects - deep merge
            else if (
                sourceValue !== null &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                typeof sourceValue !== 'function' &&
                targetValue !== null &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue) &&
                typeof targetValue !== 'function'
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
 * Merge style callbacks for a component.
 * Returns a new callback that produces merged styles.
 */
function createMergedCallback(entry: ComponentStyles): StyleCallback {
    if (!entry.base) {
        throw new Error('Cannot create merged styles without base');
    }

    if (entry.extensions.length === 0) {
        return entry.base;
    }

    return (theme: any) => {
        // Get base styles
        let result = entry.base!(theme);

        // Merge each extension
        for (const ext of entry.extensions) {
            const extStyles = ext(theme);
            result = deepMerge(result, extStyles);
        }

        return result;
    };
}

/**
 * Get or create the stylesheet for a component.
 * Creates merged stylesheet on first access or when dirty.
 */
function getOrCreateStylesheet(componentName: string): ReturnType<typeof StyleSheet.create> {
    const entry = registry[componentName];

    if (!entry) {
        throw new Error(`No styles registered for component: ${componentName}`);
    }

    if (!entry.base) {
        throw new Error(`No base styles defined for component: ${componentName}. Did you forget to call defineStyle?`);
    }

    // Create or recreate stylesheet if needed
    if (!entry.stylesheet || entry.dirty) {
        const mergedCallback = createMergedCallback(entry);
        entry.stylesheet = StyleSheet.create(mergedCallback);
        entry.dirty = false;
    }

    return entry.stylesheet;
}

/**
 * Register base styles for a component.
 * Called by transformed defineStyle.
 * Will NOT replace if an override has been set (app-level override takes priority).
 *
 * @param componentName - Component name (e.g., 'Button', 'Text')
 * @param styles - Expanded style callback
 * @returns Proxy that lazily creates stylesheet on access
 */
export function __defineStyle(
    componentName: string,
    styles: StyleCallback
): ReturnType<typeof StyleSheet.create> {
    if (!registry[componentName]) {
        registry[componentName] = { extensions: [], dirty: true };
    }

    // Don't replace if an app-level override exists
    if (!registry[componentName].baseIsOverride) {
        registry[componentName].base = styles;
        registry[componentName].dirty = true;
    }

    // Return a proxy that lazily gets the stylesheet
    return new Proxy({} as ReturnType<typeof StyleSheet.create>, {
        get(_, prop) {
            const stylesheet = getOrCreateStylesheet(componentName);
            return (stylesheet as any)[prop];
        },
    });
}

/**
 * Override base styles for a component (app-level).
 * This ALWAYS takes priority over library defineStyle calls.
 * Use this in consumer apps to completely replace component styles.
 *
 * @param componentName - Component name (e.g., 'Button', 'Text')
 * @param styles - Expanded style callback
 * @returns Proxy that lazily creates stylesheet on access
 */
export function __overrideStyle(
    componentName: string,
    styles: StyleCallback
): ReturnType<typeof StyleSheet.create> {
    if (!registry[componentName]) {
        registry[componentName] = { extensions: [], dirty: true };
    }

    registry[componentName].base = styles;
    registry[componentName].baseIsOverride = true;
    registry[componentName].dirty = true;

    // Return a proxy that lazily gets the stylesheet
    return new Proxy({} as ReturnType<typeof StyleSheet.create>, {
        get(_, prop) {
            const stylesheet = getOrCreateStylesheet(componentName);
            return (stylesheet as any)[prop];
        },
    });
}

/**
 * Register style extension for a component.
 * Called by transformed extendStyle.
 *
 * @param componentName - Component name to extend
 * @param styles - Expanded extension callback
 * @returns Proxy that lazily creates merged stylesheet on access
 */
export function __extendStyle(
    componentName: string,
    styles: StyleCallback
): ReturnType<typeof StyleSheet.create> {
    if (!registry[componentName]) {
        registry[componentName] = { extensions: [], dirty: true };
    }

    registry[componentName].extensions.push(styles);
    registry[componentName].dirty = true;

    // Return a proxy that lazily gets the merged stylesheet
    return new Proxy({} as ReturnType<typeof StyleSheet.create>, {
        get(_, prop) {
            const stylesheet = getOrCreateStylesheet(componentName);
            return (stylesheet as any)[prop];
        },
    });
}

/**
 * Initialize the style system.
 * Call this after all extensions are registered but before components render.
 * This pre-creates all stylesheets for better performance.
 */
export function initializeStyles(): void {
    if (isInitialized) return;

    for (const componentName of Object.keys(registry)) {
        if (registry[componentName].base) {
            getOrCreateStylesheet(componentName);
        }
    }

    isInitialized = true;
}

/**
 * Check if a component has extensions registered.
 */
export function hasExtensions(componentName: string): boolean {
    return (registry[componentName]?.extensions.length ?? 0) > 0;
}

/**
 * Get list of registered components.
 */
export function getRegisteredComponents(): string[] {
    return Object.keys(registry);
}

/**
 * Clear registry (for testing).
 */
export function __clearRegistry(): void {
    for (const key of Object.keys(registry)) {
        delete registry[key];
    }
    isInitialized = false;
}

// Re-export for backward compatibility
export { __defineStyle as registerBaseStyle };
export { __extendStyle as registerExtension };
