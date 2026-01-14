// Native-specific exports
export * from './context';
export * from './layouts';
export * from './routing';
export * from './hooks';
export { Linking } from './linking/index.native';

// Outlet is a web-only concept (React Router).
// On native, we export a no-op component that renders nothing.
// This allows shared code to import Outlet without platform checks.
export { Outlet } from './router/index.native';