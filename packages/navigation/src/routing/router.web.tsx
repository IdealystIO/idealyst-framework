import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useParams, useNavigate } from '../router'
import { DefaultStackLayout } from '../layouts/DefaultStackLayout'
import { DefaultTabLayout } from '../layouts/DefaultTabLayout'
import { NavigatorParam, RouteParam, NotFoundComponentProps } from './types'
import { NavigateParams } from '../context/types'

/**
 * Wrapper component for notFoundComponent that:
 * 1. Checks onInvalidRoute handler first
 * 2. If handler returns NavigateParams, redirects
 * 3. If handler returns undefined or no handler, renders notFoundComponent
 */
const NotFoundWrapper = ({
    component: Component,
    onInvalidRoute
}: {
    component: React.ComponentType<NotFoundComponentProps>
    onInvalidRoute?: (path: string) => NavigateParams | undefined
}) => {
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        // Check if handler wants to redirect
        if (onInvalidRoute) {
            const redirectParams = onInvalidRoute(location.pathname)
            if (redirectParams) {
                // Handler returned NavigateParams - redirect
                navigate(redirectParams.path, { replace: redirectParams.replace ?? true })
                return
            }
        }
        // No redirect - show the 404 component
        setShouldRender(true)
    }, [location.pathname, onInvalidRoute, navigate])

    // Don't render until we've checked the handler
    if (!shouldRender) {
        return null
    }

    return <Component path={location.pathname} params={params as Record<string, string>} />
}

/**
 * Build the Web navigator using React Router v7 nested routes
 * @param params Navigator configuration
 * @param parentPath Parent route path for nested routing
 * @returns React Router component
 */
export const buildNavigator = (params: NavigatorParam, parentPath = '') => {
    return () => (
        <Routes>
            {buildRoute(params, 0, false)}
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

        // Build child routes including catch-all for 404
        const childRoutes = params.routes.map((child, childIndex) => buildRoute(child, childIndex, true));

        // Add catch-all route for notFoundComponent if configured
        if (params.notFoundComponent) {
            childRoutes.push(
                <Route
                    key="__notFound__"
                    path="*"
                    element={
                        <NotFoundWrapper
                            component={params.notFoundComponent}
                            onInvalidRoute={params.onInvalidRoute}
                        />
                    }
                />
            );
        }

        return (
            <Route
                key={`${params.path}-${index}`}
                path={routePath}
                element={
                    <LayoutComponent
                        options={params.options}
                        routes={routesWithFullPaths}
                        currentPath=""
                    />
                }
            >
                {childRoutes}
            </Route>
        );
    }
    
    return null;
}

