import React, { createContext, memo, useContext, useMemo } from 'react';
import { NavigateParams, NavigatorProviderProps, NavigatorContextValue } from './types';
import { useNavigation, useNavigationState, DarkTheme, DefaultTheme, NavigationContainer, useRoute } from '@react-navigation/native';
import { buildNavigator } from '../routing';
import { useUnistyles } from 'react-native-unistyles';

const NavigatorContext = createContext<NavigatorContextValue>({
    navigate: () => {},
});

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
        
    const navigate = (params: NavigateParams) => {
        // Parse parameterized path for mobile
        const parsed = parseParameterizedPath(params.path, route);
        if (parsed) {
            // Navigate to the pattern route with extracted parameters
            navigation.navigate(parsed.routeName as never, parsed.params as never);
        } else {
            // Fallback to direct navigation
            navigation.navigate(params.path as never, params.vars as never);
        }
    };

    const RouteComponent = useMemo(() => {
        // Memoize the navigator to prevent unnecessary re-renders
        return memo(buildNavigator(route));
    }, [route]);
     
    return (
        <NavigatorContext.Provider value={{ 
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

export { NavigatorProvider };


export const useNavigator = () => {
  return useContext(NavigatorContext);
};