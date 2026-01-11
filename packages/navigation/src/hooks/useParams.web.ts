import { useParams as useReactRouterParams } from '../router';

/**
 * Custom useParams hook that wraps React Router's useParams
 * This ensures we're accessing the correct React Router context
 */
export const useParams = (): Record<string, string | undefined> => {
    const params = useReactRouterParams();
    return params || {};
};