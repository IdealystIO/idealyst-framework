import { UnistylesRuntime } from 'react-native-unistyles';
import { Breakpoint, BreakpointsRecord } from './theme/breakpoint';

/**
 * Get the current active breakpoint name.
 *
 * @returns The current breakpoint name, or undefined if not available
 *
 * @example
 * ```typescript
 * const current = getCurrentBreakpoint();
 * console.log(current); // 'md'
 * ```
 */
export function getCurrentBreakpoint(): Breakpoint | undefined {
    return UnistylesRuntime.breakpoint as Breakpoint | undefined;
}

/**
 * Get all registered breakpoints and their values.
 *
 * @returns Object mapping breakpoint names to pixel values
 *
 * @example
 * ```typescript
 * const breakpoints = getBreakpoints();
 * console.log(breakpoints); // { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }
 * ```
 */
export function getBreakpoints(): BreakpointsRecord {
    return UnistylesRuntime.breakpoints as BreakpointsRecord;
}

/**
 * Check if the current viewport is at or above a specific breakpoint.
 *
 * @param breakpoint - The breakpoint to check against
 * @returns True if the current viewport width is >= the breakpoint value
 *
 * @example
 * ```typescript
 * if (isBreakpointUp('md')) {
 *   // Tablet or larger
 * }
 * ```
 */
export function isBreakpointUp(breakpoint: Breakpoint): boolean {
    const breakpoints = getBreakpoints();
    const screenWidth = UnistylesRuntime.screen.width;
    return screenWidth >= breakpoints[breakpoint];
}

/**
 * Check if the current viewport is below a specific breakpoint.
 *
 * @param breakpoint - The breakpoint to check against
 * @returns True if the current viewport width is < the breakpoint value
 *
 * @example
 * ```typescript
 * if (isBreakpointDown('md')) {
 *   // Mobile only (below tablet)
 * }
 * ```
 */
export function isBreakpointDown(breakpoint: Breakpoint): boolean {
    return !isBreakpointUp(breakpoint);
}

/**
 * Resolve a responsive value to its current breakpoint value.
 * Falls back to the smallest defined breakpoint using CSS cascade behavior.
 *
 * @param value - Either a direct value or an object mapping breakpoints to values
 * @returns The resolved value for the current breakpoint
 *
 * @example
 * ```typescript
 * // On a tablet (md breakpoint):
 * const size = resolveResponsive({ xs: 'sm', md: 'lg' });
 * console.log(size); // 'lg'
 *
 * // On a phone (xs breakpoint):
 * const size = resolveResponsive({ xs: 'sm', md: 'lg' });
 * console.log(size); // 'sm'
 * ```
 */
export function resolveResponsive<T>(value: T | Partial<Record<Breakpoint, T>>): T | undefined {
    // If not an object, return directly
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return value as T;
    }

    const responsiveValue = value as Partial<Record<Breakpoint, T>>;
    const breakpoints = getBreakpoints();
    const screenWidth = UnistylesRuntime.screen.width;

    // Sort breakpoints by value descending
    const sortedBps = Object.entries(breakpoints)
        .sort(([, a], [, b]) => b - a)
        .map(([name]) => name as Breakpoint);

    // Find the largest breakpoint that matches current screen width
    // and has a defined value (CSS cascade behavior)
    for (const bp of sortedBps) {
        if (screenWidth >= breakpoints[bp] && responsiveValue[bp] !== undefined) {
            return responsiveValue[bp];
        }
    }

    return undefined;
}
