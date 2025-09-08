import React from "react";
import { Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import { RouteParam, ScreenOptions } from "./types";
import { GeneralLayout } from "../layouts/GeneralLayout";
import { View, Text, Icon, Pressable } from '@idealyst/components';

// Types for TabButton
interface TabRoute {
    id: string;
    path: string;
    label: string;
    icon?: React.ComponentType<{ focused: boolean; color: string; size: string }> 
          | React.ReactElement 
          | ((props: { focused: boolean; color: string; size: string }) => React.ReactElement)
          | string;
}

interface TabButtonProps {
    tab: TabRoute;
    isActive: boolean;
    onPress: () => void;
}

// Tab Button Component
const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onPress }) => {
    // Render icon - supports React elements, functions, and string names
    const renderIcon = (icon: TabRoute['icon']) => {
        if (!icon) return null;
        
        if (typeof icon === 'function') {
            // Function-based icon that receives state - pass explicit colors
            const IconComponent = icon as (props: { focused: boolean; color: string; size: string }) => React.ReactElement;
            return IconComponent({ 
                focused: isActive, 
                color: isActive ? 'blue' : 'black.900',
                size: 'sm'
            });
        }
        
        if (React.isValidElement(icon)) {
            return icon;
        }
        
        if (typeof icon === 'string') {
            // Fallback for string icons (though this breaks transpiler support)
            return <Icon name={icon as any} size="md" color={isActive ? 'white' : 'secondary'} />;
        }
        
        // Handle React.ComponentType
        if (typeof icon === 'object' && 'type' in icon) {
            const IconComponent = icon as React.ComponentType<{ focused: boolean; color: string; size: string }>;
            return <IconComponent focused={isActive} color={isActive ? 'white' : 'secondary'} size="sm" />;
        }
        
        return null;
    };
    
    return (
        <Pressable onPress={onPress}>
            <View
                style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                {tab.icon ? renderIcon(tab.icon) : null}
                {tab.label && (
                    <Text 
                        size="small" 
                        color={isActive ? 'blue' : 'black.900'}
                        style={{
                            marginLeft: tab.icon ? 8 : 0,
                        }}
                    >
                        {tab.label}
                    </Text>
                )}
            </View>
        </Pressable>
    );
};

// Types for SimpleTabLayout
interface SimpleTabLayoutProps {
    routeParam: RouteParam;
    webScreenOptions: {
        title?: string;
        headerTitle?: React.ComponentType | React.ReactElement | string;
        headerLeft?: React.ComponentType | React.ReactElement;
        headerRight?: React.ComponentType | React.ReactElement;
        tabBarLabel?: string;
        tabBarIcon?: TabRoute['icon'];
        [key: string]: any;
    };
    currentPath: string;
}

// Simple Tab Layout Component
const SimpleTabLayout: React.FC<SimpleTabLayoutProps> = ({ routeParam, webScreenOptions }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Build tab links from routes with screen options
    const tabRoutes: TabRoute[] = [
        // Main route (home/index)
        {
            id: 'home',
            path: '',
            label: webScreenOptions.tabBarLabel || webScreenOptions.title || 'Home',
            icon: webScreenOptions.tabBarIcon,
        },
        // Child routes
        ...routeParam.routes!.map((route): TabRoute => {
            const routeOptions = convertScreenOptionsForWeb(route.screenOptions);
            return {
                id: route.path || '',
                path: route.path || '',
                label: routeOptions.tabBarLabel || routeOptions.title || route.path || '',
                icon: routeOptions.tabBarIcon,
            };
        }),
    ];
    
    // Determine active tab based on current location
    const getActiveTab = () => {
        const path = location.pathname.replace(/^\//, ''); // Remove leading slash
        const activeTabId = path || 'home';
        return activeTabId;
    };
    
    const activeTab = getActiveTab();
    
    // Helper to render header element (component, element, or string)
    const renderHeaderElement = (element: React.ComponentType | React.ReactElement | string | undefined) => {
        if (!element) return null;
        if (React.isValidElement(element)) return element;
        if (typeof element === 'string') return <Text size="large" weight="semibold">{element}</Text>;
        if (typeof element === 'function') {
            const Component = element as React.ComponentType;
            return <Component />;
        }
        return null;
    };

    // Create simple header navigation
    const headerContent = (
        <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            flex: 1
        }}>
            {/* Left side */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {webScreenOptions.headerLeft ? (
                    renderHeaderElement(webScreenOptions.headerLeft)
                ) : (
                    renderHeaderElement(
                        webScreenOptions.headerTitle || 
                        webScreenOptions.title || 
                        'Navigation'
                    )
                )}
            </View>
            
            {/* Tab Navigation */}
            <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
            }}>
                {tabRoutes.map((tab) => (
                    <TabButton
                        key={tab.id}
                        tab={tab}
                        isActive={activeTab === tab.id}
                        onPress={() => {
                            let targetPath;
                            if (tab.id === 'home') {
                                targetPath = '/';
                            } else {
                                targetPath = `/${tab.path}`;
                            }
                            navigate(targetPath);
                        }}
                    />
                ))}
            </View>
            
            {/* Right side */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                {renderHeaderElement(webScreenOptions.headerRight)}
            </View>
        </View>
    );
    
    return (
        <GeneralLayout
            header={{
                enabled: true,
                content: headerContent,
            }}
            sidebar={{
                enabled: false,
            }}
        >
            <Outlet />
        </GeneralLayout>
    );
};

