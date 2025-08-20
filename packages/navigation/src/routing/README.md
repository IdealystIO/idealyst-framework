# Routing System

The core routing engine that handles cross-platform navigation with a unified API built on React Navigation (Native) and React Router (Web).

## Features

- ✅ Cross-platform routing (React Navigation + React Router)
- ✅ Unified API across platforms
- ✅ Multiple layout types (stack, tab, drawer, modal)
- ✅ Route parameter support
- ✅ Nested routing capabilities
- ✅ Type-safe route definitions

## Core Concepts

### Route Configuration

Routes are defined using `RouteParam` objects that describe the navigation structure:

```tsx
import { RouteParam } from '@idealyst/navigation';

const AppRouter: RouteParam = {
  path: "/",                     // Route path (optional for root)
  component: HomeScreen,         // Component to render
  layout: {                      // Layout configuration
    type: "stack",               // Layout type
    component: CustomLayout,     // Optional custom layout
  },
  routes: [                      // Child routes
    { path: "about", component: AboutScreen },
    { path: "contact", component: ContactScreen },
  ],
};
```

### Layout Types

The routing system supports four layout types:

#### Stack Layout
Linear navigation with a navigation stack.

```tsx
const stackRouter: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: { type: "stack" },
  routes: [
    { path: "profile", component: ProfileScreen },
    { path: "settings", component: SettingsScreen },
  ],
};
```

**Platform Behavior:**
- **React Native**: Native stack navigator with platform-specific animations
- **Web**: Browser history-based navigation with URL changes

#### Tab Layout
Tab-based navigation for main app sections.

```tsx
const tabRouter: RouteParam = {
  path: "/",
  component: DashboardHome,
  layout: { type: "tab" },
  routes: [
    { path: "analytics", component: AnalyticsScreen },
    { path: "reports", component: ReportsScreen },
    { path: "settings", component: SettingsScreen },
  ],
};
```

**Platform Behavior:**
- **React Native**: Bottom tab navigator with native tab animations
- **Web**: Top or side tab navigation with CSS transitions

#### Drawer Layout
Side drawer navigation, typically for desktop/web applications.

```tsx
const drawerRouter: RouteParam = {
  path: "/",
  component: MainContent,
  layout: { type: "drawer" },
  routes: [
    { path: "dashboard", component: DashboardScreen },
    { path: "analytics", component: AnalyticsScreen },
    { path: "settings", component: SettingsScreen },
  ],
};
```

**Platform Behavior:**
- **React Native**: Drawer navigator with gesture support
- **Web**: Sidebar navigation with responsive behavior

#### Modal Layout
Overlay modal navigation for temporary content.

```tsx
const modalRouter: RouteParam = {
  path: "/",
  component: MainApp,
  layout: { type: "stack" },
  routes: [
    {
      path: "settings",
      component: SettingsScreen,
      layout: { type: "modal" },
    },
  ],
};
```

**Platform Behavior:**
- **React Native**: Modal navigator with native modal presentation
- **Web**: Overlay modal with backdrop and focus management

## Route Parameters

### Dynamic Routes

Define routes with parameters using the `:param` syntax:

```tsx
const router: RouteParam = {
  path: "/",
  component: HomeScreen,
  routes: [
    { path: "user/:id", component: UserDetailScreen },
    { path: "product/:category/:id", component: ProductDetailScreen },
    { path: "search/:query?", component: SearchResultsScreen }, // Optional parameter
  ],
};
```

### Accessing Parameters

```tsx
import { useNavigator } from '@idealyst/navigation';

const UserDetailScreen = () => {
  const navigator = useNavigator();
  
  // Parameters are available through the navigation context
  // Implementation depends on the underlying router (React Navigation/React Router)
  
  return (
    <Screen>
      <Text>User Details</Text>
      {/* Display user details based on route parameters */}
    </Screen>
  );
};
```

### Navigation with Parameters

```tsx
const UserListScreen = () => {
  const navigator = useNavigator();

  const viewUser = (userId: string) => {
    navigator.navigate({
      path: "/user/:id",
      vars: { id: userId },
    });
  };

  return (
    <Screen>
      <Button onPress={() => viewUser("123")}>
        View User 123
      </Button>
    </Screen>
  );
};
```

## Nested Routing

Create complex navigation hierarchies by nesting routes with different layout types:

