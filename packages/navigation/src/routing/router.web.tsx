import React from 'react'
import { Routes, Route } from '../router'
import { DefaultStackLayout } from '../layouts/DefaultStackLayout'
import { DefaultTabLayout } from '../layouts/DefaultTabLayout'
import { NavigatorParam, RouteParam } from './types'

/**
 * Build the Web navigator using React Router v7 nested routes
 * @param params Navigator configuration
 * @param parentPath Parent route path for nested routing
 * @returns React Router component
 */
export const buildNavigator = (params: NavigatorParam, parentPath = '') => {
    return () => (
        <Routes>
            {params.routes.map((child, index) => buildRoute(child, index))}
        </Routes>
    )
}


/**
 * Build Route - handles both screens and nested navigators
 * @param params Route configuration
 * @param index Route index for key generation
 * @param isNested Whether this is a nested route (should strip leading slash)
 * @returns React Router Route element
 */
const buildRoute = (params: RouteParam, index: number, isNested = false) => {
    // For nested routes, strip leading slash to make path relative
    const routePath = isNested && params.path.startsWith('/') 
        ? params.path.slice(1) 
        : params.path;
    
    if (params.type === 'screen') {
        
        // If the route path is empty (root route in navigator), make it an index route
        const routeProps = routePath === '' ? { index: true } : { path: routePath };
        
        return (
            <Route
                key={`${params.path}-${index}`}
                {...routeProps}
                element={React.createElement(params.component)}
            />
        );
    } else if (params.type === 'navigator') {
        // Get the layout component directly
        const LayoutComponent = params.layoutComponent || 
            (params.layout === 'tab' ? DefaultTabLayout : DefaultStackLayout);
        
        // Transform routes to include full paths for layout component
        const routesWithFullPaths = params.routes.map(route => ({
            ...route,
            fullPath: route.path
        }));
        
        return (
            <Route 
                key={`${params.path}-${index}`} 
                path={routePath}
                element={
                    <LayoutComponent
                        options={params.options}
                        routes={routesWithFullPaths}
                        onNavigate={() => {}} // Layout components can use their own navigation logic
                        currentPath=""
                    />
                }
            >
                {params.routes.map((child, childIndex) => buildRoute(child, childIndex, true))}
            </Route>
        );
    }
    
    return null;
}