export const buildRouter = (routeParam: RouteParam, path: string = '') => {
    return () => (
        <Routes>
            {buildWebRoutes(routeParam, path)}
        </Routes>
    );
};

/**
 * Convert ScreenOptions to web-compatible props for layout components
 */
const convertScreenOptionsForWeb = (screenOptions?: ScreenOptions) => {
    if (!screenOptions) return {};

    const webOptions: any = {};

    // Basic screen info
    if (screenOptions.title) {
        webOptions.title = screenOptions.title;
    }

    if (screenOptions.tabBarLabel) {
        webOptions.tabBarLabel = screenOptions.tabBarLabel;
    }

    if (screenOptions.tabBarIcon) {
        webOptions.tabBarIcon = screenOptions.tabBarIcon;
    }

    if (screenOptions.tabBarBadge !== undefined) {
        webOptions.tabBarBadge = screenOptions.tabBarBadge;
    }

    if (screenOptions.tabBarVisible !== undefined) {
        webOptions.tabBarVisible = screenOptions.tabBarVisible;
    }

    if (screenOptions.headerTitle) {
        webOptions.headerTitle = screenOptions.headerTitle;
    }

    if (screenOptions.headerBackVisible !== undefined) {
        webOptions.headerBackVisible = screenOptions.headerBackVisible;
    }

    if (screenOptions.headerRight) {
        webOptions.headerRight = screenOptions.headerRight;
    }

    if (screenOptions.platformOptions?.web) {
        Object.assign(webOptions, screenOptions.platformOptions.web);
    }

    return webOptions;
};

/**
 * Create React Router routes from RouteParam configuration
 * @param routeParam The route parameter configuration
 * @param parentPath The parent path for nested routes
 * @returns Array of React Router Route elements
 */
const buildWebRoutes = (routeParam: RouteParam, parentPath: string = ''): React.ReactElement[] => {
    const routes: React.ReactElement[] = [];
    const currentPath = routeParam.path ? `${parentPath}${routeParam.path}` : parentPath;
    
    // Handle layout wrapping
    const LayoutComponent = routeParam.layout?.component;
    const RouteComponent = routeParam.component;
    const webScreenOptions = convertScreenOptionsForWeb(routeParam.screenOptions);
    const isTabLayout = routeParam.layout?.type === 'tab';
    
    if (isTabLayout && routeParam.routes) {
        // Create simple header-based tab navigation using GeneralLayout
        const SimpleTabLayoutWrapper: React.FC = () => {
            return <SimpleTabLayout routeParam={routeParam} webScreenOptions={webScreenOptions} currentPath={currentPath} />;
        };
        
        // Create parent route with simple tab layout
        const layoutRoute = (
            <Route 
                key={`simple-tab-layout-${currentPath || 'root'}`} 
                path={currentPath || '/'} 
                element={<SimpleTabLayoutWrapper />}
            >
                {/* Add index route for the main component */}
                <Route 
                    index 
                    element={<RouteComponent {...webScreenOptions} />} 
                />
                {/* Add nested routes */}
                {routeParam.routes.reduce((acc, nestedRoute) => {
                    return acc.concat(buildWebRoutes(nestedRoute, currentPath));
                }, [] as React.ReactElement[])}
            </Route>
        );
        
        routes.push(layoutRoute);
    } else if (LayoutComponent && routeParam.routes) {
        // Create a wrapper component that renders the layout with Outlet and screen options
        const LayoutWrapper: React.FC = () => (
            <LayoutComponent {...webScreenOptions}>
                <Outlet />
            </LayoutComponent>
        );
        
        // Create parent route with layout
        const layoutRoute = (
            <Route 
                key={`layout-${currentPath || 'root'}`} 
                path={currentPath || '/'} 
                element={<LayoutWrapper />}
            >
                {/* Add index route for the main component */}
                <Route 
                    index 
                    element={<RouteComponent {...webScreenOptions} />} 
                />
                {/* Add nested routes */}
                {routeParam.routes.reduce((acc, nestedRoute) => {
                    return acc.concat(buildWebRoutes(nestedRoute, currentPath));
                }, [] as React.ReactElement[])}
            </Route>
        );
        
        routes.push(layoutRoute);
    } else {
        // Simple route without layout
        routes.push(
            <Route 
                key={currentPath || 'root'} 
                path={currentPath || '/'} 
                element={<RouteComponent {...webScreenOptions} />} 
            />
        );
        
        // Handle nested routes without layout
        if (routeParam.routes) {
            routeParam.routes.forEach(nestedRoute => {
                routes.push(...buildWebRoutes(nestedRoute, currentPath));
            });
        }
    }
    
    return routes;
};