```tsx
const AppRouter: RouteParam = {
  path: "/",
  component: AppShell,
  layout: { type: "stack" },
  routes: [
    {
      path: "dashboard",
      component: DashboardLayout,
      layout: { type: "tab" },
      routes: [
        { path: "overview", component: OverviewScreen },
        { path: "analytics", component: AnalyticsScreen },
        { path: "reports", component: ReportsScreen },
      ],
    },
    {
      path: "admin",
      component: AdminLayout,
      layout: { type: "drawer" },
      routes: [
        { path: "users", component: UserManagementScreen },
        { path: "settings", component: AdminSettingsScreen },
        {
          path: "system",
          component: SystemScreen,
          layout: { type: "modal" },
          routes: [
            { path: "logs", component: SystemLogsScreen },
            { path: "backup", component: BackupScreen },
          ],
        },
      ],
    },
  ],
};
```

## Custom Layout Components

Override default layouts with custom components:

```tsx
import { GeneralLayout } from '@idealyst/navigation';

const CustomStackLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <GeneralLayout
      header={{
        enabled: true,
        content: <Text>My Custom Header</Text>,
      }}
      sidebar={{
        enabled: true,
        collapsible: true,
        content: <CustomNavigation />,
      }}
    >
      {children}
    </GeneralLayout>
  );
};

const router: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: {
    type: "stack",
    component: CustomStackLayout,
  },
  routes: [
    { path: "about", component: AboutScreen },
  ],
};
```

## Platform-Specific Implementation

### React Native Implementation

The routing system uses React Navigation under the hood:

```tsx
// Simplified internal implementation for React Native
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// The router automatically configures the appropriate navigator
// based on the layout type specified in RouteParam
```

### Web Implementation

The routing system uses React Router under the hood:

```tsx
// Simplified internal implementation for Web
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// The router automatically configures React Router
// based on the route configuration
```

## Advanced Routing Patterns

### Conditional Routes

```tsx
const ConditionalRouter: RouteParam = {
  path: "/",
  component: ({ children }) => {
    const isAuthenticated = useAuth();
    
    if (!isAuthenticated) {
      return <LoginScreen />;
    }
    
    return children;
  },
  layout: { type: "stack" },
  routes: [
    { path: "dashboard", component: DashboardScreen },
    { path: "profile", component: ProfileScreen },
  ],
};
```

### Route Guards

```tsx
const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;
  
  return <>{children}</>;
};

const protectedRouter: RouteParam = {
  path: "/admin",
  component: ProtectedRoute,
  layout: { type: "stack" },
  routes: [
    { path: "users", component: UserManagementScreen },
    { path: "settings", component: AdminSettingsScreen },
  ],
};
```

### Dynamic Route Loading

```tsx
const LazyRoute: React.FC = () => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  
  useEffect(() => {
    // Dynamically import component
    import('./DynamicScreen').then(module => {
      setComponent(() => module.default);
    });
  }, []);
  
  if (!Component) return <LoadingScreen />;
  
  return <Component />;
};

const dynamicRouter: RouteParam = {
  path: "/dynamic",
  component: LazyRoute,
};
```

## Route Configuration Best Practices

1. **Keep Routes Shallow**: Avoid deeply nested route structures
2. **Use Meaningful Paths**: Choose descriptive route paths
3. **Parameter Consistency**: Use consistent parameter naming
4. **Layout Appropriateness**: Choose layout types that match the user experience
5. **Error Boundaries**: Wrap route components in error boundaries
6. **Loading States**: Handle loading states for async route components

## TypeScript Support

The routing system provides full type safety:

```tsx
// Route parameters are type-checked
type UserRouteParams = {
  id: string;
  tab?: 'profile' | 'settings';
};

// Component props can be typed based on route parameters
interface UserScreenProps {
  route: {
    params: UserRouteParams;
  };
}

const UserScreen: React.FC<UserScreenProps> = ({ route }) => {
  const { id, tab } = route.params;
  // TypeScript ensures correct parameter usage
};
```

## Performance Considerations

1. **Lazy Loading**: Use dynamic imports for large route components
2. **Route Memoization**: Memoize route configurations when possible
3. **Navigation Caching**: The router automatically caches navigation state
4. **Bundle Splitting**: Consider code splitting for large route trees

## Debugging

```tsx
// Enable routing debug mode (development only)
const router: RouteParam = {
  path: "/",
  component: HomeScreen,
  // Add debug information to route configuration
  routes: [
    { 
      path: "debug", 
      component: () => {
        console.log('Route rendered: /debug');
        return <DebugScreen />;
      }
    },
  ],
};
```