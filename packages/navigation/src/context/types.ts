import React from 'react';
import { NavigatorParam } from "../routing";

/**
 * When navigating to a new route, specify the path and the variables to be used in the route.
 */
export type NavigateParams = {
    path: string;
    vars?: Record<string, string>;
    /**
     * If true, replaces the current history entry instead of pushing a new one.
     * On web, this uses history.replace(). On native, this resets the navigation state.
     */
    replace?: boolean;
    /**
     * Optional state data to pass to the destination screen.
     * On web, this is passed as URL query parameters (e.g., ?autostart=true).
     * On native, this is passed via route params.
     * Use useNavigationState() hook to access this data in the destination screen.
     *
     * Note: Values are serialized to strings. Booleans and numbers are automatically
     * parsed back when using useNavigationState().
     */
    state?: Record<string, string | number | boolean>;
};

export type NavigatorProviderProps = {
    route: NavigatorParam;
    /**
     * Optional component to render alongside the route hierarchy.
     * This component has access to the NavigatorContext (useNavigator hook)
     * but is not tied to any specific screen.
     * Useful for global floating UI like FABs, toasts, or audio players.
     */
    floatingComponent?: React.ReactNode;
    _overrideNavigation?: any; // Used in the drawer navigator which has to provide its own navigation object
};

/**
 * Context value that includes navigation function and current route parameters
 */
export type NavigatorContextValue = {
    route: NavigatorParam | undefined;
    navigate: (params: NavigateParams) => void;
    /**
     * Replace the current screen with a new one. The current screen unmounts
     * and the new screen takes its place in the navigation stack.
     * On native, this uses StackActions.replace() to swap the current screen.
     * On web, this behaves the same as navigate (no special handling needed).
     */
    replace: (params: Omit<NavigateParams, 'replace'>) => void;
    /**
     * Returns true if there is a parent route in the route hierarchy to navigate back to.
     * On web, this checks for parent routes (not browser history).
     * On native, this uses react-navigation's canGoBack().
     */
    canGoBack: () => boolean;
    /**
     * Navigate back to the parent route in the route hierarchy.
     * On web, this navigates to the parent path (e.g., /users/123 -> /users).
     * On native, this uses react-navigation's goBack().
     */
    goBack: () => void;
};