import React, { useEffect, useState, useRef } from 'react'
import { Routes, Route, useLocation, useParams } from '../router'
import { DefaultStackLayout } from '../layouts/DefaultStackLayout'
import { DefaultTabLayout } from '../layouts/DefaultTabLayout'
import { NavigatorParam, RouteParam, NotFoundComponentProps } from './types'
import { NavigateParams } from '../context/types'

/**
 * Wrapper component for catch-all routes that:
 * 1. Checks onInvalidRoute handler first
 * 2. If handler returns NavigateParams, redirects (using absolute path)
 * 3. If handler returns undefined or no handler, renders notFoundComponent (if provided)
 */
const NotFoundWrapper = ({
    component: Component,
    onInvalidRoute
}: {
    component?: React.ComponentType<NotFoundComponentProps>
    onInvalidRoute?: (path: string) => NavigateParams | undefined
}) => {
    const location = useLocation()
    const params = useParams()
    const [shouldRender, setShouldRender] = useState(false)
    const redirectingRef = useRef(false)
    const lastPathRef = useRef(location.pathname)

    useEffect(() => {
        // Reset state if path changed (navigated to a different invalid route)
        if (lastPathRef.current !== location.pathname) {
            lastPathRef.current = location.pathname
            redirectingRef.current = false
            setShouldRender(false)
        }

        // Prevent multiple redirects
        if (redirectingRef.current) {
            return
        }

        // Check if handler wants to redirect
        if (onInvalidRoute) {
            const redirectParams = onInvalidRoute(location.pathname)
            if (redirectParams) {
                // Mark as redirecting to prevent loops
                redirectingRef.current = true

                // Handler returned NavigateParams - redirect using absolute path
                // Ensure path starts with / for absolute navigation
                let targetPath = redirectParams.path
                if (!targetPath.startsWith('/')) {
                    targetPath = `/${targetPath}`
                }

                // Substitute any vars in the path
                if (redirectParams.vars) {
                    Object.entries(redirectParams.vars).forEach(([key, value]) => {
                        targetPath = targetPath.replace(`:${key}`, value)
                    })
                }

                // Use window.history for truly absolute navigation
                // React Router's navigate can have issues in catch-all contexts
                const replaceMode = redirectParams.replace ?? true
                if (replaceMode) {
                    window.history.replaceState(null, '', targetPath)
                } else {
                    window.history.pushState(null, '', targetPath)
                }
                // Trigger React Router to sync with the new URL
                window.dispatchEvent(new PopStateEvent('popstate'))
                return
            }
        }
        // No redirect - show the 404 component (if provided)
        setShouldRender(true)
    }, [location.pathname, onInvalidRoute])

    // Don't render until we've checked the handler
    if (!shouldRender) {
        return null
    }

    // If no component provided, render nothing (handler-only mode)
    if (!Component) {
        console.warn(`[Navigation] Invalid route "${location.pathname}" - no notFoundComponent configured and onInvalidRoute returned undefined`)
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

        // Add catch-all and index routes if notFoundComponent or onInvalidRoute is configured
        if (params.notFoundComponent || params.onInvalidRoute) {
            // Check if any route handles the index (empty path or "/" for this navigator)
            const hasIndexRoute = params.routes.some(route => {
                const childPath = route.path.startsWith('/') ? route.path.slice(1) : route.path;
                return childPath === '' || childPath === '/';
            });

            // If no index route defined, add one for the 404 handler
            // This handles the case where user visits the navigator's root path directly
            if (!hasIndexRoute) {
                childRoutes.push(
                    <Route
                        key="__notFoundIndex__"
                        index
                        element={
                            <NotFoundWrapper
                                component={params.notFoundComponent}
                                onInvalidRoute={params.onInvalidRoute}
                            />
                        }
                    />
                );
            }

            // Add catch-all for non-index invalid routes
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

