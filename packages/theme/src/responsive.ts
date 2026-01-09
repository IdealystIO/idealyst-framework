import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Breakpoint, BreakpointsRecord } from './theme/breakpoint';

/**
 * Makes a value responsive - can be either a direct value or
 * an object mapping breakpoint names to values.
 *
 * @example
 * ```typescript
 * // Direct value
 * const size: Responsive<Size> = 'md';
 *
 * // Responsive value
 * const size: Responsive<Size> = { xs: 'sm', md: 'lg' };
 * ```
 */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Type guard to check if a value is a responsive object (breakpoint map).
 *
 * @param value - The value to check
 * @returns True if the value is an object with breakpoint keys
 *
 * @example
 * ```typescript
 * const size: Responsive<Size> = { xs: 'sm', md: 'lg' };
 *
 * if (isResponsiveValue(size)) {
 *   // size is Partial<Record<Breakpoint, Size>>
 *   console.log(size.xs); // 'sm'
 * } else {
 *   // size is Size
 *   console.log(size); // 'md'
 * }
 * ```
 */
export function isResponsiveValue<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !('$$typeof' in value) // Not a React element
    );
}

/**
 * Style object where each property can be a responsive value.
 */
export type ResponsiveStyle = {
    [K in keyof ViewStyle]?: Responsive<ViewStyle[K]>;
} & {
    [K in keyof TextStyle]?: Responsive<TextStyle[K]>;
} & {
    [K in keyof ImageStyle]?: Responsive<ImageStyle[K]>;
};

/**
 * Resolve a single responsive value to its current breakpoint value.
 * Uses CSS cascade behavior - falls back to the nearest smaller breakpoint.
 */
function resolveValue<T>(
    value: Responsive<T>,
    screenWidth: number,
    breakpoints: BreakpointsRecord,
    sortedBps: Breakpoint[]
): T | undefined {
    if (!isResponsiveValue(value)) {
        return value;
    }

    // Find the largest breakpoint that matches current screen width
    // and has a defined value (CSS cascade behavior)
    for (const bp of sortedBps) {
        if (screenWidth >= breakpoints[bp] && value[bp] !== undefined) {
            return value[bp];
        }
    }

    return undefined;
}

/**
 * Resolve a responsive style object to concrete style values based on current breakpoint.
 *
 * This is a non-hook version for use outside of React components.
 *
 * @param style - Style object with responsive values
 * @returns Resolved style object for the current breakpoint
 *
 * @example
 * ```typescript
 * const style = resolveResponsiveStyle({
 *   flexDirection: { xs: 'column', md: 'row' },
 *   padding: { xs: 8, lg: 16 },
 *   backgroundColor: '#fff', // Non-responsive values pass through
 * });
 * // On tablet: { flexDirection: 'row', padding: 8, backgroundColor: '#fff' }
 * ```
 */
export function resolveResponsiveStyle(style: ResponsiveStyle): ViewStyle & TextStyle & ImageStyle {
    const breakpoints = UnistylesRuntime.breakpoints as BreakpointsRecord;
    const screenWidth = UnistylesRuntime.screen.width;

    // Sort breakpoints by value descending for cascade lookup
    const sortedBps = Object.entries(breakpoints)
        .sort(([, a], [, b]) => b - a)
        .map(([name]) => name as Breakpoint);

    const resolved: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(style)) {
        if (value === undefined) continue;

        const resolvedValue = resolveValue(value, screenWidth, breakpoints, sortedBps);
        if (resolvedValue !== undefined) {
            resolved[key] = resolvedValue;
        }
    }

    return resolved as ViewStyle & TextStyle & ImageStyle;
}
