// Web-specific exports
export * from './index';

// Direct export to fix module resolution
export { NavigatorProvider, useNavigator } from './context/NavigatorContext.web';
