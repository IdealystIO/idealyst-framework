import React from "react";
import type { NavigateParams } from "../context/types";

/**
 * Tab bar specific screen options
 */
export type TabBarScreenOptions = {
    /**
     * Icon component for tab/drawer navigation (React.ComponentType, React.ReactElement, function, or string)
     */
    tabBarIcon?: ((props: { focused: boolean; color: string; size: string | number }) => React.ReactElement)
    
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

export type ScreenOptions = {
    /**
     * Screen title for navigation headers
     */
    title?: string;
    headerShown?: boolean;

} & NavigatorOptions;


/**
 * Props passed to the notFoundComponent when an invalid route is accessed
 */
export type NotFoundComponentProps = {
    /** The full path that was attempted */
    path: string
    /** Any route parameters that were parsed from the path */
    params?: Record<string, string>
}

export type BaseNavigatorParam = {
    path: string
    type: 'navigator'
    options?: NavigatorOptions
    /**
     * Handler called when an invalid route is accessed.
     * - Return NavigateParams to redirect to a different route
     * - Return undefined to show the notFoundComponent (if set)
     * If not defined, bubbles up to parent navigator.
     *
     * @param invalidPath - The path that was attempted but not found
     * @returns NavigateParams to redirect, or undefined to use notFoundComponent
     */
    onInvalidRoute?: (invalidPath: string) => NavigateParams | undefined
    /**
     * Component to render/navigate to when route is invalid and onInvalidRoute returns undefined.
     * - Web: Renders at the current URL via catch-all route
     * - Native: Navigated to as a screen
     * - Optional: If not set and nothing handles the route, a warning is logged
     */
    notFoundComponent?: React.ComponentType<NotFoundComponentProps>
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

/**
 * Props passed to drawer sidebar components on mobile
 * Includes safe area insets for proper layout
 */
export type DrawerSidebarProps = {
    /**
     * Safe area insets (mobile only)
     * Use these to add padding to avoid notches, status bars, etc.
     */
    insets?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
};

export type DrawerNavigatorParam = {
    layout: 'drawer'
    routes: RouteParam<TabBarScreenOptions>[]
    layoutComponent?: TabLayoutComponent
    /**
     * Custom component to render in the drawer sidebar
     * This component will have access to useNavigator hook
     * On mobile, receives DrawerSidebarProps with safe area insets
     */
    sidebarComponent?: React.ComponentType<DrawerSidebarProps>
} & BaseNavigatorParam

export type NavigatorParam = TabNavigatorParam | StackNavigatorParam | DrawerNavigatorParam

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
    currentPath: string
}

export type StackLayoutProps = {
    options?: NavigatorOptions
    routes: RouteWithFullPath<ScreenOptions>[]
    currentPath: string
}

export type TabLayoutComponent = React.ComponentType<TabLayoutProps>
export type StackLayoutComponent = React.ComponentType<StackLayoutProps>