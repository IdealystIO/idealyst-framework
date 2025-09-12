import React from 'react'
import { DefaultStackLayout } from '../layouts/DefaultStackLayout'
import { DefaultTabLayout } from '../layouts/DefaultTabLayout'
import { NavigatorParam, StackNavigatorParam, TabNavigatorParam } from './types'

/**
 * Build the Web navigator using custom layout components
 * @param params Navigator configuration
 * @param parentPath Parent route path for nested routing
 * @returns React Router component
 */
export const buildNavigator = (params: NavigatorParam, parentPath = '') => {
    const NavigatorComponent = () => {
        switch (params.layout) {
            case 'tab':
                return <TabNavigator params={params} parentPath={parentPath} />
            case 'stack':
                return <StackNavigator params={params} parentPath={parentPath} />
            default:
                throw new Error(`Unsupported navigator layout: ${(params as any).layout}`)
        }
    }
    
    return NavigatorComponent
}

/**
 * Normalize path for navigation - convert empty string to '/'
 */
const normalizePath = (path: string): string => {
    if (path === '' || path === '/') {
        return '/'
    }
    return path.startsWith('/') ? path : `/${path}`
}

/**
 * Build full path by combining parent path with child path
 */
const buildFullPath = (parentPath: string, childPath: string): string => {
    if (childPath === '/') {
        return parentPath || '/'
    }
    
    const normalizedParent = parentPath === '/' ? '' : parentPath
    const normalizedChild = normalizePath(childPath)

    return `${normalizedParent}${normalizedChild}`
}

/**
 * Check if current path matches a route, considering parent path
 */
const pathMatches = (currentPath: string, routePath: string, parentPath: string): boolean => {
    const fullRoutePath = buildFullPath(parentPath, routePath)
    return currentPath === fullRoutePath
}

/**
 * Tab Navigator Component for web using custom layout components
 */
const TabNavigator: React.FC<{ params: TabNavigatorParam; parentPath: string }> = ({ 
    params, 
    parentPath 
}) => {
    // Get current path from window location
    const getCurrentPath = () => {
        return window.location.pathname
    }

    const [currentPath, setCurrentPath] = React.useState(getCurrentPath)

    // Listen for navigation changes
    React.useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(getCurrentPath())
        }
        
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    // Navigate function
    const navigateToRoute = (routePath: string) => {
        const fullPath = buildFullPath(parentPath, routePath)
        window.history.pushState({}, '', fullPath)
        setCurrentPath(fullPath)
    }
    
    // Get current route component
    const getCurrentRoute = () => {
        // Find matching route
        const currentRoute = params.routes.find(route => {
            return pathMatches(currentPath, route.path, parentPath)
        }) || params.routes[0] // fallback to first route

        if (!currentRoute || currentRoute.type !== 'screen') {
            return () => React.createElement('div', {}, `Route not found: ${currentPath}`)
        }

        return currentRoute.component
    }

    // Transform routes to include full paths for layout component
    const routesWithFullPaths = params.routes.map(route => ({
        ...route,
        fullPath: buildFullPath(parentPath, route.path)
    }))

    // Use custom layout component or default
    const LayoutComponent = params.layoutComponent || DefaultTabLayout

    return (
        <LayoutComponent
            options={params.options}
            routes={routesWithFullPaths}
            ContentComponent={getCurrentRoute()}
            onNavigate={navigateToRoute}
            currentPath={currentPath}
        />
    )
}

/**
 * Stack Navigator Component for web using custom layout components
 */
const StackNavigator: React.FC<{ params: StackNavigatorParam; parentPath: string }> = ({ 
    params, 
    parentPath 
}) => {
    // Get current path from window location
    const getCurrentPath = () => {
        return window.location.pathname
    }

    const [currentPath, setCurrentPath] = React.useState(getCurrentPath)

    // Listen for navigation changes
    React.useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(getCurrentPath())
        }
        
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    // Navigate function
    const navigateToRoute = (routePath: string) => {
        const fullPath = buildFullPath(parentPath, routePath)
        window.history.pushState({}, '', fullPath)
        setCurrentPath(fullPath)
    }
    
    // Get current route component
    const getCurrentRoute = () => {
        // Find matching route
        const currentRoute = params.routes.find(route => {
            return pathMatches(currentPath, route.path, parentPath)
        })
        
        // If no exact match, check if current path starts with any navigator route
        if (!currentRoute) {
            const navigatorRoute = params.routes.find(route => {
                if (route.type === 'navigator') {
                    const fullRoutePath = buildFullPath(parentPath, route.path)
                    return currentPath.startsWith(fullRoutePath + '/') || currentPath === fullRoutePath
                }
                return false
            })
            
            if (navigatorRoute && navigatorRoute.type === 'navigator') {
                return () => {
                    const NestedNavigator = buildNavigator(navigatorRoute, buildFullPath(parentPath, navigatorRoute.path))
                    return React.createElement(NestedNavigator)
                }
            }
        }
        
        // Fallback to first route if no match
        if (!currentRoute) {
            const fallbackRoute = params.routes[0]
            if (fallbackRoute.type === 'screen') {
                return fallbackRoute.component
            } else if (fallbackRoute.type === 'navigator') {
                const NestedNavigator = buildNavigator(fallbackRoute, buildFullPath(parentPath, fallbackRoute.path))
                return () => React.createElement(NestedNavigator)
            }
        }

        if (currentRoute) {
            if (currentRoute.type === 'screen') {
                return currentRoute.component
            } else if (currentRoute.type === 'navigator') {
                // Nested navigator
                const NestedNavigator = buildNavigator(currentRoute, buildFullPath(parentPath, currentRoute.path))
                return () => React.createElement(NestedNavigator)
            }
        }
        
        // If all else fails, return a not found component
        return () => React.createElement('div', {}, `Route not found: ${currentPath}`)
    }

    // Transform routes to include full paths for layout component
    const routesWithFullPaths = params.routes.map(route => ({
        ...route,
        fullPath: buildFullPath(parentPath, route.path)
    }))

    // Use custom layout component or default
    const LayoutComponent = params.layoutComponent || DefaultStackLayout

    return (
        <LayoutComponent
            options={params.options}
            routes={routesWithFullPaths}
            ContentComponent={getCurrentRoute()}
            onNavigate={navigateToRoute}
            currentPath={currentPath}
        />
    )
}