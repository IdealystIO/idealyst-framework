import { RouteParam } from "../routing";

/**
 * When navigating to a new route, specify the path and the variables to be used in the route.
 */
export type NavigateParams = {
    path: string;
    vars: Record<string, string>;
};

export type NavigatorProviderProps = {
    route: RouteParam;
};