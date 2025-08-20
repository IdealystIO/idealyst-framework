# @idealyst/navigation

A comprehensive, cross-platform navigation library for React and React Native applications. Built on top of React Navigation (Native) and React Router (Web) with a unified API and theming system.

## Features

- 🌐 **Cross-Platform**: Works seamlessly in React and React Native
- 🧭 **Unified API**: Same navigation code works on web and mobile
- 🎨 **Theme Integration**: Built-in support for @idealyst/theme system
- 📱 **Multiple Layout Types**: Stack, Tab, Drawer, and Modal navigation
- 🎯 **Type-Safe**: Full TypeScript support with route type safety
- 🏗️ **Layout System**: Flexible layout components for complex UIs
- 📦 **Ready-to-Use Examples**: Complete router implementations to get started quickly

## Installation

```bash
# Using Yarn (recommended)
yarn add @idealyst/navigation

# Using npm
npm install @idealyst/navigation
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
# Core dependencies
yarn add @idealyst/components @idealyst/theme react-native-unistyles

# For React Native projects
yarn add @react-navigation/native @react-navigation/native-stack
yarn add @react-navigation/bottom-tabs @react-navigation/drawer
yarn add react-native-screens react-native-safe-area-context
yarn add react-native-gesture-handler react-native-reanimated

# For React/Web projects  
yarn add react-router react-router-dom
```

## Quick Start

The fastest way to get started is using the pre-built example routers:

### Stack Navigation (Recommended for most apps)

```tsx
import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { ExampleStackRouter } from '@idealyst/navigation/examples';

export default function App() {
  return (
    <NavigatorProvider route={ExampleStackRouter}>
      {/* Your app content will be handled by the router */}
    </NavigatorProvider>
  );
}
```

### Tab Navigation (Great for mobile apps)

```tsx
import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { ExampleTabRouter } from '@idealyst/navigation/examples';

export default function App() {
  return (
    <NavigatorProvider route={ExampleTabRouter}>
      {/* Tab navigation with component examples */}
    </NavigatorProvider>
  );
}
```

### Drawer Navigation (Perfect for desktop/web)

```tsx
import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { ExampleDrawerRouter } from '@idealyst/navigation/examples';

export default function App() {
  return (
    <NavigatorProvider route={ExampleDrawerRouter}>
      {/* Drawer navigation with sidebar */}
    </NavigatorProvider>
  );
}
```

## Core Concepts

### Route Configuration

Routes are defined using a declarative configuration object:

```tsx
import { RouteParam } from '@idealyst/navigation';

const AppRouter: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: {
    type: "stack", // "stack" | "tab" | "drawer" | "modal"
    component: CustomLayout, // Optional custom layout component
  },
  routes: [
    { path: "profile", component: ProfileScreen },
    { path: "settings", component: SettingsScreen },
    {
      path: "products",
      component: ProductsScreen,
      routes: [
        { path: ":id", component: ProductDetailScreen },
      ],
    },
  ],
};
```

### Navigation Context

Access navigation functionality from any component:

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

## Layout Types

### Stack Layout
Linear navigation with a navigation stack.

```tsx
const stackConfig = {
  type: "stack" as const,
  component: CustomStackLayout, // Optional
};
```

**Best for**: Most mobile apps, step-by-step flows, hierarchical navigation

### Tab Layout  
Bottom tabs (mobile) or top tabs (web) navigation.

```tsx
const tabConfig = {
  type: "tab" as const,
};
```

**Best for**: Main app sections, dashboard-style apps, content browsing

### Drawer Layout
Side drawer navigation, typically for desktop/web.

```tsx
const drawerConfig = {
  type: "drawer" as const,
};
```

**Best for**: Desktop apps, admin panels, content-heavy applications

### Modal Layout
Overlay modal navigation.

```tsx
const modalConfig = {
  type: "modal" as const,
};
```

**Best for**: Forms, dialogs, temporary content, settings screens

## Layout Components

### GeneralLayout

A flexible layout component with header and sidebar support:

```tsx
import { GeneralLayout } from '@idealyst/navigation';

<GeneralLayout
  header={{
    enabled: true,
    height: 60,
    content: <Text>My App Header</Text>,
  }}
  sidebar={{
    enabled: true,
    collapsible: true,
    position: 'left',
    initiallyExpanded: false,
    expandedWidth: 250,
    collapsedWidth: 60,
    content: <NavigationMenu />,
  }}
>
  {children}
</GeneralLayout>
```

#### Header Configuration
- `enabled`: Show/hide header
- `height`: Header height in pixels
- `content`: Header content (React component)
- `style`: Custom header styles

#### Sidebar Configuration  
- `enabled`: Show/hide sidebar
- `collapsible`: Allow sidebar collapse/expand
- `position`: 'left' or 'right' placement
- `initiallyExpanded`: Initial collapsed state
- `expandedWidth`/`collapsedWidth`: Sidebar widths
- `content`: Sidebar content (React component)
- `style`: Custom sidebar styles

## Examples and Quick Start

The package includes three complete, production-ready router examples:

### Stack Router Example (`ExampleStackRouter`)
- **Layout**: Stack navigation with header and collapsible sidebar
- **Features**: Theme controls, component navigation, responsive design
- **Use Case**: Desktop/web applications, admin dashboards
- **Components**: All @idealyst/components examples integrated

### Tab Router Example (`ExampleTabRouter`)  
- **Layout**: Tab navigation with component sections
- **Features**: Theme controls, organized component browsing
- **Use Case**: Mobile apps, content exploration
- **Components**: Each component gets its own tab

