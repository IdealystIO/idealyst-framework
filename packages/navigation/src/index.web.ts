// Web-specific exports
export * from './index';

// Direct export to fix module resolution
export { NavigatorProvider, useNavigator } from './context/NavigatorContext.web';

// [DEVCONTAINER FIX] Explicit hook exports to fix Vite re-export resolution
// When Vite processes `export * from './index'` -> `export * from './hooks'`,
// it doesn't apply .web extension priority for nested re-exports.
// This explicit export ensures hooks are available from @idealyst/navigation.
export { useParams } from './hooks/useParams.web';
export { useCurrentPath } from './hooks/useCurrentPath.web';
export { useNavigationState } from './hooks/useNavigationState.web';

// Explicit Linking export for web
export { Linking } from './linking/index.web';

// Re-export Outlet from React Router for web (no-op on native)
export { Outlet } from './router/index.web';
