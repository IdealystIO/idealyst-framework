// Web-specific exports
export * from './index';

// Direct export to fix module resolution
export { NavigatorProvider, useNavigator } from './context/NavigatorContext.web';

// Re-export React Router components to ensure single instance
export { Outlet } from 'react-router';