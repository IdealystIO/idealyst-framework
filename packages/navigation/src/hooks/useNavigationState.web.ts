import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from '../router';

export interface UseNavigationStateOptions {
    /**
     * Keys to remove from the URL query parameters after reading.
     * This is useful for one-time state like 'autostart' that shouldn't persist in the URL.
     * Only affects web - has no effect on native.
     *
     * @example
     * // URL: /recording?autostart=true
     * const { autostart } = useNavigationState<{ autostart?: boolean }>({ consume: ['autostart'] });
     * // autostart = true, URL becomes: /recording
     */
    consume?: string[];
}

/**
 * Hook to access and update navigation state.
 * On web, state is stored as URL query parameters.
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
 * // Update params in-place (no navigation, replaces history entry)
 * setState({ sort: 'desc' });
 *
 * @example
 * // Consume (remove) a parameter after reading
 * const [state] = useNavigationState<{ autostart?: boolean }>({ consume: ['autostart'] });
 * // state.autostart = true, URL becomes: /recording (param removed)
 */
function parseSearchParams(searchParams: URLSearchParams): Record<string, unknown> {
    const state: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
        if (value === 'true') {
            state[key] = true;
        } else if (value === 'false') {
            state[key] = false;
        } else if (!isNaN(Number(value)) && value !== '') {
            state[key] = Number(value);
        } else {
            state[key] = value;
        }
    });
    return state;
}

export function useNavigationState<T extends Record<string, unknown> = Record<string, unknown>>(
    options?: UseNavigationStateOptions
): [T, (updates: Partial<T>) => void] {
    const [searchParams, setSearchParams] = useSearchParams();
    const consumedStateRef = useRef<Record<string, unknown> | null>(null);
    const hasConsumed = useRef(false);

    // Capture consumed values before they're removed from URL
    if (options?.consume && options.consume.length > 0 && !hasConsumed.current) {
        const keysToConsume = options.consume.filter(key => searchParams.has(key));
        if (keysToConsume.length > 0 && consumedStateRef.current === null) {
            consumedStateRef.current = parseSearchParams(searchParams);
        }
    }

    // Remove consumed keys from URL after initial read
    useEffect(() => {
        if (options?.consume && options.consume.length > 0 && !hasConsumed.current) {
            const keysToRemove = options.consume.filter(key => searchParams.has(key));
            if (keysToRemove.length > 0) {
                hasConsumed.current = true;
                const newParams = new URLSearchParams(searchParams);
                keysToRemove.forEach(key => newParams.delete(key));
                setSearchParams(newParams, { replace: true });
            }
        }
    }, [options?.consume, searchParams, setSearchParams]);

    const setState = useCallback((updates: Partial<T>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            for (const [key, value] of Object.entries(updates)) {
                if (value === undefined || value === null) {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            }
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    // Return captured state if we consumed params, otherwise parse current URL
    const state = consumedStateRef.current !== null
        ? consumedStateRef.current as T
        : parseSearchParams(searchParams) as T;

    return [state, setState];
}
