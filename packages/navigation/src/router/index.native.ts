// Native platforms don't use React Router
// This is a stub to maintain cross-platform compatibility

import { useRoute } from '@react-navigation/native';
import type { Location } from './types';

export type { Location };

export const BrowserRouter = null;
export const HashRouter = null;
export const MemoryRouter = null;
export const Router = null;
export const useNavigate = () => null;

/**
 * Cross-platform useLocation hook.
 * On native, returns a location-like object derived from React Navigation's route.
 */
export const useLocation = (): Location => {
    const route = useRoute();
    return {
        pathname: route.path ?? route.name ?? '',
        search: '',
        hash: '',
        state: route.params ?? null,
        key: route.key,
    };
};

export const useParams = () => null;
export const useSearchParams = () => null;
export const Navigate = null;
export const Route = null;
export const Routes = null;
export const Link = null;
export const NavLink = null;

/**
 * Outlet is a web-only concept from React Router.
 * On native, this is a no-op component that renders nothing.
 * This allows shared code to import Outlet without platform checks.
 */
export const Outlet = (): null => null;