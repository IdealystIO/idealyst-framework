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
};

export type NavigatorProviderProps = {
    route: NavigatorParam;
    _overrideNavigation?: any; // Used in the drawer navigator which has to provide its own navigation object
};

/**
 * Context value that includes navigation function and current route parameters
 */
export type NavigatorContextValue = {
    route: NavigatorParam | undefined;
    navigate: (params: NavigateParams) => void;
};