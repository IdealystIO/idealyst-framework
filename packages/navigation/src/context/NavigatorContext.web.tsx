import React, { createContext, memo, useContext, useMemo } from 'react';
import { useNavigate, useParams } from '../router';
import { NavigateParams, NavigatorProviderProps, NavigatorContextValue } from './types';
import { buildNavigator } from '../routing';

const NavigatorContext = createContext<NavigatorContextValue>({
    navigate: () => {},
});

export const NavigatorProvider = ({
    route,
}: NavigatorProviderProps) => {
    const reactRouterNavigate = useNavigate()
    
    const navigateFunction = (params: NavigateParams) => {
        if (params.path) {
            // Normalize path - convert empty string to '/'
            let path = params.path
            if (path === '' || path === '/') {
                path = '/'
            } else if (!path.startsWith('/')) {
                path = `/${path}`
            }
            
            // Substitute variables in the path if provided
            if (params.vars) {
                Object.entries(params.vars).forEach(([key, value]) => {
                    path = path.replace(`:${key}`, value);
                });
            }
            
            // Use React Router's navigate function
            reactRouterNavigate(path);
        }
    };
    
    const RouteComponent = useMemo(() => {
        // Memoize the router to prevent unnecessary re-renders
        return memo(buildNavigator(route));
    }, [route]);
    
    return (
        <NavigatorContext.Provider value={{ 
            navigate: navigateFunction,
        }}>
            <RouteComponent />
        </NavigatorContext.Provider>
    );
};

export const useNavigator = () => {
    return useContext(NavigatorContext);
}; 