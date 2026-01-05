import { useEffect, useRef } from 'react';
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
 * Hook to access navigation state passed via the navigate() function.
 * On web, state is passed as URL query parameters.
 * Returns the state object passed during navigation, or an empty object if no state was passed.
 *
 * @example
 * // Navigate with state
 * navigate({ path: '/recording', state: { autostart: true } });
 *
 * // Access state in destination screen
 * const { autostart } = useNavigationState<{ autostart?: boolean }>();
 * // URL will be: /recording?autostart=true
 *
 * @example
 * // Consume (remove) the parameter after reading
 * const { autostart } = useNavigationState<{ autostart?: boolean }>({ consume: ['autostart'] });
 * // autostart = true, URL becomes: /recording (param removed)
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
): T {
    const [searchParams, setSearchParams] = useSearchParams();
    const consumedStateRef = useRef<Record<string, unknown> | null>(null);
    const hasConsumed = useRef(false);

    // Capture consumed values before they're removed from URL
    if (options?.consume && options.consume.length > 0 && !hasConsumed.current) {
        const keysToConsume = options.consume.filter(key => searchParams.has(key));
        if (keysToConsume.length > 0 && consumedStateRef.current === null) {
            // Capture the full state including values we're about to consume
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

    // Return captured state if we consumed params, otherwise parse current URL
    if (consumedStateRef.current !== null) {
        return consumedStateRef.current as T;
    }

    return parseSearchParams(searchParams) as T;
}
