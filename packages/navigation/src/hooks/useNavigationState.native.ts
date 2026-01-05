import { useRoute } from '@react-navigation/native';

export interface UseNavigationStateOptions {
    /**
     * Keys to remove from the URL query parameters after reading.
     * This option only affects web - it has no effect on native.
     * Included here for API consistency across platforms.
     */
    consume?: string[];
}

/**
 * Hook to access navigation state passed via the navigate() function.
 * On native, state is passed via route params (merged with path params).
 * Returns the state object passed during navigation, or an empty object if no state was passed.
 *
 * @example
 * // Navigate with state
 * navigate({ path: '/recording', state: { autostart: true } });
 *
 * // Access state in destination screen
 * const { autostart } = useNavigationState<{ autostart?: boolean }>();
 *
 * @example
 * // The consume option is accepted but has no effect on native
 * const { autostart } = useNavigationState<{ autostart?: boolean }>({ consume: ['autostart'] });
 */
export function useNavigationState<T extends Record<string, unknown> = Record<string, unknown>>(
    _options?: UseNavigationStateOptions
): T {
    const route = useRoute();
    const params = route.params as Record<string, unknown> | undefined;
    return (params as T) || ({} as T);
}
