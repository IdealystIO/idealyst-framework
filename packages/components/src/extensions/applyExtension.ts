import { deepMerge } from '../utils/deepMerge';
import { Styles, ElementStyle, ComponentName } from './types';
import { getExtension, getReplacement } from './extendComponent';
import { Theme } from '@idealyst/theme';

/**
 * Wrap a dynamic style function to merge with extension styles.
 *
 * All styles in Unistyles must be dynamic functions (not static objects)
 * to avoid Babel transform issues. This utility wraps a style function
 * to automatically merge extension styles when the function is called.
 *
 * @param styleFn - The original dynamic style function
 * @param elementExtension - Extension styles for this element (can be undefined).
 *        Can be either a static styles object or a function (props) => styles
 *        for prop-aware extensions.
 * @returns A new function that returns merged styles
 *
 * @example
 * ```typescript
 * import { withExtension } from '../extensions/applyExtension';
 * import { getExtension } from '../extensions/extendComponent';
 *
 * export const buttonStyles = StyleSheet.create((theme: Theme) => {
 *   const ext = getExtension('Button', theme);
 *
 *   return {
 *     button: withExtension(createButtonStyles(theme), ext?.button),
 *     text: withExtension(createTextStyles(theme), ext?.text),
 *   };
 * });
 * ```
 *
 * @remarks
 * - If no extension is provided, returns the original function unchanged
 * - Extension styles take priority over base styles (deep merged)
 * - Works with any style function signature
 * - If extension is a function, it receives the same props as the base style function
 */
export function withExtension<TProps, TResult extends Styles>(
    styleFn: (props: TProps) => TResult,
    elementExtension: Styles | ((props: TProps) => Styles) | undefined
): (props: TProps) => TResult {
    // If no extension, return original function unchanged
    if (!elementExtension) {
        return styleFn;
    }

    // Return wrapped function that merges extension
    return (props: TProps): TResult => {
        const baseStyles = styleFn(props);
        // If extension is a function, call it with props; otherwise use as-is
        const extStyles = typeof elementExtension === 'function'
            ? elementExtension(props)
            : elementExtension;
        return deepMerge(baseStyles, extStyles) as TResult;
    };
}

/**
 * Wrap a parameterless style function with extension.
 *
 * Use this for style functions that don't take any parameters.
 * This is common for simpler elements like iconContainer.
 *
 * @param styleFn - The original style function (no parameters)
 * @param elementExtension - Extension styles for this element
 * @returns A new function that returns merged styles
 *
 * @example
 * ```typescript
 * const createIconContainerStyles = (theme: Theme) => {
 *   return () => ({
 *     display: 'flex',
 *     flexDirection: 'row',
 *     gap: 4,
 *   });
 * };
 *
 * // In StyleSheet.create:
 * iconContainer: withSimpleExtension(
 *   createIconContainerStyles(theme),
 *   ext?.iconContainer
 * ),
 * ```
 */
export function withSimpleExtension<TResult extends Styles>(
    styleFn: () => TResult,
    elementExtension: Styles | undefined
): () => TResult {
    if (!elementExtension) {
        return styleFn;
    }

    return (): TResult => {
        const baseStyles = styleFn();
        return deepMerge(baseStyles, elementExtension) as TResult;
    };
}

/**
 * Normalize a style value (from replacement) into a dynamic function.
 *
 * Replacements can be either:
 * - A function (props) => styles - used directly
 * - A static styles object - wrapped in a function
 *
 * @param value - The replacement value (function or static object)
 * @param defaultFn - Default function to use if value is undefined
 * @returns The default function (type-safe) - replacement handling is done at runtime
 *
 * @example
 * ```typescript
 * const replacement = getReplacement('Button', theme);
 *
 * // If replacement.button is a function, use it directly
 * // If replacement.button is an object, wrap it in () => replacement.button
 * // If undefined, use createButtonStyles(theme)
 * button: withExtension(
 *   normalizeStyleFn(replacement?.button, createButtonStyles(theme)),
 *   ext?.button
 * ),
 * ```
 */
export function normalizeStyleFn<TProps, TResult>(
    value: unknown,
    defaultFn: (props: TProps) => TResult
): (props: TProps) => TResult {
    if (value === undefined || value === null) {
        return defaultFn;
    }
    if (typeof value === 'function') {
        return value as (props: TProps) => TResult;
    }
    // Static object - wrap in a function that ignores props
    return (() => value) as (props: TProps) => TResult;
}

/**
 * Normalize a simple style value (no props) into a parameterless function.
 *
 * @param value - The replacement value (function or static object)
 * @param defaultFn - Default function to use if value is undefined
 * @returns A parameterless function that returns styles
 */
export function normalizeSimpleStyleFn<TResult>(
    value: unknown,
    defaultFn: () => TResult
): () => TResult {
    if (value === undefined || value === null) {
        return defaultFn;
    }
    if (typeof value === 'function') {
        return value as () => TResult;
    }
    // Static object - wrap in a function
    return (() => value) as () => TResult;
}

/**
 * Apply extensions and replacements to a set of style creators.
 *
 * This is a simplified helper that handles the common pattern of:
 * 1. Getting extensions and replacements for a component
 * 2. Applying normalizeStyleFn for each element
 * 3. Merging extensions on top
 *
 * @param component - The component name
 * @param theme - The current theme
 * @param styleCreators - Object mapping element names to their style creator functions
 * @returns Object with the same keys, but with extensions/replacements applied
 *
 * @example
 * ```typescript
 * export const buttonStyles = StyleSheet.create((theme: Theme) => {
 *     return applyExtensions('Button', theme, {
 *         button: createButtonStyles(theme),
 *         text: createTextStyles(theme),
 *         icon: createIconStyles(theme),
 *     });
 * });
 * ```
 */
export function applyExtensions<
    K extends ComponentName,
    T extends Record<string, ((...args: any[]) => any)>
>(
    component: K,
    theme: Theme,
    styleCreators: T
): T {
    const ext = getExtension(component, theme);
    const replacement = getReplacement(component, theme);

    const result = {} as T;

    for (const key in styleCreators) {
        const creator = styleCreators[key];
        const elementExt = ext?.[key as string as keyof typeof ext] as ElementStyle | undefined;
        const elementReplacement = replacement?.[key as string as keyof typeof replacement];

        // Apply replacement (if any) then extension (if any)
        result[key] = withExtension(
            normalizeStyleFn(elementReplacement, creator),
            elementExt
        ) as T[typeof key];
    }

    return result;
}
