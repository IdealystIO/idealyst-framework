import { useRoute } from '@react-navigation/native';

/**
 * Custom useParams hook for React Native that wraps React Navigation's useRoute
 * Returns the current route parameters
 */
export const useParams = (): Record<string, string> => {
    const route = useRoute();
    return (route.params as Record<string, string>) || {};
};