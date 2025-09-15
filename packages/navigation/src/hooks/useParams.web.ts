import { useParams as useReactRouterParams } from 'react-router';

/**
 * Custom useParams hook that wraps React Router's useParams
 * This ensures we're accessing the correct React Router context
 */
export const useParams = (): Record<string, string> => {
    const params = useReactRouterParams();
    return params || {};
};