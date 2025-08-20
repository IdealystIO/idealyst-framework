# @idealyst/navigation - LLM Documentation

This file provides comprehensive navigation documentation for LLMs working with the @idealyst/navigation library.

## Library Overview

@idealyst/navigation is a cross-platform navigation library with:
- Unified API for React and React Native
- Built on React Navigation (Native) and React Router (Web)
- 4 layout types: stack, tab, drawer, modal
- Theme system integration
- Complete working examples for quick start

## Quick Start with Examples

The fastest way to get started is using pre-built example routers:

```tsx
import { NavigatorProvider } from '@idealyst/navigation';
import { ExampleStackRouter } from '@idealyst/navigation/examples';

// Instant working app with header, sidebar, and component examples
<NavigatorProvider route={ExampleStackRouter} />
```

## Core Components

### NavigatorProvider
Root provider that wraps the entire app:

```tsx
<NavigatorProvider route={routeConfig}>
  {/* App content handled by router */}
</NavigatorProvider>
```

### useNavigator Hook
Access navigation from any component:

```tsx
import { useNavigator } from '@idealyst/navigation';

const navigator = useNavigator();
navigator.navigate({ path: "/profile", vars: { id: "123" } });
```

## Route Configuration

Define app navigation structure with `RouteParam`:

```tsx
const AppRouter: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: { type: "stack" }, // "stack" | "tab" | "drawer" | "modal"
  routes: [
    { path: "profile", component: ProfileScreen },
    { path: "settings", component: SettingsScreen },
  ],
};
```

## Layout Types

### Stack Layout
Linear navigation (most common):
```tsx
layout: { type: "stack" }
```
- **Use for**: Most mobile apps, hierarchical navigation
- **Platform**: Native stack (RN), browser history (Web)

### Tab Layout  
Section-based navigation:
```tsx
layout: { type: "tab" }
```
- **Use for**: Main app sections, content browsing
- **Platform**: Bottom tabs (RN), top/side tabs (Web)

### Drawer Layout
Side menu navigation:
```tsx
layout: { type: "drawer" }
```
- **Use for**: Desktop apps, admin panels
- **Platform**: Gesture drawer (RN), sidebar (Web)

### Modal Layout
Overlay navigation:
```tsx
layout: { type: "modal" }
```
- **Use for**: Forms, dialogs, temporary content
- **Platform**: Modal presentation (RN), overlay (Web)

## Navigation Patterns

### Basic Navigation
```tsx
const navigator = useNavigator();
navigator.navigate({ path: "/settings", vars: {} });
```

### With Parameters
```tsx
navigator.navigate({ 
  path: "/user/:id", 
  vars: { id: "123" } 
});
```

### Nested Routes
```tsx
const router: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: { type: "stack" },
  routes: [
    {
      path: "dashboard",
      component: DashboardScreen,
      layout: { type: "tab" },
      routes: [
        { path: "analytics", component: AnalyticsScreen },
        { path: "reports", component: ReportsScreen },
      ],
    },
  ],
};
```

## GeneralLayout Component

Flexible layout with header and sidebar:

```tsx
import { GeneralLayout } from '@idealyst/navigation';

<GeneralLayout
  header={{
    enabled: true,
    content: <Text>My App</Text>,
  }}
  sidebar={{
    enabled: true,
    collapsible: true,
    position: 'left',
    content: <NavigationMenu />,
  }}
>
  {children}
</GeneralLayout>
```

### Header Configuration
- `enabled`: Show/hide header
- `height`: Header height (pixels)
- `content`: Header content (React component)
- `style`: Custom styles

### Sidebar Configuration
- `enabled`: Show/hide sidebar
- `collapsible`: Allow collapse/expand
- `position`: 'left' or 'right'
- `initiallyExpanded`: Initial state
- `expandedWidth`/`collapsedWidth`: Sidebar widths
- `content`: Sidebar content (React component)

## Example Routers (Quick Start)

### ExampleStackRouter
Desktop/web app with header and sidebar:
```tsx
import { ExampleStackRouter } from '@idealyst/navigation/examples';
<NavigatorProvider route={ExampleStackRouter} />
```

**Features**: Header, collapsible sidebar, theme controls, all component examples

### ExampleTabRouter  
Mobile app with tab navigation:
```tsx
import { ExampleTabRouter } from '@idealyst/navigation/examples';
<NavigatorProvider route={ExampleTabRouter} />
```

**Features**: Tab navigation, component examples, theme controls

### ExampleDrawerRouter
Desktop app with drawer menu:
```tsx
import { ExampleDrawerRouter } from '@idealyst/navigation/examples';
<NavigatorProvider route={ExampleDrawerRouter} />
```

