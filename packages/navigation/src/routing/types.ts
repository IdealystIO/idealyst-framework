import React from "react";

export type ScreenOptions = {
    /**
     * Screen title for navigation headers
     */
    title?: string;
    
};

/**
 * Tab bar specific screen options
 */
export type TabBarScreenOptions = {
    /**
     * Icon component for tab/drawer navigation (React.ComponentType, React.ReactElement, function, or string)
     */
    tabBarIcon?: React.ComponentType<{ focused: boolean; color: string; size: number }> 
                | React.ReactElement 
                | ((props: { focused: boolean; color: string; size: string }) => React.ReactElement)
                | string;
    
    /**
     * Label for tab/drawer navigation
     */
    tabBarLabel?: string;
    
    /**
     * Badge for tab navigation
     */
    tabBarBadge?: string | number;
    
    /**
     * Whether to show the tab bar for this screen
     */
    tabBarVisible?: boolean;
} & ScreenOptions

export type NavigatorOptions = {

    
    /**
     * Custom header title component or string
     */
    headerTitle?: React.ComponentType | React.ReactElement | string;
    
    /**
     * Custom header left component (overrides back button)
     */
    headerLeft?: React.ComponentType | React.ReactElement;
    
    /**
     * Whether to show header back button
     */
    headerBackVisible?: boolean;
    
    /**
     * Custom header right component
     */
    headerRight?: React.ComponentType | React.ReactElement;
    
    /**
     * Whether to hide the native React Navigation header (mobile only)
     */
    headerShown?: boolean;
}

export type BaseNavigatorParam = {
    path: string
    type: 'navigator'
    options?: NavigatorOptions
}

export type TabNavigatorParam = {
    layout: 'tab'
    routes: RouteParam<TabBarScreenOptions>[]
    layoutComponent?: TabLayoutComponent
} & BaseNavigatorParam

export type StackNavigatorParam = {
    layout: 'stack'
    routes: RouteParam<ScreenOptions>[]
    layoutComponent?: StackLayoutComponent
} & BaseNavigatorParam

export type NavigatorParam = TabNavigatorParam | StackNavigatorParam

export type ScreenParam<T = ScreenOptions> = {
    path: string
    type: 'screen'
    options?: T
    component: React.ComponentType
}

export type RouteParam<T = ScreenOptions> = NavigatorParam | ScreenParam<T>;

/**
 * Extended route type with full path for layout components
 */
export type RouteWithFullPath<T = ScreenOptions> = RouteParam<T> & {
    fullPath: string
}

export type TabLayoutProps = {
    options?: NavigatorOptions
    routes: RouteWithFullPath<TabBarScreenOptions>[]
    ContentComponent: React.ComponentType
    onNavigate: (path: string) => void
    currentPath: string
}

export type StackLayoutProps = {
    options?: NavigatorOptions
    routes: RouteWithFullPath<ScreenOptions>[]
    ContentComponent: React.ComponentType
    onNavigate: (path: string) => void
    currentPath: string
}

export type TabLayoutComponent = React.ComponentType<TabLayoutProps>
export type StackLayoutComponent = React.ComponentType<StackLayoutProps>