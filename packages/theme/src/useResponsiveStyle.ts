import { useState, useEffect, useMemo } from 'react';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Dimensions, Platform } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Breakpoint, BreakpointsRecord } from './theme/breakpoint';
import { isResponsiveValue, Responsive } from './responsive';

/**
 * Style object where each property can be a responsive value.
 */
export type ResponsiveStyleInput = {
    [K in keyof ViewStyle]?: Responsive<ViewStyle[K]>;
} & {
    [K in keyof TextStyle]?: Responsive<TextStyle[K]>;
} & {
    [K in keyof ImageStyle]?: Responsive<ImageStyle[K]>;
};

/**
 * Get current screen width (non-reactive, for internal use)
 */
function getScreenWidth(): number {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.innerWidth;
    }
    return Dimensions.get('window').width;
}

/**
 * Get breakpoints from UnistylesRuntime, falling back to the current theme's
 * breakpoints if the runtime doesn't expose them (Unistyles v3 web).
 */
function getBreakpointsFromRuntime(): BreakpointsRecord {
    const runtimeBps = UnistylesRuntime.breakpoints as BreakpointsRecord;
    if (runtimeBps && Object.keys(runtimeBps).length > 0) {
        return runtimeBps;
    }

    // Fallback: read breakpoints from the active theme
    try {
        const theme = UnistylesRuntime.getTheme();
        if (theme && (theme as any).breakpoints && Object.keys((theme as any).breakpoints).length > 0) {
            return (theme as any).breakpoints as BreakpointsRecord;
        }
    } catch {
        // getTheme may throw if no theme is configured
    }

    return {} as BreakpointsRecord;
}

/**
 * Calculate the current breakpoint from screen width.
 */
function calculateBreakpoint(
    screenWidth: number,
    breakpoints: BreakpointsRecord
): Breakpoint | undefined {
    const sortedBps = Object.entries(breakpoints)
        .sort(([, a], [, b]) => b - a) as [Breakpoint, number][];

    for (const [name, value] of sortedBps) {
        if (screenWidth >= value) {
            return name;
        }
    }
    return undefined;
}

/**
 * Hook that only re-renders when the breakpoint changes, not on every pixel.
 * Returns both the current breakpoint and the screen width.
 */
function useBreakpointChange(): { breakpoint: Breakpoint | undefined; screenWidth: number } {
    const breakpoints = getBreakpointsFromRuntime();

    const [state, setState] = useState(() => {
        const width = getScreenWidth();
        return {
            breakpoint: calculateBreakpoint(width, breakpoints),
            screenWidth: width,
        };
    });

    useEffect(() => {
        const handleResize = () => {
            const newWidth = getScreenWidth();
            const bps = getBreakpointsFromRuntime();
            const newBreakpoint = calculateBreakpoint(newWidth, bps);

            // Only update state if breakpoint changed
            setState(prev => {
                if (prev.breakpoint !== newBreakpoint) {
                    return { breakpoint: newBreakpoint, screenWidth: newWidth };
                }
                return prev;
            });
        };

        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        } else {
            const subscription = Dimensions.addEventListener('change', () => {
                handleResize();
            });
            return () => subscription?.remove();
        }
    }, [breakpoints]);

    return state;
}

/**
 * Hook to get the current screen width with proper reactivity.
 * WARNING: This re-renders on every resize. Use useBreakpoint() if you only
 * need to react to breakpoint changes.
 */
export function useScreenWidth(): number {
    const [width, setWidth] = useState(getScreenWidth);

    useEffect(() => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        } else {
            const subscription = Dimensions.addEventListener('change', ({ window }) => {
                setWidth(window.width);
            });
            return () => subscription?.remove();
        }
    }, []);

    return width;
}

