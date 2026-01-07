import React, { createContext, memo, useContext, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from '../router';
import { NavigateParams, NavigatorProviderProps, NavigatorContextValue } from './types';
import { buildNavigator, NavigatorParam } from '../routing';

const NavigatorContext = createContext<NavigatorContextValue>({
    navigate: () => {},
    replace: () => {},
    route: undefined,
    canGoBack: () => false,
    goBack: () => {},
});

/**
 * Normalize a path and substitute variables
 */
function normalizePath(path: string, vars?: Record<string, string>): string {
    let normalizedPath = path;

    // Convert empty string to '/'
    if (normalizedPath === '' || normalizedPath === '/') {
        normalizedPath = '/';
    } else if (!normalizedPath.startsWith('/')) {
        normalizedPath = `/${normalizedPath}`;
    }

    // Substitute variables in the path if provided
    if (vars) {
        Object.entries(vars).forEach(([key, value]) => {
            normalizedPath = normalizedPath.replace(`:${key}`, value);
        });
    }

    return normalizedPath;
}

/**
 * Build a list of valid route patterns from the route tree
 */
function buildValidPatterns(route: NavigatorParam, prefix = ''): string[] {
    const patterns: string[] = [];

    if (!route.routes) return patterns;

    for (const childRoute of route.routes) {
        const childPath = childRoute.path.startsWith('/')
            ? childRoute.path
            : `${prefix}/${childRoute.path}`.replace(/\/+/g, '/');

        // Add the pattern (keeping :param placeholders)
        if (childPath) {
            patterns.push(childPath === '' ? '/' : childPath);
        }

        // Recursively add nested routes
        if (childRoute.type === 'navigator') {
            patterns.push(...buildValidPatterns(childRoute as NavigatorParam, childPath));
        }
    }

    // Also add the root pattern
    if (prefix === '' || prefix === '/') {
        patterns.push('/');
    }

    return patterns;
}

/**
 * Check if a path matches any of the valid route patterns
 */
function isValidRoute(path: string, patterns: string[]): boolean {
    const pathSegments = path.split('/').filter(Boolean);

    for (const pattern of patterns) {
        const patternSegments = pattern.split('/').filter(Boolean);

        // Check for root path match
        if (path === '/' && (pattern === '/' || pattern === '')) {
            return true;
        }

        // Length must match
        if (pathSegments.length !== patternSegments.length) {
            continue;
        }

        let isMatch = true;
        for (let i = 0; i < patternSegments.length; i++) {
            const patternSeg = patternSegments[i];
            const pathSeg = pathSegments[i];

            // Parameter segments match anything
            if (patternSeg.startsWith(':')) {
                continue;
            }

            // Literal segments must match exactly
            if (patternSeg !== pathSeg) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            return true;
        }
    }

    return false;
}

/**
 * Find the nearest invalid route handler by matching path prefixes and bubbling up.
 * Returns the handler from the deepest matching navigator, or undefined if none found.
 */
function findInvalidRouteHandler(
    route: NavigatorParam,
    invalidPath: string
): ((path: string) => NavigateParams | undefined) | undefined {
    const pathSegments = invalidPath.split('/').filter(Boolean);

    // Recursively search for handlers, collecting them from root to deepest match
    function collectHandlers(
        currentRoute: NavigatorParam,
        segmentIndex: number,
        prefix: string
    ): Array<(path: string) => NavigateParams | undefined> {
        const handlers: Array<(path: string) => NavigateParams | undefined> = [];

        // Add this navigator's handler if it exists
        if (currentRoute.onInvalidRoute) {
            handlers.push(currentRoute.onInvalidRoute);
        }

        // Check if any child route matches the next segments
        if (currentRoute.routes && segmentIndex < pathSegments.length) {
            for (const childRoute of currentRoute.routes) {
                if (childRoute.type !== 'navigator') continue;

                const childSegments = childRoute.path.split('/').filter(Boolean);

                // Check if child path matches the next path segments
                let matches = true;
                for (let i = 0; i < childSegments.length && segmentIndex + i < pathSegments.length; i++) {
                    const childSeg = childSegments[i];
                    const pathSeg = pathSegments[segmentIndex + i];

                    if (!childSeg.startsWith(':') && childSeg !== pathSeg) {
                        matches = false;
                        break;
                    }
                }

                if (matches && childSegments.length > 0) {
                    // Recurse into matching child navigator
                    const childPrefix = `${prefix}/${childRoute.path}`.replace(/\/+/g, '/');
                    const childHandlers = collectHandlers(
                        childRoute as NavigatorParam,
                        segmentIndex + childSegments.length,
                        childPrefix
                    );
                    handlers.push(...childHandlers);
                }
            }
        }

        return handlers;
    }

    const handlers = collectHandlers(route, 0, '');

    // Return the deepest handler (last in the array)
    return handlers.length > 0 ? handlers[handlers.length - 1] : undefined;
}

/**
 * Get the parent path from a given path.
 * e.g., "/users/123/edit" -> "/users/123"
 *       "/users" -> "/"
 *       "/" -> null (no parent)
 */
function getParentPath(path: string): string | null {
    const normalizedPath = path === '' ? '/' : path;

    if (normalizedPath === '/') {
        return null;
    }

    const segments = normalizedPath.split('/').filter(Boolean);

    if (segments.length === 0) {
        return null;
    }

    if (segments.length === 1) {
        return '/';
    }

    return '/' + segments.slice(0, -1).join('/');
}

export const NavigatorProvider = ({
    route,
}: NavigatorProviderProps) => {
    const reactRouterNavigate = useNavigate();
    const location = useLocation();

    // Memoize the list of valid route patterns
    const validPatterns = useMemo(() => buildValidPatterns(route), [route]);

    const navigateFunction = (params: NavigateParams, _redirectCount = 0) => {
        // Prevent infinite redirect loops
        if (_redirectCount > 10) {
            console.error('Navigation: Maximum redirect count exceeded. Check onInvalidRoute handlers.');
            return;
        }

        if (params.path) {
            const path = normalizePath(params.path, params.vars);

            // Check if route is valid
            if (!isValidRoute(path, validPatterns)) {
                // Try to find a handler for the invalid route
                const handler = findInvalidRouteHandler(route, path);
                if (handler) {
                    const redirectParams = handler(path);
                    if (redirectParams) {
                        // Handler returned NavigateParams - redirect
                        return navigateFunction(
                            { ...redirectParams, replace: true },
                            _redirectCount + 1
                        );
                    }
                    // Handler returned undefined - let React Router show 404 via catch-all
                }
                // No handler or handler returned undefined
                // Navigate anyway - React Router's catch-all will show notFoundComponent
                // If no notFoundComponent configured, React Router will render nothing
            }

            // Build URL with query params if state is provided
            let finalPath = path;
            if (params.state && Object.keys(params.state).length > 0) {
                const searchParams = new URLSearchParams();
                for (const [key, value] of Object.entries(params.state)) {
                    if (value !== undefined && value !== null) {
                        searchParams.set(key, String(value));
                    }
                }
                const queryString = searchParams.toString();
                if (queryString) {
                    finalPath = `${path}?${queryString}`;
                }
            }

            // Use React Router's navigate function
            reactRouterNavigate(finalPath, { replace: params.replace });
        }
    };

    const RouteComponent = useMemo(() => {
        // Memoize the router to prevent unnecessary re-renders
        return memo(buildNavigator(route));
    }, [route]);

    const canGoBack = () => {
        const parentPath = getParentPath(location.pathname);
        if (!parentPath) {
            return false;
        }
        return isValidRoute(parentPath, validPatterns);
    };

    const goBack = () => {
        const parentPath = getParentPath(location.pathname);
        if (parentPath && isValidRoute(parentPath, validPatterns)) {
            reactRouterNavigate(parentPath);
        }
    };

    const replace = (params: Omit<NavigateParams, 'replace'>) => {
        // On web, replace just delegates to navigate (no special handling needed)
        navigateFunction(params);
    };

    return (
        <NavigatorContext.Provider value={{
            route,
            navigate: navigateFunction,
            replace,
            canGoBack,
            goBack,
        }}>
            <RouteComponent />
        </NavigatorContext.Provider>
    );
};

export const useNavigator = () => {
    return useContext(NavigatorContext);
}; 