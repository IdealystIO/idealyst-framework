# Navigation Context

The navigation context system provides a unified API for navigation across React and React Native platforms.

## Features

- ✅ Cross-platform navigation API
- ✅ Type-safe navigation parameters
- ✅ React Context-based state management
- ✅ Route variable support
- ✅ Automatic platform detection

## Core Components

### NavigatorProvider

The root provider that wraps your entire application and provides navigation context.

```tsx
import { NavigatorProvider } from '@idealyst/navigation';
import { RouteParam } from '@idealyst/navigation';

const AppRouter: RouteParam = {
  path: "/",
  component: HomeScreen,
  routes: [
    { path: "profile", component: ProfileScreen },
    { path: "settings", component: SettingsScreen },
  ],
};

export default function App() {
  return (
    <NavigatorProvider route={AppRouter}>
      {/* Your app content */}
    </NavigatorProvider>
  );
}
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `route` | `RouteParam` | ✅ | Root route configuration |
| `children` | `ReactNode` | - | App content (usually not needed as router handles content) |

### useNavigator Hook

Access navigation functionality from any component within the NavigatorProvider.

```tsx
import { useNavigator } from '@idealyst/navigation';

function MyComponent() {
  const navigator = useNavigator();

  const handleNavigate = () => {
    navigator.navigate({
      path: "/profile",
      vars: { userId: "123" },
    });
  };

  return (
    <Button onPress={handleNavigate}>
      Go to Profile
    </Button>
  );
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `navigate` | `(params: NavigateParams) => void` | Navigate to a new route |

## Navigation Parameters

### NavigateParams

```tsx
type NavigateParams = {
  path: string;                    // Route path to navigate to
  vars: Record<string, string>;    // Variables to pass to the route
};
```

#### Examples

```tsx
// Simple navigation
navigator.navigate({
  path: "/settings",
  vars: {},
});

// Navigation with parameters
navigator.navigate({
  path: "/user/:id",
  vars: { id: "123" },
});

// Navigation with multiple parameters
navigator.navigate({
  path: "/product/:category/:id",
  vars: { 
    category: "electronics", 
    id: "laptop-123" 
  },
});
```

## Route Configuration

### RouteParam

The core route configuration object used throughout the navigation system.

```tsx
type RouteParam = {
  path?: string;                   // Route path (optional for root)
  routes?: RouteParam[];           // Child routes
  component: React.ComponentType;  // Component to render for this route
  layout?: LayoutParam;            // Layout configuration
};
```

### LayoutParam

Configure the layout type and optional custom layout component.

```tsx
type LayoutParam = {
  type: LayoutType;                                                    // Layout type
  component?: React.ComponentType<{ children?: React.ReactNode }>;     // Custom layout component
};

type LayoutType = 'stack' | 'tab' | 'drawer' | 'modal';
```

## Usage Examples

### Basic Navigation Setup

```tsx
import React from 'react';
import { NavigatorProvider, useNavigator } from '@idealyst/navigation';
import { Button, Screen, Text } from '@idealyst/components';

// Screens
const HomeScreen = () => {
  const navigator = useNavigator();
  
  return (
    <Screen>
      <Text size="large" weight="bold">Home</Text>
      <Button onPress={() => navigator.navigate({ path: "/about", vars: {} })}>
        Go to About
      </Button>
    </Screen>
  );
};

const AboutScreen = () => (
  <Screen>
    <Text size="large" weight="bold">About</Text>
    <Text>This is the about page</Text>
  </Screen>
);

// Route configuration
const AppRouter: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: { type: "stack" },
  routes: [
    { path: "about", component: AboutScreen },
  ],
};

// App setup
export default function App() {
  return (
    <NavigatorProvider route={AppRouter}>
      {/* Router handles all content rendering */}
    </NavigatorProvider>
  );
}
```

### Navigation with Parameters

```tsx
const UserListScreen = () => {
  const navigator = useNavigator();
  const users = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ];

  return (
    <Screen>
      <Text size="large" weight="bold">Users</Text>
      {users.map(user => (
        <Button
          key={user.id}
          onPress={() => navigator.navigate({
            path: "/user/:id",
            vars: { id: user.id }
          })}
        >
          {user.name}
        </Button>
      ))}
    </Screen>
  );
};

const UserDetailScreen = () => {
  // Access route parameters through context or props
  return (
    <Screen>
      <Text size="large" weight="bold">User Details</Text>
      {/* User details content */}
    </Screen>
  );
};

const AppRouter: RouteParam = {
  path: "/",
  component: UserListScreen,
  routes: [
    { path: "user/:id", component: UserDetailScreen },
  ],
};
```

### Nested Routes with Different Layouts

```tsx
const DashboardRouter: RouteParam = {
  path: "/",
  component: DashboardHome,
  layout: { type: "stack" },
  routes: [
    {
      path: "analytics",
      component: AnalyticsSection,
      layout: { type: "tab" },
      routes: [
        { path: "overview", component: AnalyticsOverview },
        { path: "reports", component: AnalyticsReports },
        { path: "insights", component: AnalyticsInsights },
      ],
    },
    {
      path: "settings",
      component: SettingsScreen,
      layout: { type: "modal" },
    },
  ],
};
```

## Platform Differences

### React Native
- Uses React Navigation's navigation context internally
- Supports hardware back button
- Native navigation animations and gestures

### Web
- Uses React Router's navigation context internally  
- Browser URL integration
- Browser back/forward button support

The navigation context API remains identical across platforms.

## Best Practices

1. **Single NavigatorProvider**: Use only one NavigatorProvider at your app root
2. **Route Organization**: Keep route configurations organized and well-typed
3. **Parameter Validation**: Validate route parameters in target components
4. **Error Handling**: Handle navigation errors gracefully
5. **Deep Linking**: Design routes with deep linking in mind
6. **Testing**: Test navigation flows on both platforms

## TypeScript Support

The navigation context is fully typed for safety and developer experience:

```tsx
// All navigation parameters are type-checked
navigator.navigate({
  path: "/user/:id",
  vars: { id: userId }, // TypeScript ensures this matches the route pattern
});

// Route configurations are validated
const router: RouteParam = {
  path: "/",
  component: HomeScreen, // Must be a valid React component
  routes: [], // Array of RouteParam objects
};
```

## Error Handling

```tsx
const MyComponent = () => {
  const navigator = useNavigator();

  const handleNavigate = async () => {
    try {
      navigator.navigate({
        path: "/some-route",
        vars: { param: "value" },
      });
    } catch (error) {
      console.error('Navigation failed:', error);
      // Handle navigation error
    }
  };

  return <Button onPress={handleNavigate}>Navigate</Button>;
};
```