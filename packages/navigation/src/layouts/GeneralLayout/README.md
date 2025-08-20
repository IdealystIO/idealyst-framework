# GeneralLayout Component

A flexible, responsive layout component with configurable header and sidebar support, perfect for desktop applications and admin interfaces.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Configurable header with custom content
- ✅ Collapsible sidebar with left/right positioning
- ✅ Responsive design with breakpoint support
- ✅ Theme integration with @idealyst/theme
- ✅ TypeScript support with comprehensive prop types

## Basic Usage

```tsx
import { GeneralLayout } from '@idealyst/navigation';
import { Text, Button } from '@idealyst/components';

<GeneralLayout
  header={{
    enabled: true,
    content: <Text>My Application</Text>,
  }}
  sidebar={{
    enabled: true,
    content: <NavigationMenu />,
  }}
>
  <MainContent />
</GeneralLayout>
```

## Props

### GeneralLayoutProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Main content to display in the layout |
| `header` | `HeaderConfig` | - | Header configuration object |
| `sidebar` | `SidebarConfig` | - | Sidebar configuration object |
| `style` | `ViewStyle` | - | Additional styles for the layout container |
| `testID` | `string` | - | Test identifier for testing |

## Header Configuration

### HeaderConfig

Configure the layout header with custom content and styling.

```tsx
interface HeaderConfig {
  enabled?: boolean;      // Show/hide header
  height?: number;        // Header height in pixels
  content?: ReactNode;    // Header content
  style?: any;           // Custom header styles
}
```

### Header Examples

```tsx
// Basic header
<GeneralLayout
  header={{
    enabled: true,
    content: <Text size="large" weight="bold">Dashboard</Text>,
  }}
>
  {children}
</GeneralLayout>

// Header with navigation and actions
<GeneralLayout
  header={{
    enabled: true,
    height: 64,
    content: (
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16 
      }}>
        <Text size="large" weight="bold">My App</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button variant="outlined" size="small">Settings</Button>
          <Button variant="contained" size="small">Profile</Button>
        </View>
      </View>
    ),
    style: { 
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
    },
  }}
>
  {children}
</GeneralLayout>

// Responsive header
<GeneralLayout
  header={{
    enabled: true,
    content: (
      <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}>
        <Text size="large" weight="bold">Dashboard</Text>
        {/* Show different content based on screen size */}
        <View style={{ flexDirection: 'row' }}>
          <Button size="small">Action</Button>
        </View>
      </View>
    ),
  }}
>
  {children}
</GeneralLayout>
```

## Sidebar Configuration

### SidebarConfig

Configure a collapsible sidebar with custom content and behavior.

```tsx
interface SidebarConfig {
  enabled?: boolean;           // Show/hide sidebar
  initiallyExpanded?: boolean; // Initial expanded state
  expandedWidth?: number;      // Width when expanded (pixels)
  collapsedWidth?: number;     // Width when collapsed (pixels)
  collapsible?: boolean;       // Allow collapse/expand
  position?: 'left' | 'right'; // Sidebar position
  content?: ReactNode;         // Sidebar content
  style?: any;                // Custom sidebar styles
}
```

### Sidebar Examples

```tsx
// Basic sidebar
<GeneralLayout
  sidebar={{
    enabled: true,
    content: (
      <View style={{ padding: 16 }}>
        <Text weight="bold">Navigation</Text>
        <Button variant="text">Dashboard</Button>
        <Button variant="text">Analytics</Button>
        <Button variant="text">Settings</Button>
      </View>
    ),
  }}
>
  {children}
</GeneralLayout>

// Collapsible sidebar
<GeneralLayout
  sidebar={{
    enabled: true,
    collapsible: true,
    initiallyExpanded: false,
    expandedWidth: 250,
    collapsedWidth: 60,
    position: 'left',
    content: <NavigationSidebar />,
  }}
>
  {children}
</GeneralLayout>

// Right-positioned sidebar
<GeneralLayout
  sidebar={{
    enabled: true,
    position: 'right',
    expandedWidth: 300,
    content: (
      <View style={{ padding: 16 }}>
        <Text weight="bold">Inspector</Text>
        <Text>Properties and details</Text>
      </View>
    ),
  }}
>
  {children}
</GeneralLayout>

// Styled sidebar
<GeneralLayout
  sidebar={{
    enabled: true,
    collapsible: true,
    content: <CustomNavigation />,
    style: {
      backgroundColor: '#f8f9fa',
      borderRightWidth: 1,
      borderRightColor: '#e9ecef',
    },
  }}
>
  {children}
</GeneralLayout>
```

## Complete Layout Examples

### Dashboard Layout

