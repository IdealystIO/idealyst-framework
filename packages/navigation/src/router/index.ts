// Export all React Router modules from a centralized location
// This prevents duplication issues when multiple packages need React Router

// Re-export everything from react-router-dom
// This includes all react-router exports plus the DOM-specific ones
import {
    BrowserRouter,
    HashRouter,
    MemoryRouter,
    Router,
    useNavigate,
    useLocation,
    useParams,
    useSearchParams,
    Navigate,
    Outlet,
    Route,
    Routes,
    Link,
    NavLink
} from 'react-router-dom'


export {   
    BrowserRouter,
    HashRouter,
    MemoryRouter,
    Router,
    useNavigate,
    useLocation,
    useParams,
    useSearchParams,
    Navigate,
    Outlet,
    Route,
    Routes,
    Link,
    NavLink
};