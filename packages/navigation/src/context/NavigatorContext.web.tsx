import React, { createContext, memo, useContext, useMemo } from 'react';
import { NavigateParams, NavigatorProviderProps } from './types';
import { useNavigate } from "react-router-dom";
import { buildRouter } from '../routing';

const NavigatorContext = createContext<{
    navigate: (params: NavigateParams) => void;
}>({
    navigate: () => {},
});

export const NavigatorProvider = ({ 
    route,
}: NavigatorProviderProps) => {
    const routerNavigate = useNavigate();
    
    const navigateFunction = (params: NavigateParams) => {
        if (params.path) {
            routerNavigate(params.path);
        }
    };
    
    const RouteComponent = useMemo(() => {
        // Memoize the router to prevent unnecessary re-renders
        return memo(buildRouter(route));
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