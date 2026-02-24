import React from "react";
import type { NavigateParams } from "../context/types";

/**
 * Special screen name used for not-found/404 routes
 */
export const NOT_FOUND_SCREEN_NAME = '__notFound__';

/**
 * Tab bar specific screen options
 */
export type TabBarScreenOptions = {
    /**
     * Icon for tab/drawer navigation.
     *
     * Can be:
     * - A **string** (icon name) — e.g. `"home"`, `"cog"`. The default layout renders
     *   `<Icon name={tabBarIcon} size="sm" />` automatically.
     * - A **render function** — receives `{ focused, color, size }`. The `size` param is
     *   a number (from native tab bars); **ignore it** and use a Size token instead:
     *   `tabBarIcon: ({ focused }) => <Icon name={focused ? 'home' : 'home-outline'} size="sm" />`
     */
    tabBarIcon?: string | ((props: { focused: boolean; color: string; size: string | number }) => React.ReactElement)

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
    /**
     * When true, renders the screen outside of parent layout wrappers.
     * Useful for fullscreen modals, onboarding flows, or any screen that
     * should not inherit the parent navigator's layout (header, sidebar, tabs, etc.)
     *
     * Web: Screen renders as a sibling route without the parent LayoutComponent
     * Native: Screen uses fullScreenModal presentation
     */
    fullScreen?: boolean;

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
    /**
     * Navigator options. When this navigator is nested inside a tab or drawer,
     * you can include TabBarScreenOptions (tabBarIcon, tabBarLabel, tabBarBadge)
     * so the parent layout can render the tab/drawer entry for this navigator.
     */
    options?: TabBarScreenOptions
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
 * Props passed to drawer sidebar components
 * Includes the current path and safe area insets for proper layout
 */
export type DrawerSidebarProps = {
    /** Current URL path, useful for highlighting active nav items */
    currentPath: string;
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