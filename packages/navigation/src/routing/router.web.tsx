import React from 'react'
import { NavigatorParam, RouteParam, TabNavigatorParam, StackNavigatorParam } from './types'

/**
 * Build the Web navigator using simple navigation
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
 * Simple Tab Navigator Component for web
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
    
    // Render the current route component based on location
    const renderCurrentRoute = () => {
        // Find matching route
        const currentRoute = params.routes.find(route => {
            const routePath = normalizePath(route.path)
            return routePath === currentPath
        }) || params.routes[0] // fallback to first route

        if (!currentRoute || currentRoute.type !== 'screen') {
            return <div>Route not found: {currentPath}</div>
        }

        const Component = currentRoute.component
        return <Component />
    }

    return (
        <div>
            {/* Simple navigation for debugging */}
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Tab Navigation</h3>
                <div style={{ display: 'flex', gap: '5px' }}>
                    {params.routes.map((route) => {
                        const routePath = normalizePath(route.path)
                        const isActive = currentPath === routePath
                        const screenRoute = route as any
                        const label = screenRoute.options?.tabBarLabel || screenRoute.options?.title || (route.path === '/' ? 'Home' : route.path)
                        
                        return (
                            <button
                                key={route.path}
                                onClick={() => navigateToRoute(route.path)}
                                style={{ 
                                    padding: '8px 16px',
                                    backgroundColor: isActive ? '#007bff' : 'white',
                                    color: isActive ? 'white' : '#007bff',
                                    border: '1px solid #007bff',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: isActive ? 'bold' : 'normal'
                                }}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div style={{ padding: '20px' }}>
                {renderCurrentRoute()}
            </div>
        </div>
    )
}

/**
 * Simple Stack Navigator Component for web
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
    
    // Render the current route component based on location
    const renderCurrentRoute = () => {
        // Find matching route
        const currentRoute = params.routes.find(route => {
            const routePath = normalizePath(route.path)
            return routePath === currentPath
        }) || params.routes[0] // fallback to first route

        if (!currentRoute) {
            return <div>Route not found: {currentPath}</div>
        }

        if (currentRoute.type === 'screen') {
            const Component = currentRoute.component
            return <Component />
        } else {
            // Nested navigator
            const NestedNavigator = buildNavigator(currentRoute, `${parentPath}/${currentRoute.path}`)
            return <NestedNavigator />
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h3>Stack Navigation</h3>
            {renderCurrentRoute()}
        </div>
    )
}