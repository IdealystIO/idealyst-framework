/**
 * Cross-platform location type matching React Router's Location interface.
 * Used by useLocation hook on both web and native.
 */
export interface Location {
    /** The current pathname (e.g., '/users/123') */
    pathname: string;
    /** The query string (e.g., '?foo=bar') - empty string on native */
    search: string;
    /** The URL hash (e.g., '#section') - empty string on native */
    hash: string;
    /** State passed during navigation */
    state: unknown;
    /** Unique key for this location */
    key: string;
}
