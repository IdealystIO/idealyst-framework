/**
 * Runtime helper for the idealyst-extensions Babel plugin.
 *
 * This function wraps style creator functions to merge extensions from the theme.
 * It's called by code transformed by the Babel plugin - DO NOT call directly.
 *
 * @example
 * // Babel transforms this:
 * applyExtensions('Button', theme, { button: createButtonStyles(theme) })
 *
 * // Into this:
 * { button: __withExtension('Button', 'button', theme, createButtonStyles(theme)) }
 */

/**
 * Deep merge two objects, with source values taking priority.
 * Handles nested objects recursively.
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
 * Theme type with extensions support.
 */
interface ThemeWithExtensions {
    __extensions?: Record<string, Record<string, any>>;
    [key: string]: any;
}

/**
 * Wrap a style function with extension support.
 *
 * @param component - Component name (e.g., 'View', 'Button')
 * @param element - Style element name (e.g., 'view', 'button', 'text')
 * @param theme - Theme object (may contain __extensions)
 * @param baseStyleFn - Base style creator function
 * @returns Wrapped function that merges extensions
 */
export function __withExtension<TProps, TResult>(
    component: string,
    element: string,
    theme: ThemeWithExtensions,
    baseStyleFn: ((props: TProps) => TResult) | TResult
): ((props: TProps) => TResult) | TResult {
    const ext = theme.__extensions?.[component]?.[element];

    // If no extension, return base as-is
    if (!ext) {
        return baseStyleFn;
    }

    // If baseStyleFn is not a function (static style object), merge directly
    if (typeof baseStyleFn !== 'function') {
        return deepMerge(baseStyleFn as object, ext) as TResult;
    }

    // Cast to function type after the typeof check
    const styleFn = baseStyleFn as (props: TProps) => TResult;

    // Return wrapped function that merges extension at call time
    return ((props: TProps): TResult => {
        const base = styleFn(props);

        // If base is not an object, can't merge
        if (typeof base !== 'object' || base === null) {
            return base;
        }

        return deepMerge(base as object, ext) as TResult;
    }) as (props: TProps) => TResult;
}