**Features**: Slide-out drawer, organized navigation, component examples

## Theme Integration

All navigation components integrate with @idealyst/theme:

```tsx
// Theme switching works automatically
import { UnistylesRuntime } from 'react-native-unistyles';
UnistylesRuntime.setTheme('dark');
UnistylesRuntime.setTheme('lightHighContrast');
```

### Theme Utilities
```tsx
import { 
  getNextTheme, 
  getThemeDisplayName, 
  isHighContrastTheme 
} from '@idealyst/navigation/examples/unistyles';
```

## Custom Layouts

Create custom layout components:

```tsx
const CustomLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <GeneralLayout
    header={{ content: <CustomHeader /> }}
    sidebar={{ content: <CustomSidebar /> }}
  >
    {children}
  </GeneralLayout>
);

const router: RouteParam = {
  layout: { type: "stack", component: CustomLayout },
  // ...
};
```

## Common Patterns

### Dashboard Layout
```tsx
<GeneralLayout
  header={{
    content: (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text size="large" weight="bold">Dashboard</Text>
        <UserMenu />
      </View>
    ),
  }}
  sidebar={{
    enabled: true,
    collapsible: true,
    content: <NavigationMenu />,
  }}
>
  {children}
</GeneralLayout>
```

### Mobile App Structure
```tsx
const MobileRouter: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: { type: "tab" },
  routes: [
    { path: "feed", component: FeedScreen },
    { path: "search", component: SearchScreen },
    { path: "profile", component: ProfileScreen },
  ],
};
```

### Admin Interface
```tsx
const AdminRouter: RouteParam = {
  path: "/admin",
  component: AdminDashboard,
  layout: { 
    type: "drawer",
    component: AdminLayout,
  },
  routes: [
    { path: "users", component: UserManagement },
    { path: "settings", component: AdminSettings },
  ],
};
```

## Route Guards and Conditional Navigation

```tsx
const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <LoginScreen />;
};

const router: RouteParam = {
  path: "/dashboard",
  component: ProtectedRoute,
  routes: [
    // Protected routes here
  ],
};
```

## Platform Differences

### React Native
- Uses React Navigation internally
- Native animations and gestures
- Hardware back button support
- Bottom tab navigation

### Web
- Uses React Router internally
- Browser URL integration
- Keyboard navigation
- Top tab or sidebar navigation

The API remains identical across platforms.

## Best Practices for LLMs

1. **Start with examples** - Use ExampleStackRouter, ExampleTabRouter, or ExampleDrawerRouter
2. **Choose appropriate layouts** - Stack for mobile, tabs for sections, drawer for desktop
3. **Use GeneralLayout** for header/sidebar layouts
4. **Keep routes shallow** - Avoid deeply nested structures  
5. **Leverage theme integration** - Components automatically adapt to theme changes
6. **Test cross-platform** - Verify navigation works on both React and React Native

## File-Based Documentation Access

Complete documentation is available as markdown files:

```bash
# Main overview
README.md

# Component-specific documentation  
src/context/README.md          # Navigation context and providers
src/routing/README.md          # Core routing system
src/layouts/GeneralLayout/README.md  # Layout component
src/examples/README.md         # Example routers and quick start

# LLM-optimized reference
CLAUDE.md                      # This file
```

## Import Patterns

```tsx
// Core navigation
import { NavigatorProvider, useNavigator } from '@idealyst/navigation';

// Layout components
import { GeneralLayout } from '@idealyst/navigation';

// Example routers (quick start)
import { 
  ExampleStackRouter, 
  ExampleTabRouter, 
  ExampleDrawerRouter 
} from '@idealyst/navigation/examples';

// Theme utilities
import { getNextTheme } from '@idealyst/navigation/examples/unistyles';
```

## TypeScript Support

Full type safety for navigation:

```tsx
// Route configuration is typed
const router: RouteParam = {
  path: "/users/:id",
  component: UserScreen,
  // TypeScript validates structure
};

// Navigation is type-safe
type NavigateParams = {
  path: string;
  vars: Record<string, string>;
};
```

## Quick Reference

### Essential Imports
```tsx
import { NavigatorProvider, useNavigator } from '@idealyst/navigation';
import { ExampleStackRouter } from '@idealyst/navigation/examples';
```

### Minimal Setup
```tsx
<NavigatorProvider route={ExampleStackRouter} />
```

### Navigation Usage
```tsx
const navigator = useNavigator();
navigator.navigate({ path: "/route", vars: {} });
```

### Custom Layout
```tsx
<GeneralLayout header={{...}} sidebar={{...}}>
  {children}
</GeneralLayout>
```

This provides everything needed to build sophisticated cross-platform navigation experiences with minimal code.