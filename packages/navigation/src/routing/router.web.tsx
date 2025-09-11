import React from 'react'
import { NavigatorParam, RouteParam, TabNavigatorParam, StackNavigatorParam } from './types'
import { DefaultTabLayout } from '../layouts/DefaultTabLayout'
import { DefaultStackLayout } from '../layouts/DefaultStackLayout'

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
        const normalizedPath = normalizePath(routePath)
        window.history.pushState({}, '', normalizedPath)
        setCurrentPath(normalizedPath)
    }
    
    // Get current route component
    const getCurrentRoute = () => {
        // Find matching route
        const currentRoute = params.routes.find(route => {
            const routePath = normalizePath(route.path)
            return routePath === currentPath
        }) || params.routes[0] // fallback to first route

        if (!currentRoute || currentRoute.type !== 'screen') {
            return () => React.createElement('div', {}, `Route not found: ${currentPath}`)
        }

        return currentRoute.component
    }

    // Use custom layout component or default
    const LayoutComponent = params.layoutComponent || DefaultTabLayout

    return (
        <LayoutComponent
            options={params.options}
            routes={params.routes}
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
        const normalizedPath = normalizePath(routePath)
        window.history.pushState({}, '', normalizedPath)
        setCurrentPath(normalizedPath)
    }
    
    // Get current route component
    const getCurrentRoute = () => {
        // Find matching route
        const currentRoute = params.routes.find(route => {
            const routePath = normalizePath(route.path)
            return routePath === currentPath
        }) || params.routes[0] // fallback to first route

        if (!currentRoute) {
            return () => React.createElement('div', {}, `Route not found: ${currentPath}`)
        }

        if (currentRoute.type === 'screen') {
            return currentRoute.component
        } else {
            // Nested navigator
            const NestedNavigator = buildNavigator(currentRoute, `${parentPath}/${currentRoute.path}`)
            return NestedNavigator
        }
    }

    // Use custom layout component or default
    const LayoutComponent = params.layoutComponent || DefaultStackLayout

    return (
        <LayoutComponent
            options={params.options}
            routes={params.routes}
            ContentComponent={getCurrentRoute()}
            onNavigate={navigateToRoute}
            currentPath={currentPath}
        />
    )
}