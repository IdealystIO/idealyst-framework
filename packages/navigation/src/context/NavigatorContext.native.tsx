import React, { createContext, memo, useContext, useMemo } from 'react';
import { NavigateParams, NavigatorProviderProps, NavigatorContextValue } from './types';
import { useNavigation, DarkTheme, DefaultTheme, NavigationContainer, CommonActions, StackActions } from '@react-navigation/native';
import { buildNavigator, NavigatorParam, NOT_FOUND_SCREEN_NAME } from '../routing';
import { useUnistyles } from 'react-native-unistyles';

const NavigatorContext = createContext<NavigatorContextValue>(null!);

const DrawerNavigatorContext = createContext<NavigatorContextValue>(null!);

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
 * Check if any navigator in the tree has a notFoundComponent configured
 */
function hasNotFoundComponent(route: NavigatorParam): boolean {
    if (route.notFoundComponent) return true;

    if (route.routes) {
        for (const child of route.routes) {
            if (child.type === 'navigator' && hasNotFoundComponent(child as NavigatorParam)) {
                return true;
            }
        }
    }

    return false;
}

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

// Utility function to parse path with parameters and find matching route
const parseParameterizedPath = (path: string, rootRoute: any): { routeName: string, params: Record<string, string> } | null => {
    // Handle absolute paths like /event/123
    if (path.startsWith('/')) {
        const pathSegments = path.split('/').filter(Boolean);
        
        // Find matching route by checking patterns like /event/:id
        const findMatchingRoute = (routeList: any[], segments: string[], startIndex = 0, pathPrefix = ''): any => {
            for (const route of routeList) {
                const routeSegments = route.path.split('/').filter(Boolean);
                // Clean up path joining to avoid double slashes
                const cleanPath = route.path.startsWith('/') ? route.path.slice(1) : route.path;
                const fullRoutePath = pathPrefix ? `${pathPrefix}/${cleanPath}` : route.path;
                
                // Check if route segments match the path segments at current position
                const remainingSegments = segments.length - startIndex;

                // Check if this route's segments match as a prefix (for nested routes) or exactly
                let prefixMatches = routeSegments.length <= remainingSegments;
                const extractedParams: Record<string, string> = {};

                if (prefixMatches) {
                    for (let i = 0; i < routeSegments.length; i++) {
                        const routeSegment = routeSegments[i];
                        const pathSegment = segments[startIndex + i];

                        if (routeSegment.startsWith(':')) {
                            // Parameter segment - extract value
                            const paramName = routeSegment.slice(1);
                            extractedParams[paramName] = pathSegment;
                        } else if (routeSegment !== pathSegment) {
                            // Literal segment must match exactly
                            prefixMatches = false;
                            break;
                        }
                    }
                }

                // Exact match - route segments consume all remaining path segments
                if (prefixMatches && routeSegments.length === remainingSegments) {
                    return { route, params: extractedParams, fullPath: fullRoutePath };
                }

                // Check nested routes ONLY if this route's path is a prefix of the target path
                if (prefixMatches && route.routes) {
                    const nestedMatch = findMatchingRoute(
                        route.routes,
                        segments,
                        startIndex + routeSegments.length,
                        fullRoutePath
                    );
                    if (nestedMatch) {
                        return nestedMatch;
                    }
                }
            }
            return null;
        };
        
        const match = findMatchingRoute(rootRoute.routes || [], pathSegments);
        if (match) {
            return {
                routeName: match.fullPath,
                params: match.params
            };
        }
    }
    
    return null;
};