```tsx
import { GeneralLayout } from '@idealyst/navigation';
import { Text, Button, View, Icon } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigator = useNavigator();

  return (
    <GeneralLayout
      header={{
        enabled: true,
        height: 64,
        content: (
          <View style={{ 
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
            <Text size="large" weight="bold" color="inverse">
              Dashboard
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button variant="outlined" size="small">
                <Icon name="bell" size="small" />
              </Button>
              <Button variant="contained" size="small">
                Profile
              </Button>
            </View>
          </View>
        ),
      }}
      sidebar={{
        enabled: true,
        collapsible: true,
        initiallyExpanded: true,
        expandedWidth: 240,
        collapsedWidth: 60,
        position: 'left',
        content: (
          <View style={{ padding: 16, gap: 8 }}>
            <Text weight="bold" size="small" color="secondary">
              NAVIGATION
            </Text>
            <Button 
              variant="text" 
              onPress={() => navigator.navigate({ path: "/dashboard", vars: {} })}
            >
              <Icon name="home" size="small" />
              Dashboard
            </Button>
            <Button 
              variant="text"
              onPress={() => navigator.navigate({ path: "/analytics", vars: {} })}
            >
              <Icon name="chart-line" size="small" />
              Analytics
            </Button>
            <Button 
              variant="text"
              onPress={() => navigator.navigate({ path: "/settings", vars: {} })}
            >
              <Icon name="settings" size="small" />
              Settings
            </Button>
          </View>
        ),
      }}
    >
      {children}
    </GeneralLayout>
  );
};
```

### Admin Interface Layout

```tsx
const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <GeneralLayout
      header={{
        enabled: true,
        content: (
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Button 
                variant="text"
                onPress={() => setIsSidebarExpanded(!isSidebarExpanded)}
              >
                <Icon name="menu" />
              </Button>
              <Text size="large" weight="bold">Admin Panel</Text>
            </View>
            <UserMenu />
          </View>
        ),
      }}
      sidebar={{
        enabled: true,
        collapsible: true,
        initiallyExpanded: isSidebarExpanded,
        expandedWidth: 280,
        collapsedWidth: 0,
        content: <AdminNavigation />,
      }}
    >
      {children}
    </GeneralLayout>
  );
};
```

### Content Editor Layout

```tsx
const EditorLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <GeneralLayout
      header={{
        enabled: true,
        height: 48,
        content: (
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            gap: 12,
          }}>
            <Text weight="bold">Document Editor</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Button variant="text" size="small">
                <Icon name="save" size="small" />
              </Button>
              <Button variant="text" size="small">
                <Icon name="undo" size="small" />
              </Button>
              <Button variant="text" size="small">
                <Icon name="redo" size="small" />
              </Button>
            </View>
          </View>
        ),
      }}
      sidebar={{
        enabled: true,
        position: 'right',
        expandedWidth: 300,
        content: (
          <View style={{ padding: 16 }}>
            <Text weight="bold">Properties</Text>
            <PropertyPanel />
          </View>
        ),
      }}
    >
      {children}
    </GeneralLayout>
  );
};
```

## Responsive Behavior

The GeneralLayout automatically adapts to different screen sizes:

### Mobile (< 768px)
- Header remains fixed at top
- Sidebar collapses to overlay mode
- Touch gestures enable sidebar open/close

### Tablet (768px - 1024px)  
- Header and sidebar both visible
- Sidebar can be collapsed to save space
- Content adapts to remaining space

### Desktop (> 1024px)
- Full header and sidebar layout
- Sidebar typically expanded by default
- Maximum content real estate

## State Management

The GeneralLayout includes built-in state management for sidebar collapse/expand:

```tsx
// Internal state automatically manages:
// - Sidebar expanded/collapsed state
// - Responsive breakpoint handling
// - Animation transitions
// - Content area sizing
```

## Styling and Theming

The layout integrates with @idealyst/theme for consistent styling:

```tsx
// Custom styling
<GeneralLayout
  header={{
    content: <HeaderContent />,
    style: {
      backgroundColor: theme.colors.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.subtle,
    },
  }}
  sidebar={{
    content: <SidebarContent />,
    style: {
      backgroundColor: theme.colors.surface.secondary,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border.subtle,
    },
  }}
  style={{
    backgroundColor: theme.colors.background.primary,
  }}
>
  {children}
</GeneralLayout>
```

## Accessibility

The GeneralLayout includes built-in accessibility features:

- Proper focus management for sidebar toggle
- Keyboard navigation support
- Screen reader compatibility
- Touch target sizing for mobile
- Semantic HTML structure (web)

## Best Practices

1. **Keep Headers Simple**: Use headers for navigation and key actions only
2. **Sidebar Content**: Organize sidebar content with clear hierarchy
3. **Responsive Design**: Test layout across different screen sizes
4. **Performance**: Avoid complex content in collapsible sidebars
5. **Accessibility**: Ensure keyboard navigation works throughout
6. **Theme Consistency**: Use theme colors and spacing for visual consistency

## Usage with Navigation Routes

```tsx
import { GeneralLayout } from '@idealyst/navigation';
import { RouteParam } from '@idealyst/navigation';

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <GeneralLayout
    header={{ enabled: true, content: <AppHeader /> }}
    sidebar={{ enabled: true, content: <AppSidebar /> }}
  >
    {children}
  </GeneralLayout>
);

const AppRouter: RouteParam = {
  path: "/",
  component: DashboardScreen,
  layout: {
    type: "stack",
    component: AppLayout,
  },
  routes: [
    { path: "analytics", component: AnalyticsScreen },
    { path: "settings", component: SettingsScreen },
  ],
};
```