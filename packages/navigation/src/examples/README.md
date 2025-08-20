# Navigation Examples

Pre-built, production-ready router examples that showcase the @idealyst/navigation system and serve as quick-start templates for your applications.

## Features

- ✅ Complete, working router implementations
- ✅ Integration with @idealyst/components examples
- ✅ Theme system demonstrations
- ✅ Multiple layout patterns (Stack, Tab, Drawer)
- ✅ Cross-platform compatibility
- ✅ Ready for customization and extension

## Available Examples

### ExampleStackRouter

A stack-based navigation router with header and collapsible sidebar, perfect for desktop/web applications.

```tsx
import { ExampleStackRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';

export default function App() {
  return (
    <NavigatorProvider route={ExampleStackRouter}>
      {/* Stack navigation with sidebar */}
    </NavigatorProvider>
  );
}
```

**Features:**
- Header with app title
- Collapsible left sidebar with home navigation
- Theme controls (cycle themes, toggle high contrast)
- All component examples integrated
- Responsive design for desktop/web

**Use Cases:**
- Admin dashboards
- Desktop applications
- Content management systems
- Developer tools

### ExampleTabRouter

A tab-based navigation router ideal for mobile applications and content browsing.

```tsx
import { ExampleTabRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';

export default function App() {
  return (
    <NavigatorProvider route={ExampleTabRouter}>
      {/* Tab navigation for component browsing */}
    </NavigatorProvider>
  );
}
```

**Features:**
- Bottom tab navigation (mobile) / top tabs (web)
- Home screen with theme controls
- Individual tabs for each component example
- Clean, focused component demonstrations
- Mobile-optimized user experience

**Use Cases:**
- Mobile applications
- Component galleries
- Content exploration apps
- Multi-section interfaces

### ExampleDrawerRouter

A drawer-based navigation router optimized for desktop interfaces with extensive navigation needs.

```tsx
import { ExampleDrawerRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';

export default function App() {
  return (
    <NavigatorProvider route={ExampleDrawerRouter}>
      {/* Drawer navigation with slide-out menu */}
    </NavigatorProvider>
  );
}
```

**Features:**
- Slide-out drawer navigation
- Organized menu structure
- Desktop-optimized layout
- Gesture support for drawer open/close
- Scalable navigation for large apps

**Use Cases:**
- Enterprise applications
- Complex desktop interfaces
- Multi-module systems
- Admin interfaces with many sections

## Router Structure

### Stack Router Implementation

```tsx
// Simplified structure of ExampleStackRouter
const StackRouter: RouteParam = {
  path: "/",
  component: HomeScreen,          // Main dashboard screen
  layout: {
    type: "stack",
    component: WrappedGeneralLayout, // Custom layout with header/sidebar
  },
  routes: [
    { path: "avatar", component: AvatarExamples },
    { path: "button", component: ButtonExamples },
    { path: "card", component: CardExamples },
    // ... all component examples
    { path: "theme-extension", component: ThemeExtensionExamples },
  ],
};
```

### Tab Router Implementation

```tsx
// Simplified structure of ExampleTabRouter
const TabRouter: RouteParam = {
  path: "/",
  component: HomeTabScreen,      // Welcome screen with theme controls
  layout: {
    type: "tab",                 // Tab layout
  },
  routes: [
    { path: "avatar", component: AvatarTabScreen },
    { path: "button", component: ButtonTabScreen },
    { path: "card", component: CardTabScreen },
    // ... component tabs
  ],
};
```

## Theme Integration

All example routers include comprehensive theme system demonstrations:

### Theme Controls

```tsx
// Available in all example routers
const ThemeControls = () => {
  const currentTheme = UnistylesRuntime.themeName || 'light';
  
  const cycleTheme = () => {
    const nextTheme = getNextTheme(currentTheme);
    UnistylesRuntime.setTheme(nextTheme);
  };

  const toggleHighContrast = () => {
    // Toggle between standard and high contrast variants
    const newTheme = isHighContrastTheme(currentTheme) 
      ? getStandardVariant(currentTheme)
      : getHighContrastVariant(currentTheme);
    UnistylesRuntime.setTheme(newTheme);
  };

  return (
    <View>
      <Button onPress={cycleTheme}>Cycle Theme</Button>
      <Button onPress={toggleHighContrast}>Toggle High Contrast</Button>
    </View>
  );
};
```

### Available Themes

- **light**: Standard light theme
- **dark**: Standard dark theme  
- **lightHighContrast**: High contrast light theme
- **darkHighContrast**: High contrast dark theme

### Theme Utilities

```tsx
import { 
  getNextTheme, 
  getThemeDisplayName, 
  isHighContrastTheme 
} from '@idealyst/navigation/examples/unistyles';

// Cycle through all available themes
const nextTheme = getNextTheme('light'); // Returns 'dark'

// Get human-readable theme name
const displayName = getThemeDisplayName('lightHighContrast'); // "Light High Contrast"

// Check if theme is high contrast variant
const isHighContrast = isHighContrastTheme('darkHighContrast'); // true
```

