import { RegisteredTheme } from './extensions';

/**
 * All available breakpoint names.
 * Derived from your registered theme's breakpoints.
 *
 * @example
 * ```typescript
 * // With default theme: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * const bp: Breakpoint = 'md';
 * ```
 */
export type Breakpoint = RegisteredTheme['theme'] extends { breakpoints: infer B }
    ? B extends Record<string, number>
        ? keyof B & string
        : never
    : never;

/**
 * Get the breakpoints record type from the theme.
 *
 * @example
 * ```typescript
 * // { xs: number; sm: number; md: number; lg: number; xl: number; }
 * const bps: BreakpointsRecord = theme.breakpoints;
 * ```
 */
export type BreakpointsRecord = RegisteredTheme['theme'] extends { breakpoints: infer B }
    ? B
    : Record<string, number>;
