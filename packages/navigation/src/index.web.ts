// Web-specific exports
export * from './index';

// Direct export to fix module resolution
export { NavigatorProvider, useNavigator } from './context/NavigatorContext.web';

// [DEVCONTAINER FIX] Explicit hook exports to fix Vite re-export resolution
// When Vite processes `export * from './index'` -> `export * from './hooks'`,
// it doesn't apply .web extension priority for nested re-exports.
// This explicit export ensures useParams is available from @idealyst/navigation.
export { useParams } from './hooks/useParams.web';