## Component Integration

All example routers showcase the complete @idealyst/components library:

### Integrated Components

| Component | Example Content |
|-----------|----------------|
| Avatar | Profile pictures, fallbacks, sizes |
| Badge | Notification counts, status indicators |
| Button | Variants, intents, interactions |
| Card | Content containers, clickable cards |
| Checkbox | Form inputs, validation states |
| Divider | Content separation, spacing |
| Icon | Icon library, sizes, colors |
| Input | Text inputs, validation, forms |
| Screen | Full-screen layouts, backgrounds |
| Text | Typography, sizes, weights |
| View | Layout containers, spacing |

### Example Screen Structure

```tsx
// Typical component example screen
const ButtonExamples = () => (
  <Screen>
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Button Component</Text>
      
      <View spacing="md">
        <Text size="large" weight="semibold">Variants</Text>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </View>
      
      <View spacing="md">
        <Text size="large" weight="semibold">Intents</Text>
        <Button intent="primary">Primary</Button>
        <Button intent="success">Success</Button>
        <Button intent="error">Error</Button>
      </View>
    </View>
  </Screen>
);
```

## Customization

Use the example routers as starting points for your own applications:

### Extending Routes

```tsx
import { ExampleStackRouter } from '@idealyst/navigation/examples';

// Add your own routes to an example router
const CustomRouter: RouteParam = {
  ...ExampleStackRouter,
  routes: [
    ...ExampleStackRouter.routes,
    { path: "my-screen", component: MyCustomScreen },
    { path: "another-screen", component: AnotherScreen },
  ],
};
```

### Custom Layout

```tsx
import { GeneralLayout } from '@idealyst/navigation';

const MyCustomLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <GeneralLayout
    header={{
      content: <Text>My Custom App</Text>,
    }}
    sidebar={{
      enabled: true,
      content: <MyNavigation />,
    }}
  >
    {children}
  </GeneralLayout>
);

const CustomRouter: RouteParam = {
  path: "/",
  component: HomeScreen,
  layout: {
    type: "stack",
    component: MyCustomLayout,
  },
  routes: [
    // Your routes here
  ],
};
```

### Replacing Example Components

```tsx
// Replace example components with your own
const ProductionRouter: RouteParam = {
  path: "/",
  component: DashboardScreen,        // Your main screen
  layout: { type: "stack" },
  routes: [
    { path: "users", component: UserManagement },
    { path: "products", component: ProductCatalog },
    { path: "orders", component: OrderTracking },
  ],
};
```

## Development and Testing

The example routers serve as excellent development and testing environments:

### Component Development

```tsx
// Use examples to develop and test new components
import { ExampleStackRouter } from '@idealyst/navigation/examples';

// Add your component to the router for testing
const DevelopmentRouter: RouteParam = {
  ...ExampleStackRouter,
  routes: [
    ...ExampleStackRouter.routes,
    { path: "my-new-component", component: MyNewComponentExamples },
  ],
};
```

### Theme Testing

```tsx
// Test components across all themes using the built-in theme controls
const TestScreen = () => {
  return (
    <Screen>
      <ThemeControls />
      <MyComponentToTest />
    </Screen>
  );
};
```

## Best Practices

1. **Start with Examples**: Use example routers as starting points for new projects
2. **Customize Gradually**: Modify examples incrementally to avoid breaking functionality
3. **Keep Theme Controls**: Maintain theme switching for development and accessibility
4. **Test All Layouts**: Try your content in all three layout types (stack, tab, drawer)
5. **Cross-Platform Testing**: Test examples on both React Native and Web
6. **Component Integration**: Use the component examples as reference implementations

## File Structure

```
src/examples/
├── ExampleStackRouter.tsx     # Stack navigation with sidebar
├── ExampleTabRouter.tsx       # Tab navigation for mobile
├── ExampleDrawerRouter.tsx    # Drawer navigation for desktop
├── unistyles.ts              # Theme utilities and helpers
├── highContrastThemes.ts     # High contrast theme definitions
└── index.ts                  # Export all examples
```

## Import Patterns

```tsx
// Import specific example routers
import { ExampleStackRouter } from '@idealyst/navigation/examples';
import { ExampleTabRouter } from '@idealyst/navigation/examples';
import { ExampleDrawerRouter } from '@idealyst/navigation/examples';

// Import theme utilities
import { 
  getNextTheme, 
  getThemeDisplayName, 
  isHighContrastTheme 
} from '@idealyst/navigation/examples/unistyles';

// Import all examples
import * as NavigationExamples from '@idealyst/navigation/examples';
```