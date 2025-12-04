import React, { createContext, memo, useContext, useMemo } from 'react';
import { NavigateParams, NavigatorProviderProps, NavigatorContextValue } from './types';
import { useNavigation, DarkTheme, DefaultTheme, NavigationContainer, CommonActions } from '@react-navigation/native';
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
                
                if (routeSegments.length === segments.length - startIndex) {
                    let isMatch = true;
                    const extractedParams: Record<string, string> = {};
                    
                    for (let i = 0; i < routeSegments.length; i++) {
                        const routeSegment = routeSegments[i];
                        const pathSegment = segments[startIndex + i];
                        
                        if (routeSegment.startsWith(':')) {
                            // Parameter segment - extract value
                            const paramName = routeSegment.slice(1);
                            extractedParams[paramName] = pathSegment;
                        } else if (routeSegment !== pathSegment) {
                            // Literal segment must match exactly
                            isMatch = false;
                            break;
                        }
                    }
                    
                    if (isMatch) {
                        return { route, params: extractedParams, fullPath: fullRoutePath };
                    }
                }
                
                // Check nested routes
                if (route.routes) {
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

        // Parse parameterized path for mobile
        const parsed = parseParameterizedPath(params.path, route);

        if (!parsed) {
            // Invalid route - try to find a handler
            const handler = findInvalidRouteHandler(route, params.path);
            if (handler) {
                const redirectParams = handler(params.path);
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
                    path: params.path,
                    params: params.vars
                } as never);
                return;
            }

            // No handler and no 404 screen - log warning
            console.warn(`Navigation: Invalid route "${params.path}" and no handler or notFoundComponent configured.`);
            return;
        }

        if (params.replace) {
            // Use CommonActions.reset to replace the current route
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: parsed.routeName, params: parsed.params }],
                })
            );
        } else {
            // Navigate to the pattern route with extracted parameters
            navigation.navigate(parsed.routeName as never, parsed.params as never);
        }
    };

    const RouteComponent = useMemo(() => {
        // Memoize the navigator to prevent unnecessary re-renders
        return memo(buildNavigator(route));
    }, [route]);

    return (
        <NavigatorContext.Provider value={{
            route,
            navigate,
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

        // Parse parameterized path for mobile
        const parsed = parseParameterizedPath(params.path, route);

        if (!parsed) {
            // Invalid route - try to find a handler
            const handler = findInvalidRouteHandler(route, params.path);
            if (handler) {
                const redirectParams = handler(params.path);
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
                    path: params.path,
                    params: params.vars
                } as never);
                return;
            }

            // No handler and no 404 screen - log warning
            console.warn(`Navigation: Invalid route "${params.path}" and no handler or notFoundComponent configured.`);
            return;
        }

        if (params.replace) {
            // Use CommonActions.reset to replace the current route
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: parsed.routeName, params: parsed.params }],
                })
            );
        } else {
            // Navigate to the pattern route with extracted parameters
            navigation.navigate(parsed.routeName as never, parsed.params as never);
        }
    };

    return (
        <DrawerNavigatorContext.Provider value={{ navigate, route }}>
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