### Drawer Router Example (`ExampleDrawerRouter`)
- **Layout**: Drawer navigation with slide-out menu  
- **Features**: Collapsible navigation, desktop-optimized
- **Use Case**: Desktop applications, admin interfaces
- **Components**: Navigation via drawer menu

### Using Examples as Starting Points

```tsx
// Import any example router
import { ExampleStackRouter } from '@idealyst/navigation/examples';

// Use as-is for quick start
<NavigatorProvider route={ExampleStackRouter} />

// Or customize for your needs
const MyRouter: RouteParam = {
  ...ExampleStackRouter,
  routes: [
    ...ExampleStackRouter.routes,
    { path: "my-custom-screen", component: MyScreen },
  ],
};
```

## Advanced Usage

### Custom Layout Components

Create custom layouts for specific needs:

```tsx
import { GeneralLayoutProps } from '@idealyst/navigation';

const CustomLayout: React.FC<GeneralLayoutProps> = ({ children, ...props }) => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <CustomSidebar />
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </View>
      <CustomFooter />
    </View>
  );
};

// Use in route configuration
const router: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: {
    type: "stack",
    component: CustomLayout,
  },
};
```

### Route Parameters and Variables

Pass data between screens using route variables:

```tsx
// Navigate with variables
navigator.navigate({
  path: "/user/:id",
  vars: { id: "123" },
});

// Access in target component
function UserScreen() {
  const navigator = useNavigator();
  // Access route variables through navigator context
}
```

### Nested Routes

Create complex navigation hierarchies:

```tsx
const AppRouter: RouteParam = {
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
        {
          path: "settings",
          component: SettingsScreen,
          layout: { type: "modal" },
          routes: [
            { path: "profile", component: ProfileSettingsScreen },
            { path: "preferences", component: PreferencesScreen },
          ],
        },
      ],
    },
  ],
};
```

## Theme Integration

The navigation system automatically integrates with @idealyst/theme:

```tsx
import { UnistylesRuntime } from 'react-native-unistyles';

// Theme switching works automatically
UnistylesRuntime.setTheme('dark');

// High contrast themes supported
UnistylesRuntime.setTheme('lightHighContrast');
UnistylesRuntime.setTheme('darkHighContrast');
```

All navigation components and layouts automatically adapt to theme changes.

## TypeScript Support

Full type safety for routes and navigation:

```tsx
// Route configuration is typed
const router: RouteParam = {
  path: "/users/:id",
  component: UserDetailScreen,
  // TypeScript ensures correct structure
};

// Navigation parameters are typed
type NavigateParams = {
  path: string;
  vars: Record<string, string>;
};
```

## Platform Differences

### React Native
- Uses React Navigation under the hood
- Native navigation performance
- Platform-specific animations and gestures
- Hardware back button support

### Web/React
- Uses React Router under the hood  
- Browser navigation integration
- URL-based routing
- Browser back/forward support

The unified API ensures your navigation code works identically on both platforms.

## Best Practices

1. **Start with Examples**: Use the provided example routers as starting points
2. **Choose Appropriate Layouts**: Stack for mobile, tabs for sections, drawer for desktop
3. **Keep Routes Shallow**: Avoid deeply nested route structures
4. **Use Type Safety**: Leverage TypeScript for route definitions
5. **Test Cross-Platform**: Verify navigation works on both web and mobile
6. **Consider Accessibility**: Ensure navigation is keyboard and screen reader accessible
7. **Theme Consistency**: Use the integrated theme system for consistent styling

## API Reference

### Components

| Component | Description | Use Case |
|-----------|-------------|----------|
| `NavigatorProvider` | Root navigation context provider | Wrap your entire app |
| `GeneralLayout` | Flexible layout with header/sidebar | Custom layout implementations |

### Hooks

| Hook | Description | Returns |
|------|-------------|---------|
| `useNavigator()` | Access navigation functionality | `{ navigate }` |

### Types

| Type | Description |
|------|-------------|
| `RouteParam` | Route configuration object |
| `LayoutType` | Layout type union ('stack' \| 'tab' \| 'drawer' \| 'modal') |
| `NavigateParams` | Navigation parameters object |
| `GeneralLayoutProps` | Props for GeneralLayout component |

## Examples Access

Import working examples and theme utilities:

```tsx
// Example routers
import { 
  ExampleStackRouter, 
  ExampleTabRouter, 
  ExampleDrawerRouter 
} from '@idealyst/navigation/examples';

// Theme utilities
import { 
  getNextTheme, 
  getThemeDisplayName, 
  isHighContrastTheme 
} from '@idealyst/navigation/examples/unistyles';
```

## Development

### Building

```bash
# Build the library
yarn build

# Watch for changes during development  
yarn dev
```

### Project Structure

```
packages/navigation/
├── src/
│   ├── context/           # Navigation context and providers
│   ├── routing/           # Core routing logic
│   ├── layouts/           # Layout components
│   │   └── GeneralLayout/ # Flexible layout with header/sidebar
│   └── examples/          # Complete router examples
│       ├── ExampleStackRouter.tsx   # Stack navigation example
│       ├── ExampleTabRouter.tsx     # Tab navigation example
│       ├── ExampleDrawerRouter.tsx  # Drawer navigation example
│       └── unistyles.ts             # Theme utilities
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing patterns and TypeScript conventions
4. Test on both React and React Native platforms
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues, questions, or contributions, please visit our [GitHub repository](https://github.com/your-org/idealyst-framework).