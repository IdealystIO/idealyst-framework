import React, { createContext, memo, useContext, useMemo } from 'react';
import { NavigateParams, NavigatorProviderProps } from './types';
import { buildNavigator } from '../routing';

const NavigatorContext = createContext<{
    navigate: (params: NavigateParams) => void;
}>({
    navigate: () => {},
});

export const NavigatorProvider = ({ 
    route,
}: NavigatorProviderProps) => {
    const navigateFunction = (params: NavigateParams) => {
        if (params.path) {
            // Normalize path - convert empty string to '/'
            let path = params.path
            if (path === '' || path === '/') {
                path = '/'
            } else if (!path.startsWith('/')) {
                path = `/${path}`
            }
            
            // Use HTML5 history API for proper navigation without hash
            window.history.pushState({}, '', path);
            // Trigger a popstate event to update any listening components
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };
    
    const RouteComponent = useMemo(() => {
        // Memoize the router to prevent unnecessary re-renders
        return memo(buildNavigator(route));
    }, [route]);
    
    return (
        <NavigatorContext.Provider value={{ navigate: navigateFunction }}>
            <RouteComponent />
        </NavigatorContext.Provider>
    );
};

export const useNavigator = () => {
    return useContext(NavigatorContext);
}; 