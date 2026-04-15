import { useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

export interface UseNavigationStateOptions {
    /**
     * Keys to remove from the URL query parameters after reading.
     * This option only affects web - it has no effect on native.
     * Included here for API consistency across platforms.
     */
    consume?: string[];
}

/**
 * Hook to access and update navigation state.
 * On native, state is stored as route params via React Navigation.
 * Returns a tuple of [state, setState] for reading and updating params in-place.
 *
 * @example
 * // Navigate with state
 * navigate({ path: '/search', state: { q: 'hello', sort: 'asc' } });
 *
 * // Read and update state in destination screen
 * const [state, setState] = useNavigationState<{ q: string; sort: string }>();
 * // state.q === 'hello', state.sort === 'asc'
 *
 * // Update params in-place (no navigation)
 * setState({ sort: 'desc' });
 *
 * @example
 * // The consume option is accepted but has no effect on native
 * const [state] = useNavigationState<{ autostart?: boolean }>({ consume: ['autostart'] });
 */
export function useNavigationState<T extends Record<string, unknown> = Record<string, unknown>>(
    _options?: UseNavigationStateOptions
): [T, (updates: Partial<T>) => void] {
    const route = useRoute();
    const navigation = useNavigation();
    const params = (route.params as T) || ({} as T);

    const setState = useCallback((updates: Partial<T>) => {
        navigation.setParams(updates as any);
    }, [navigation]);

    return [params, setState];
}
