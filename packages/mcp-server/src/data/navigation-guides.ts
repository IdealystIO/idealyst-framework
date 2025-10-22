export const navigationGuides: Record<string, string> = {
  "idealyst://navigation/overview": `# Navigation System Overview

The Idealyst navigation system provides a unified API for both React Native and web applications, handling routing seamlessly across platforms.

## Core Concepts

### Cross-Platform Routing
- **Mobile (React Native)**: Uses React Navigation for native navigation patterns
- **Web**: Uses React Router for browser-based routing
- **Unified API**: Same code works on both platforms

### Route Types

There are two fundamental route types:

#### 1. Screen Routes
Renders a component directly to the screen:
\`\`\`tsx
{
  path: "profile",
  type: 'screen',
  component: ProfileScreen
}
\`\`\`

#### 2. Navigator Routes
Wraps child routes with navigation structure:
\`\`\`tsx
{
  path: "/",
  type: 'navigator',
  layout: 'stack', // or 'tab', 'drawer', 'modal'
  routes: [
    { path: "home", type: 'screen', component: HomeScreen },
    { path: "settings", type: 'screen', component: SettingsScreen },
  ]
}
\`\`\`

## Setup

### Basic Setup

\`\`\`tsx
import { NavigatorProvider } from '@idealyst/navigation';

function App() {
  return (
    <NavigatorProvider route={appRouter}>
      {/* Content managed by router */}
    </NavigatorProvider>
  );
}
\`\`\`

### Quick Start with Examples

Use pre-built example routers for instant working navigation:

\`\`\`tsx
import { ExampleStackRouter } from '@idealyst/navigation/examples';

<NavigatorProvider route={ExampleStackRouter} />
\`\`\`

Available example routers:
- **ExampleStackRouter**: Desktop/web with header and sidebar
- **ExampleTabRouter**: Mobile with tab navigation
- **ExampleDrawerRouter**: Desktop with drawer menu

## Platform Differences

### Mobile (React Native)
- Stack navigator: Native stack navigation with animations
- Tab navigator: Bottom tab bar
- Drawer navigator: Side drawer with gestures
- Modal navigator: Full-screen modal presentation

### Web
- Stack navigator: Browser history-based routing
- Tab navigator: Top or side tab navigation
- All navigators: Use URL paths for routing
- Custom layouts: Can add headers, sidebars, footers

## Key Features

1. **Type-Safe Navigation**: Full TypeScript support
2. **Path Parameters**: \`/user/:id\` support
3. **Nested Routes**: Unlimited nesting depth
4. **Custom Layouts**: Web-specific layout components
5. **Theme Integration**: Works with @idealyst/theme
6. **Cross-Platform**: Write once, run everywhere
`,

  "idealyst://navigation/route-configuration": `# Route Configuration

Learn how to define and structure routes in your Idealyst application.

## Route Definition

### Screen Route

The simplest route type - renders a component:

\`\`\`tsx
import { RouteParam } from '@idealyst/navigation';

const route: RouteParam = {
  path: "profile",
  type: 'screen',
  component: ProfileScreen,
  options: {
    title: "User Profile",
    headerShown: true
  }
};
\`\`\`

### Navigator Route

A route that contains child routes:

\`\`\`tsx
const route: RouteParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  routes: [
    { path: "home", type: 'screen', component: HomeScreen },
    { path: "about", type: 'screen', component: AboutScreen },
  ],
  options: {
    headerShown: false
  }
};
\`\`\`

## Path Configuration

### Basic Paths

\`\`\`tsx
{ path: "home", ... }          // Relative: /parent/home
{ path: "/home", ... }         // Absolute: /home
{ path: "", ... }              // Index route
\`\`\`

### Path Parameters

\`\`\`tsx
{
  path: "user/:id",
  type: 'screen',
  component: UserScreen
}

// Navigate with:
navigator.navigate({
  path: "/user/:id",
  vars: { id: "123" }
});

// Access in component:
const navigator = useNavigator();
const userId = navigator.vars.id;
\`\`\`

### Optional Parameters

\`\`\`tsx
{ path: "search/:query?" }  // query is optional
\`\`\`

## Screen Options

### Common Options

\`\`\`tsx
type ScreenOptions = {
  title?: string;           // Screen title
  headerShown?: boolean;    // Show/hide header (mobile)
};
\`\`\`

### Tab-Specific Options

For tab navigators:

\`\`\`tsx
type TabBarScreenOptions = {
  tabBarIcon?: (props: {
    focused: boolean;
    color: string;
    size: string | number
  }) => React.ReactElement;

  tabBarLabel?: string;     // Tab label
  tabBarBadge?: string | number;  // Badge count
  tabBarVisible?: boolean;  // Show/hide tab
} & ScreenOptions;
\`\`\`

Example:
\`\`\`tsx
{
  path: "home",
  type: 'screen',
  component: HomeScreen,
  options: {
    tabBarLabel: "Home",
    tabBarIcon: ({ focused, color }) => (
      <Icon name="home" color={color} />
    ),
    tabBarBadge: 5
  }
}
\`\`\`

## Navigator Options

Options for navigator routes:

\`\`\`tsx
type NavigatorOptions = {
  headerTitle?: React.ComponentType | React.ReactElement | string;
  headerLeft?: React.ComponentType | React.ReactElement;
  headerBackVisible?: boolean;
  headerRight?: React.ComponentType | React.ReactElement;
  headerShown?: boolean;
};
\`\`\`

Example:
\`\`\`tsx
{
  path: "/app",
  type: 'navigator',
  layout: 'stack',
  routes: [...],
  options: {
    headerTitle: "My App",
    headerShown: true,
    headerRight: <UserMenu />
  }
}
\`\`\`

## Nested Routes

Create hierarchical navigation:

\`\`\`tsx
const appRouter: RouteParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  routes: [
    {
      path: "dashboard",
      type: 'navigator',
      layout: 'tab',
      routes: [
        { path: "overview", type: 'screen', component: OverviewScreen },
        { path: "analytics", type: 'screen', component: AnalyticsScreen },
        { path: "reports", type: 'screen', component: ReportsScreen },
      ]
    },
    {
      path: "settings",
      type: 'screen',
      component: SettingsScreen
    },
  ]
};
\`\`\`

## Full Path Resolution

Full paths are automatically computed:
- \`/dashboard/overview\`
- \`/dashboard/analytics\`
- \`/dashboard/reports\`
- \`/settings\`

## Best Practices

1. **Use relative paths** for child routes
2. **Keep nesting shallow** (3 levels max recommended)
3. **Group related screens** in navigators
4. **Use meaningful paths** that reflect content
5. **Define index routes** with empty path
6. **Set appropriate options** for each screen type
`,

  "idealyst://navigation/navigator-types": `# Navigator Types

Idealyst supports four navigator types: stack, tab, drawer, and modal. Each provides different navigation patterns.

## Stack Navigator

Linear, hierarchical navigation - the most common pattern.

### Configuration

\`\`\`tsx
{
  path: "/app",
  type: 'navigator',
  layout: 'stack',
  routes: [
    { path: "", type: 'screen', component: HomeScreen },
    { path: "profile", type: 'screen', component: ProfileScreen },
    { path: "settings", type: 'screen', component: SettingsScreen },
  ]
}
\`\`\`

### Platform Behavior

**Mobile:**
- Native stack navigation with slide animations
- Hardware back button support
- Swipe-to-go-back gesture

**Web:**
- Browser history integration
- URL updates on navigation
- Back/forward browser buttons work

### Use Cases
- Main app navigation
- Detail views
- Settings flows
- Onboarding sequences

## Tab Navigator

Section-based navigation with a tab bar.

### Configuration

\`\`\`tsx
{
  path: "/",
  type: 'navigator',
  layout: 'tab',
  routes: [
    {
      path: "home",
      type: 'screen',
      component: HomeScreen,
      options: {
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => <Icon name="home" color={color} />
      }
    },
    {
      path: "search",
      type: 'screen',
      component: SearchScreen,
      options: {
        tabBarLabel: "Search",
        tabBarIcon: ({ color }) => <Icon name="search" color={color} />
      }
    },
  ]
}
\`\`\`

### Platform Behavior

**Mobile:**
- Bottom tab bar
- Tab icons and labels
- Badge support
- Active tab highlighting

**Web:**
- Top or side tabs
- Can use custom layout component
- URL-based tab switching

### Use Cases
- Main app sections
- Content categories
- Dashboard views
- Multi-section interfaces

## Drawer Navigator

Side menu navigation, primarily for desktop/tablet.

### Configuration

\`\`\`tsx
{
  path: "/",
  type: 'navigator',
  layout: 'drawer',
  routes: [
    { path: "dashboard", type: 'screen', component: DashboardScreen },
    { path: "users", type: 'screen', component: UsersScreen },
    { path: "settings", type: 'screen', component: SettingsScreen },
  ]
}
\`\`\`

### Platform Behavior

**Mobile:**
- Slide-out drawer
- Swipe gesture to open
- Overlay when open

**Web:**
- Sidebar navigation
- Can be persistent or overlay
- Responsive behavior

### Use Cases
- Admin panels
- Desktop applications
- Content management systems
- Multi-section apps

## Modal Navigator

Overlay navigation for temporary screens.

### Configuration

\`\`\`tsx
{
  path: "/modals",
  type: 'navigator',
  layout: 'modal',
  routes: [
    { path: "new-post", type: 'screen', component: NewPostScreen },
    { path: "edit-profile", type: 'screen', component: EditProfileScreen },
  ]
}
\`\`\`

### Platform Behavior

**Mobile:**
- Full-screen modal presentation
- Slide-up animation
- Close gesture support

**Web:**
- Overlay modal
- Background dimming
- Click-outside to close

### Use Cases
- Forms and data entry
- Action confirmations
- Image viewers
- Temporary content

## Combining Navigator Types

Navigators can be nested for complex flows:

\`\`\`tsx
const appRouter: RouteParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  routes: [
    {
      path: "main",
      type: 'navigator',
      layout: 'tab',
      routes: [
        { path: "feed", type: 'screen', component: FeedScreen },
        { path: "profile", type: 'screen', component: ProfileScreen },
      ]
    },
    {
      path: "modals",
      type: 'navigator',
      layout: 'modal',
      routes: [
        { path: "create", type: 'screen', component: CreateScreen },
      ]
    }
  ]
};
\`\`\`

## Choosing the Right Navigator

| Navigator | Mobile | Desktop | Use Case |
|-----------|--------|---------|----------|
| **Stack** | ✅ Primary | ✅ Primary | Hierarchical navigation |
| **Tab** | ✅ Primary | ✅ Secondary | Section-based navigation |
| **Drawer** | ⚠️ Secondary | ✅ Primary | Menu-based navigation |
| **Modal** | ✅ Common | ✅ Common | Temporary overlays |

## Best Practices

1. **Use stack for most flows** - It's the most universal pattern
2. **Limit tab count** - 3-5 tabs maximum for mobile
3. **Reserve drawers for complex apps** - Best on desktop
4. **Use modals sparingly** - For focused, temporary tasks
5. **Consider platform** - What works on mobile may not work on web
6. **Test navigation flow** - Ensure intuitive user experience
`,

  "idealyst://navigation/custom-layouts": `# Custom Layouts (Web Only)

On web, navigators can use custom layout components to add headers, sidebars, and other UI around route content.

## GeneralLayout Component

The built-in \`GeneralLayout\` provides header and sidebar functionality:

### Basic Usage

\`\`\`tsx
import { GeneralLayout } from '@idealyst/navigation';

<GeneralLayout
  header={{
    enabled: true,
    content: <Text>My App</Text>,
  }}
  sidebar={{
    enabled: true,
    content: <NavigationMenu />,
  }}
>
  {children}
</GeneralLayout>
\`\`\`

### Header Configuration

\`\`\`tsx
type HeaderConfig = {
  enabled: boolean;           // Show/hide header
  height?: number;            // Header height (default: 64)
  content?: React.ReactNode;  // Header content
  style?: ViewStyle;          // Custom styles
};
\`\`\`

Example:
\`\`\`tsx
header={{
  enabled: true,
  height: 80,
  content: (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
      <Text size="lg" weight="bold">Dashboard</Text>
      <UserMenu />
    </View>
  )
}}
\`\`\`

### Sidebar Configuration

\`\`\`tsx
type SidebarConfig = {
  enabled: boolean;              // Show/hide sidebar
  collapsible?: boolean;         // Allow collapse/expand
  position?: 'left' | 'right';   // Sidebar position
  initiallyExpanded?: boolean;   // Initial state
  expandedWidth?: number;        // Width when expanded (default: 240)
  collapsedWidth?: number;       // Width when collapsed (default: 64)
  content?: React.ReactNode;     // Sidebar content
  style?: ViewStyle;             // Custom styles
};
\`\`\`

Example:
\`\`\`tsx
sidebar={{
  enabled: true,
  collapsible: true,
  position: 'left',
  initiallyExpanded: true,
  expandedWidth: 280,
  collapsedWidth: 72,
  content: <NavigationSidebar />
}}
\`\`\`

## Using Layouts with Navigators

### Stack Navigator with Layout

\`\`\`tsx
import { CustomStackLayout } from './layouts/CustomStackLayout';

const router: NavigatorParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  layoutComponent: CustomStackLayout,  // Web only!
  routes: [
    { path: "", type: 'screen', component: HomeScreen },
    { path: "about", type: 'screen', component: AboutScreen },
  ]
};
\`\`\`

### Tab Navigator with Layout

\`\`\`tsx
import { CustomTabLayout } from './layouts/CustomTabLayout';

const router: NavigatorParam = {
  path: "/",
  type: 'navigator',
  layout: 'tab',
  layoutComponent: CustomTabLayout,  // Web only!
  routes: [
    { path: "feed", type: 'screen', component: FeedScreen },
    { path: "profile", type: 'screen', component: ProfileScreen },
  ]
};
\`\`\`

## Creating Custom Layouts

### Stack Layout Component

\`\`\`tsx
import { GeneralLayout } from '@idealyst/navigation';
import type { StackLayoutProps } from '@idealyst/navigation';

export const CustomStackLayout: React.FC<StackLayoutProps> = ({
  children,
  options,
  routes,
  currentPath
}) => {
  return (
    <GeneralLayout
      header={{
        enabled: true,
        content: (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{options?.headerTitle || 'My App'}</Text>
            {options?.headerRight}
          </View>
        )
      }}
      sidebar={{
        enabled: true,
        collapsible: true,
        content: (
          <NavigationMenu routes={routes} currentPath={currentPath} />
        )
      }}
    >
      {children}
    </GeneralLayout>
  );
};
\`\`\`

### Tab Layout Component

\`\`\`tsx
import type { TabLayoutProps } from '@idealyst/navigation';

export const CustomTabLayout: React.FC<TabLayoutProps> = ({
  children,
  routes,
  currentPath
}) => {
  const navigator = useNavigator();

  return (
    <View style={{ flex: 1 }}>
      {/* Custom tab bar */}
      <View style={{ flexDirection: 'row', borderBottom: '1px solid #ccc' }}>
        {routes.map(route => (
          <Pressable
            key={route.path}
            onPress={() => navigator.navigate({ path: route.fullPath, vars: {} })}
            style={{
              padding: 16,
              borderBottom: currentPath === route.fullPath ? '2px solid blue' : 'none'
            }}
          >
            <Text>{route.options?.tabBarLabel || route.path}</Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
};
\`\`\`

## Layout Props Reference

### StackLayoutProps

\`\`\`tsx
type StackLayoutProps = {
  options?: NavigatorOptions;           // Navigator options
  routes: RouteWithFullPath[];          // All routes with full paths
  currentPath: string;                  // Current active path
  children?: React.ReactNode;           // Route content
};
\`\`\`

### TabLayoutProps

\`\`\`tsx
type TabLayoutProps = {
  options?: NavigatorOptions;                    // Navigator options
  routes: RouteWithFullPath<TabBarScreenOptions>[]; // Tab routes
  currentPath: string;                            // Current active path
  children?: React.ReactNode;                     // Route content
};
\`\`\`

## Real-World Examples

### Dashboard Layout

\`\`\`tsx
export const DashboardLayout: React.FC<StackLayoutProps> = ({
  children,
  routes,
  currentPath
}) => {
  return (
    <GeneralLayout
      header={{
        enabled: true,
        height: 72,
        content: (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16
          }}>
            <Text size="xl" weight="bold">Dashboard</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <NotificationBell />
              <UserAvatar />
            </View>
          </View>
        )
      }}
      sidebar={{
        enabled: true,
        collapsible: true,
        position: 'left',
        expandedWidth: 260,
        content: <DashboardSidebar routes={routes} currentPath={currentPath} />
      }}
    >
      {children}
    </GeneralLayout>
  );
};
\`\`\`

### Admin Panel Layout

\`\`\`tsx
export const AdminLayout: React.FC<StackLayoutProps> = ({ children }) => {
  return (
    <GeneralLayout
      header={{
        enabled: true,
        content: <AdminHeader />,
        style: { backgroundColor: '#1a1a1a', color: '#fff' }
      }}
      sidebar={{
        enabled: true,
        collapsible: true,
        position: 'left',
        initiallyExpanded: true,
        content: <AdminNavigationMenu />,
        style: { backgroundColor: '#2a2a2a' }
      }}
    >
      <View style={{ padding: 24 }}>
        {children}
      </View>
    </GeneralLayout>
  );
};
\`\`\`

## Best Practices

1. **Use GeneralLayout as base** - Don't reinvent header/sidebar logic
2. **Keep layouts simple** - Complex logic belongs in screens
3. **Make responsive** - Consider different screen sizes
4. **Theme-aware** - Use theme colors and spacing
5. **Accessible** - Ensure keyboard and screen reader support
6. **Performance** - Memoize layout components when possible
7. **Consistent** - Use same layout for similar sections

## Platform Considerations

- **Web only**: Layout components only apply to web
- **Mobile**: Uses native navigation components
- **Conditional rendering**: Check platform if needed
- **Testing**: Test both platforms separately
`,

  "idealyst://navigation/use-navigator": `# useNavigator Hook

The \`useNavigator\` hook provides navigation functionality and route information within your components.

## Basic Usage

\`\`\`tsx
import { useNavigator } from '@idealyst/navigation';

function MyComponent() {
  const navigator = useNavigator();

  return (
    <Button onPress={() => navigator.navigate({ path: '/profile', vars: {} })}>
      Go to Profile
    </Button>
  );
}
\`\`\`

## API Reference

### navigator.navigate()

Navigate to a route:

\`\`\`tsx
navigator.navigate({
  path: string;
  vars: Record<string, string>;
});
\`\`\`

Examples:
\`\`\`tsx
// Simple navigation
navigator.navigate({ path: '/home', vars: {} });

// With path parameters
navigator.navigate({
  path: '/user/:id',
  vars: { id: '123' }
});

// With query parameters
navigator.navigate({
  path: '/search',
  vars: { q: 'react', category: 'tutorial' }
});
\`\`\`

### navigator.vars

Access current route variables:

\`\`\`tsx
const navigator = useNavigator();
const userId = navigator.vars.id;        // Path param
const searchQuery = navigator.vars.q;    // Query param
\`\`\`

### navigator.currentPath

Get the current route path:

\`\`\`tsx
const navigator = useNavigator();
const path = navigator.currentPath;

console.log(path); // "/user/123"
\`\`\`

### navigator.goBack()

Navigate to previous screen (mobile only):

\`\`\`tsx
<Button onPress={() => navigator.goBack()}>
  Go Back
</Button>
\`\`\`

**Note**: On web, use browser back button or navigator.navigate() to specific routes.

## Path Parameters

### Defining Parameters

In route configuration:
\`\`\`tsx
{
  path: "user/:id",
  type: 'screen',
  component: UserScreen
}
\`\`\`

### Accessing Parameters

In the screen component:
\`\`\`tsx
function UserScreen() {
  const navigator = useNavigator();
  const userId = navigator.vars.id;

  return <Text>User ID: {userId}</Text>;
}
\`\`\`

### Multiple Parameters

\`\`\`tsx
// Route: "post/:postId/comment/:commentId"

// Navigate:
navigator.navigate({
  path: '/post/:postId/comment/:commentId',
  vars: { postId: '42', commentId: '7' }
});

// Access:
const postId = navigator.vars.postId;
const commentId = navigator.vars.commentId;
\`\`\`

## Query Parameters

### Passing Query Params

\`\`\`tsx
navigator.navigate({
  path: '/search',
  vars: {
    q: 'typescript',
    category: 'tutorial',
    sort: 'recent'
  }
});

// Results in: /search?q=typescript&category=tutorial&sort=recent
\`\`\`

### Reading Query Params

\`\`\`tsx
function SearchScreen() {
  const navigator = useNavigator();

  const query = navigator.vars.q;
  const category = navigator.vars.category;
  const sort = navigator.vars.sort;

  // Use params...
}
\`\`\`

## Navigation Patterns

### Programmatic Navigation

Navigate based on conditions:

\`\`\`tsx
function LoginScreen() {
  const navigator = useNavigator();

  const handleLogin = async () => {
    const success = await login(credentials);

    if (success) {
      navigator.navigate({ path: '/dashboard', vars: {} });
    }
  };

  return <Button onPress={handleLogin}>Login</Button>;
}
\`\`\`

### Navigation with Data

Pass data through navigation:

\`\`\`tsx
// List screen
<Button onPress={() => {
  navigator.navigate({
    path: '/product/:id',
    vars: { id: product.id }
  });
}}>
  View Product
</Button>

// Detail screen
function ProductScreen() {
  const navigator = useNavigator();
  const productId = navigator.vars.id;

  const product = useProduct(productId);
  // Render product...
}
\`\`\`

### Conditional Navigation

Navigate based on user state:

\`\`\`tsx
function ProtectedScreen() {
  const navigator = useNavigator();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigator.navigate({ path: '/login', vars: {} });
    }
  }, [user]);

  return user ? <Content /> : null;
}
\`\`\`

## Advanced Usage

### Navigation Guards

\`\`\`tsx
function useAuthGuard() {
  const navigator = useNavigator();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && navigator.currentPath !== '/login') {
      navigator.navigate({ path: '/login', vars: {} });
    }
  }, [isAuthenticated, navigator.currentPath]);
}

function App() {
  useAuthGuard();
  return <AppContent />;
}
\`\`\`

### Deep Linking

Handle deep links:

\`\`\`tsx
useEffect(() => {
  const handleDeepLink = (url: string) => {
    // Parse URL and navigate
    const path = parseDeepLink(url);
    navigator.navigate({ path, vars: {} });
  };

  // Add deep link listener
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  return () => subscription.remove();
}, []);
\`\`\`

### Navigation History

Track navigation history:

\`\`\`tsx
function useNavigationHistory() {
  const navigator = useNavigator();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(prev => [...prev, navigator.currentPath]);
  }, [navigator.currentPath]);

  return history;
}
\`\`\`

## TypeScript Support

Type-safe navigation:

\`\`\`tsx
type NavigateParams = {
  path: string;
  vars: Record<string, string>;
};

// Strongly typed vars
type UserRouteVars = {
  id: string;
  tab?: 'posts' | 'comments' | 'likes';
};

// Usage
navigator.navigate({
  path: '/user/:id',
  vars: { id: '123', tab: 'posts' } as UserRouteVars
});
\`\`\`

## Platform Differences

### React Native
- \`goBack()\` uses native navigation stack
- Hardware back button supported
- Gesture-based navigation

### Web
- Browser back/forward buttons work
- URL updates automatically
- Bookmarkable URLs
- \`goBack()\` uses browser history

## Best Practices

1. **Always provide vars** - Even if empty: \`{}\`
2. **Type your routes** - Use TypeScript for safety
3. **Handle errors** - Check if navigation succeeded
4. **Avoid navigation in render** - Use effects or handlers
5. **Clean up listeners** - Remove event listeners on unmount
6. **Test navigation flow** - Verify all paths work
7. **Use path params for IDs** - Not query params
8. **Use query params for filters** - Not path params

## Common Patterns

### Back Navigation

\`\`\`tsx
<Button
  icon="arrow-left"
  onPress={() => navigator.goBack()}
>
  Back
</Button>
\`\`\`

### Tab Navigation

\`\`\`tsx
const tabs = ['feed', 'search', 'profile'];

<View>
  {tabs.map(tab => (
    <Button
      key={tab}
      onPress={() => navigator.navigate({ path: \`/\${tab}\`, vars: {} })}
      variant={navigator.currentPath === \`/\${tab}\` ? 'contained' : 'outlined'}
    >
      {tab}
    </Button>
  ))}
</View>
\`\`\`

### Modal Navigation

\`\`\`tsx
<Button onPress={() => {
  navigator.navigate({
    path: '/modal/create-post',
    vars: {}
  });
}}>
  Create Post
</Button>

// In modal:
<Button onPress={() => navigator.goBack()}>
  Close
</Button>
\`\`\`
`,
};
