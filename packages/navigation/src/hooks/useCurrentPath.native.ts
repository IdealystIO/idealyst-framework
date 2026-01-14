import { useRoute } from '@react-navigation/native';

/**
 * Hook to get the current path the user is on.
 * On native, returns the route name from React Navigation.
 *
 * @returns The current route path/name (e.g., '/users/123' or 'UserDetail')
 *
 * @example
 * const currentPath = useCurrentPath();
 * console.log(currentPath); // '/dashboard'
 */
export const useCurrentPath = (): string => {
    const route = useRoute();
    return route.path ?? route.name ?? '';
};
