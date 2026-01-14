import { useLocation } from '../router';

/**
 * Hook to get the current path the user is on.
 * On web, returns the current pathname from React Router.
 *
 * @returns The current pathname (e.g., '/users/123')
 *
 * @example
 * const currentPath = useCurrentPath();
 * console.log(currentPath); // '/dashboard'
 */
export const useCurrentPath = (): string => {
    const location = useLocation();
    return location?.pathname ?? '/';
};