/**
 * Resolve a single responsive value to its current breakpoint value.
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

    for (const bp of sortedBps) {
        if (screenWidth >= breakpoints[bp] && value[bp] !== undefined) {
            return value[bp];
        }
    }

    return undefined;
}

/**
 * Hook to resolve responsive style values based on the current breakpoint.
 *
 * Allows you to pass style objects with responsive values that automatically
 * resolve to the appropriate value for the current screen width.
 *
 * @param style - Style object with responsive values (or factory function)
 * @param deps - Optional dependency array. If not provided, style is only recalculated on breakpoint change.
 *               Pass dependencies if your style object depends on props or state.
 * @returns Resolved style object for the current breakpoint
 *
 * @example
 * ```tsx
 * // Static styles - only updates on breakpoint change
 * function MyComponent() {
 *   const containerStyle = useResponsiveStyle({
 *     flexDirection: { xs: 'column', md: 'row' },
 *     padding: { xs: 8, lg: 16 },
 *     backgroundColor: '#fff',
 *   });
 *
 *   return <View style={containerStyle}>...</View>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic styles - updates when dependencies change
 * function Card({ color, size }) {
 *   const cardStyle = useResponsiveStyle({
 *     padding: { xs: 12, md: 24 },
 *     backgroundColor: color,
 *     width: size,
 *   }, [color, size]);
 *
 *   return <View style={cardStyle}>...</View>;
 * }
 * ```
 */
export function useResponsiveStyle(
    style: ResponsiveStyleInput | (() => ResponsiveStyleInput),
    deps?: React.DependencyList
): ViewStyle & TextStyle & ImageStyle {
    // Only re-render when breakpoint changes, not on every pixel
    const { breakpoint, screenWidth } = useBreakpointChange();
    const breakpoints = getBreakpointsFromRuntime();

    // Sort breakpoints by value descending for cascade lookup
    const sortedBps = useMemo(() =>
        Object.entries(breakpoints)
            .sort(([, a], [, b]) => b - a)
            .map(([name]) => name as Breakpoint),
        [breakpoints]
    );

    // Build the dependency array: breakpoint + user-provided deps (or empty)
    const effectiveDeps = deps
        ? [breakpoint, sortedBps, ...deps]
        : [breakpoint, sortedBps];

    const resolved = useMemo(() => {
        const styleObj = typeof style === 'function' ? style() : style;
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(styleObj)) {
            if (value === undefined) continue;

            const resolvedValue = resolveValue(value, screenWidth, breakpoints, sortedBps);
            if (resolvedValue !== undefined) {
                result[key] = resolvedValue;
            }
        }

        return result as ViewStyle & TextStyle & ImageStyle;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, effectiveDeps);

    return resolved;
}

/**
 * Hook to get the current breakpoint name.
 * Only re-renders when the breakpoint changes, not on every pixel.
 *
 * @returns The current breakpoint name
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const breakpoint = useBreakpoint();
 *
 *   return (
 *     <Text>Current breakpoint: {breakpoint}</Text>
 *   );
 * }
 * ```
 */
export function useBreakpoint(): Breakpoint | undefined {
    const { breakpoint } = useBreakpointChange();
    return breakpoint;
}

/**
 * Hook to check if current viewport is at or above a breakpoint.
 * Only re-renders when the breakpoint changes.
 *
 * @param breakpoint - The breakpoint to check against
 * @returns True if viewport width >= breakpoint value
 *
 * @example
 * ```tsx
 * function Sidebar() {
 *   const isDesktop = useBreakpointUp('lg');
 *
 *   if (!isDesktop) return null;
 *
 *   return <View>Desktop sidebar</View>;
 * }
 * ```
 */
export function useBreakpointUp(targetBreakpoint: Breakpoint): boolean {
    const { screenWidth } = useBreakpointChange();
    const breakpoints = getBreakpointsFromRuntime();
    return screenWidth >= breakpoints[targetBreakpoint];
}

/**
 * Hook to check if current viewport is below a breakpoint.
 * Only re-renders when the breakpoint changes.
 *
 * @param breakpoint - The breakpoint to check against
 * @returns True if viewport width < breakpoint value
 *
 * @example
 * ```tsx
 * function MobileNav() {
 *   const isMobile = useBreakpointDown('md');
 *
 *   if (!isMobile) return null;
 *
 *   return <View>Mobile navigation</View>;
 * }
 * ```
 */
export function useBreakpointDown(targetBreakpoint: Breakpoint): boolean {
    return !useBreakpointUp(targetBreakpoint);
}