const UnwrappedNavigatorProvider = ({ route }: NavigatorProviderProps) => {

    const navigation = useNavigation();

    const navigate = (params: NavigateParams, _redirectCount = 0) => {
        // Prevent infinite redirect loops
        if (_redirectCount > 10) {
            console.error('Navigation: Maximum redirect count exceeded. Check onInvalidRoute handlers.');
            return;
        }

        // Normalize path and substitute variables (e.g., /visit/:id with vars { id: "123" } becomes /visit/123)
        const normalizedPath = normalizePath(params.path, params.vars);

        // Parse parameterized path for mobile
        const parsed = parseParameterizedPath(normalizedPath, route);

        if (!parsed) {
            // Invalid route - try to find a handler
            const handler = findInvalidRouteHandler(route, normalizedPath);
            if (handler) {
                const redirectParams = handler(normalizedPath);
                if (redirectParams) {
                    // Handler returned NavigateParams - redirect
                    return navigate(
                        { ...redirectParams, replace: true },
                        _redirectCount + 1
                    );
                }
                // Handler returned undefined - fall through to 404 screen
            }

            // Navigate to 404 screen if configured
            if (route.notFoundComponent) {
                navigation.navigate(NOT_FOUND_SCREEN_NAME as never, {
                    path: normalizedPath,
                } as never);
                return;
            }

            // No handler and no 404 screen - log warning
            console.warn(`Navigation: Invalid route "${normalizedPath}" and no handler or notFoundComponent configured.`);
            return;
        }

        // Merge route params with navigation state (state values stored directly in params)
        const navigationParams = {
            ...parsed.params,
            ...(params.state || {}),
        };

        if (params.replace) {
            // Use StackActions.replace to replace the current screen in the stack
            navigation.dispatch(
                StackActions.replace(parsed.routeName, navigationParams)
            );
        } else {
            // Navigate to the pattern route with extracted parameters
            navigation.navigate(parsed.routeName as never, navigationParams as never);
        }
    };

    const replace = (params: Omit<NavigateParams, 'replace'>) => {
        // Normalize path and substitute variables
        const normalizedPath = normalizePath(params.path, params.vars);

        // Parse parameterized path for mobile
        const parsed = parseParameterizedPath(normalizedPath, route);

        if (!parsed) {
            console.warn(`Navigation: Cannot replace to invalid route "${normalizedPath}".`);
            return;
        }

        // Merge route params with navigation state
        const navigationParams = {
            ...parsed.params,
            ...(params.state || {}),
        };

        // Use StackActions.replace to replace the current screen
        navigation.dispatch(
            StackActions.replace(parsed.routeName, navigationParams)
        );
    };

    const RouteComponent = useMemo(() => {
        // Memoize the navigator to prevent unnecessary re-renders
        return memo(buildNavigator(route));
    }, [route]);

    const canGoBack = () => navigation.canGoBack();

    const goBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <NavigatorContext.Provider value={{
            route,
            navigate,
            replace,
            canGoBack,
            goBack,
        }}>
            <RouteComponent />
        </NavigatorContext.Provider>
    )
};

const NavigatorProvider = ({ route }: NavigatorProviderProps) => {
    const {rt} = useUnistyles()

    const isDarkMode = rt.themeName === 'dark';

    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <UnwrappedNavigatorProvider route={route} />
        </NavigationContainer>
    )
};

const DrawerNavigatorProvider = ({ navigation, route, children }: { navigation: any, route: any, children: React.ReactNode }) => {

    const navigate = (params: NavigateParams, _redirectCount = 0) => {
        // Prevent infinite redirect loops
        if (_redirectCount > 10) {
            console.error('Navigation: Maximum redirect count exceeded. Check onInvalidRoute handlers.');
            return;
        }

        // Normalize path and substitute variables (e.g., /visit/:id with vars { id: "123" } becomes /visit/123)
        const normalizedPath = normalizePath(params.path, params.vars);

        // Parse parameterized path for mobile
        const parsed = parseParameterizedPath(normalizedPath, route);

        if (!parsed) {
            // Invalid route - try to find a handler
            const handler = findInvalidRouteHandler(route, normalizedPath);
            if (handler) {
                const redirectParams = handler(normalizedPath);
                if (redirectParams) {
                    // Handler returned NavigateParams - redirect
                    return navigate(
                        { ...redirectParams, replace: true },
                        _redirectCount + 1
                    );
                }
                // Handler returned undefined - fall through to 404 screen
            }

            // Navigate to 404 screen if configured
            if (route.notFoundComponent) {
                navigation.navigate(NOT_FOUND_SCREEN_NAME as never, {
                    path: normalizedPath,
                } as never);
                return;
            }

            // No handler and no 404 screen - log warning
            console.warn(`Navigation: Invalid route "${normalizedPath}" and no handler or notFoundComponent configured.`);
            return;
        }

        // Merge route params with navigation state (state values stored directly in params)
        const navigationParams = {
            ...parsed.params,
            ...(params.state || {}),
        };

        if (params.replace) {
            // Use StackActions.replace to replace the current screen in the stack
            navigation.dispatch(
                StackActions.replace(parsed.routeName, navigationParams)
            );
        } else {
            // Navigate to the pattern route with extracted parameters
            navigation.navigate(parsed.routeName as never, navigationParams as never);
        }
    };

    const replace = (params: Omit<NavigateParams, 'replace'>) => {
        // Normalize path and substitute variables
        const normalizedPath = normalizePath(params.path, params.vars);

        // Parse parameterized path for mobile
        const parsed = parseParameterizedPath(normalizedPath, route);

        if (!parsed) {
            console.warn(`Navigation: Cannot replace to invalid route "${normalizedPath}".`);
            return;
        }

        // Merge route params with navigation state
        const navigationParams = {
            ...parsed.params,
            ...(params.state || {}),
        };

        // Use StackActions.replace to replace the current screen
        navigation.dispatch(
            StackActions.replace(parsed.routeName, navigationParams)
        );
    };

    const canGoBack = () => navigation.canGoBack();

    const goBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <DrawerNavigatorContext.Provider value={{ navigate, replace, route, canGoBack, goBack }}>
            {children}
        </DrawerNavigatorContext.Provider>
    );
};

export { NavigatorProvider, DrawerNavigatorProvider };


export const useNavigator = () => {
  const drawerContext = useContext(DrawerNavigatorContext);
  if (!drawerContext) {
    return useContext(NavigatorContext)
  }
  return drawerContext;
};