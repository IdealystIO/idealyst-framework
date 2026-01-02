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

## Invalid Route Handling

Navigators can specify how to handle invalid routes:

\`\`\`tsx
import { NavigatorParam, NotFoundComponentProps } from '@idealyst/navigation';

const NotFoundPage = ({ path, params }: NotFoundComponentProps) => (
  <View>
    <Text>Page not found: {path}</Text>
  </View>
);

const routes: NavigatorParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  // Component to show when route is invalid
  notFoundComponent: NotFoundPage,
  // Handler to redirect or show 404
  onInvalidRoute: (path) => {
    if (path.startsWith('/old-')) {
      return { path: '/new-section', replace: true };
    }
    return undefined;  // Show notFoundComponent
  },
  routes: [...]
};
\`\`\`

See the **Invalid Route Handling** guide for complete documentation.

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
  vars?: Record<string, string>;
  replace?: boolean;  // Replace history entry instead of push
});
\`\`\`

Examples:
\`\`\`tsx
// Simple navigation
navigator.navigate({ path: '/home' });

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

// Replace current history entry (no back navigation to current page)
navigator.navigate({
  path: '/dashboard',
  replace: true
});
\`\`\`

### Replace vs Push Navigation

By default, navigation pushes a new entry onto the history stack. Use \`replace: true\` when you want to replace the current entry instead:

\`\`\`tsx
// After login, replace login page in history
navigator.navigate({ path: '/dashboard', replace: true });

// Redirect without adding to history
navigator.navigate({ path: '/new-location', replace: true });
\`\`\`

**Use cases for replace:**
- Post-login redirects (user shouldn't go back to login)
- After form submission redirects
- URL canonicalization/normalization
- Redirect from deprecated routes

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

### navigator.canGoBack()

Check if back navigation is available:

\`\`\`tsx
const navigator = useNavigator();

if (navigator.canGoBack()) {
  // Show back button
}
\`\`\`

**Platform behavior:**
- **Web**: Returns \`true\` if there's a valid parent route in the route hierarchy (e.g., \`/users/123\` can go back to \`/users\`)
- **Native**: Uses React Navigation's \`canGoBack()\` to check navigation stack

### navigator.goBack()

Navigate back in the route hierarchy:

\`\`\`tsx
<Button onPress={() => navigator.goBack()}>
  Go Back
</Button>
\`\`\`

**Platform behavior:**
- **Web**: Navigates to the parent route (e.g., \`/users/123/edit\` → \`/users/123\` → \`/users\` → \`/\`). Does NOT use browser history - navigates up the route tree.
- **Native**: Uses React Navigation's \`goBack()\` to pop the navigation stack

**Important**: On web, this is NOT browser history back. It navigates to the parent path in the route hierarchy. Use this for "up" navigation within your app structure.

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
- \`canGoBack()\` checks React Navigation stack
- \`goBack()\` uses native navigation stack
- Hardware back button supported
- Gesture-based navigation

### Web
- \`canGoBack()\` checks for valid parent route in hierarchy
- \`goBack()\` navigates to parent route (NOT browser history)
- Browser back/forward buttons still work for browser history
- URL updates automatically
- Bookmarkable URLs

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
// Conditionally show back button
const { canGoBack, goBack } = useNavigator();

{canGoBack() && (
  <Button
    icon="arrow-left"
    onPress={goBack}
  >
    Back
  </Button>
)}
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

  "idealyst://navigation/invalid-route-handling": `# Invalid Route Handling

Handle 404 pages and invalid routes with customizable redirect logic and fallback components.

## Overview

The navigation system provides two mechanisms for handling invalid routes:

1. **\`onInvalidRoute\`** - A handler function that can redirect to a different route
2. **\`notFoundComponent\`** - A fallback component to render when no redirect is specified

These can be configured at each navigator level and support bubbling up to parent navigators.

## Basic Setup

### Adding a 404 Page

\`\`\`tsx
import { NavigatorParam, NotFoundComponentProps } from '@idealyst/navigation';

// 404 Component receives path and params
const NotFoundPage = ({ path, params }: NotFoundComponentProps) => (
  <Screen>
    <View style={{ alignItems: 'center', padding: 24 }}>
      <Icon name="alert-circle" size={64} color="red" />
      <Text size="xl">Page Not Found</Text>
      <Text color="secondary">The path "{path}" doesn't exist.</Text>
      {params && Object.keys(params).length > 0 && (
        <Text size="sm">Params: {JSON.stringify(params)}</Text>
      )}
    </View>
  </Screen>
);

const routes: NavigatorParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  notFoundComponent: NotFoundPage,
  routes: [
    { path: "", type: 'screen', component: HomeScreen },
    { path: "about", type: 'screen', component: AboutScreen },
  ]
};
\`\`\`

## NotFoundComponentProps

The 404 component receives information about the attempted route:

\`\`\`tsx
type NotFoundComponentProps = {
  /** The full path that was attempted */
  path: string;
  /** Any route parameters that were parsed from the path */
  params?: Record<string, string>;
};
\`\`\`

Example usage:
\`\`\`tsx
const NotFoundPage = ({ path, params }: NotFoundComponentProps) => {
  const { navigate } = useNavigator();

  return (
    <Screen>
      <View style={{ padding: 16, gap: 24 }}>
        <Text size="xl">404 - Page Not Found</Text>
        <Text>Attempted: {path}</Text>
        {params?.id && <Text>User ID: {params.id}</Text>}
        <Button onPress={() => navigate({ path: '/', replace: true })}>
          Go Home
        </Button>
      </View>
    </Screen>
  );
};
\`\`\`

## Redirect Handler

Use \`onInvalidRoute\` to redirect certain invalid paths:

\`\`\`tsx
const routes: NavigatorParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  notFoundComponent: NotFoundPage,
  onInvalidRoute: (invalidPath) => {
    // Redirect old URLs to new locations
    if (invalidPath.startsWith('/old-blog')) {
      return { path: '/blog', replace: true };
    }

    // Redirect legacy paths
    if (invalidPath === '/legacy-dashboard') {
      return { path: '/dashboard', replace: true };
    }

    // Return undefined to show notFoundComponent
    return undefined;
  },
  routes: [...]
};
\`\`\`

### Handler Return Values

The \`onInvalidRoute\` handler can return:

- **\`NavigateParams\`** - Redirect to a different route
- **\`undefined\`** - Show the \`notFoundComponent\` (or bubble up)

\`\`\`tsx
type NavigateParams = {
  path: string;
  vars?: Record<string, string>;
  replace?: boolean;  // Recommended: true for redirects
};

onInvalidRoute: (path: string) => NavigateParams | undefined
\`\`\`

## Scoped Handlers (Nested Navigators)

Each navigator can have its own 404 handling:

\`\`\`tsx
// Settings-specific 404 page
const SettingsNotFound = ({ path }: NotFoundComponentProps) => (
  <Screen>
    <View style={{ alignItems: 'center' }}>
      <Icon name="cog-off" size={48} color="orange" />
      <Text>Settings page not found: {path}</Text>
    </View>
  </Screen>
);

// Nested settings navigator with its own handler
const SettingsNavigator: NavigatorParam = {
  path: "settings",
  type: 'navigator',
  layout: 'stack',
  notFoundComponent: SettingsNotFound,
  onInvalidRoute: (path) => {
    // Redirect deprecated settings paths
    if (path.includes('legacy-setting')) {
      return { path: '/settings/general', replace: true };
    }
    return undefined;  // Show SettingsNotFound
  },
  routes: [
    { path: "", type: 'screen', component: SettingsHome },
    { path: "general", type: 'screen', component: GeneralSettings },
    { path: "account", type: 'screen', component: AccountSettings },
  ]
};

// Root navigator with global 404
const AppRouter: NavigatorParam = {
  path: "/",
  type: 'navigator',
  layout: 'stack',
  notFoundComponent: GlobalNotFound,  // Fallback for non-settings routes
  routes: [
    { path: "", type: 'screen', component: HomeScreen },
    SettingsNavigator,  // Has its own 404 handling
    { path: "about", type: 'screen', component: AboutScreen },
  ]
};
\`\`\`

## Handler Bubbling

Invalid routes bubble up through the navigator hierarchy:

\`\`\`
Invalid route detected: /settings/invalid-page
        ↓
Check /settings navigator's onInvalidRoute
        ↓
┌─────────────────────────────────────────┐
│ Returns NavigateParams?                 │
│   YES → Redirect to that route          │
│   NO (undefined) → Check notFoundComponent │
└─────────────────────────────────────────┘
        ↓
Has notFoundComponent?
   YES → Render it with { path, params }
   NO  → Bubble up to parent navigator
        ↓
No parent handles it?
   → console.warn("No handler for invalid route")
\`\`\`

## Platform Behavior

### Web

- Invalid routes trigger the catch-all route at each navigator level
- The \`onInvalidRoute\` handler is called when the 404 route is rendered
- If handler returns \`NavigateParams\`, navigation uses \`replace: true\` by default
- URL stays at the invalid path when showing \`notFoundComponent\`

### Mobile (React Native)

- Invalid routes trigger navigation to a hidden 404 screen
- The handler is called during the \`navigate()\` function
- If handler returns \`NavigateParams\`, redirects to that route
- If no handler/component, logs a warning

## Complete Example

\`\`\`tsx
import { NavigatorParam, NotFoundComponentProps } from '@idealyst/navigation';
import { Screen, View, Text, Button, Icon, Card } from '@idealyst/components';

// Global 404 - detailed error page
const GlobalNotFound = ({ path, params }: NotFoundComponentProps) => {
  const { navigate } = useNavigator();

  return (
    <Screen>
      <View style={{ padding: 24, gap: 24, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Icon name="alert-circle-outline" size={64} color="red" />
        <Text size="xl" weight="bold">Page Not Found</Text>
        <Text color="secondary">The page you're looking for doesn't exist.</Text>

        <Card style={{ marginTop: 16, padding: 16 }}>
          <Text size="sm" weight="semibold">Attempted path:</Text>
          <Text size="sm" color="secondary">{path}</Text>
          {params && Object.keys(params).length > 0 && (
            <>
              <Text size="sm" weight="semibold" style={{ marginTop: 8 }}>Params:</Text>
              <Text size="sm" color="secondary">{JSON.stringify(params)}</Text>
            </>
          )}
        </Card>

        <Button style={{ marginTop: 24 }} onPress={() => navigate({ path: '/', replace: true })}>
          Go Home
        </Button>
      </View>
    </Screen>
  );
};

// Admin section 404 - simpler style
const AdminNotFound = ({ path }: NotFoundComponentProps) => {
  const { navigate } = useNavigator();

  return (
    <Screen>
      <View padding={16} style={{ alignItems: 'center' }}>
        <Icon name="shield-off" size={48} color="orange" />
        <Text size="lg">Admin page not found</Text>
        <Button
          type="outlined"
          size="sm"
          onPress={() => navigate({ path: '/admin', replace: true })}
        >
          Back to Admin
        </Button>
      </View>
    </Screen>
  );
};

// Admin navigator with redirect logic
const AdminNavigator: NavigatorParam = {
  path: "admin",
  type: 'navigator',
  layout: 'stack',
  notFoundComponent: AdminNotFound,
  onInvalidRoute: (path) => {
    // Redirect old admin paths
    if (path.includes('old-users')) {
      return { path: '/admin/users', replace: true };
    }
    if (path.includes('deprecated')) {
      return { path: '/admin', replace: true };
    }
    return undefined;  // Show AdminNotFound
  },
  routes: [
    { path: "", type: 'screen', component: AdminDashboard },
    { path: "users", type: 'screen', component: AdminUsers },
    { path: "settings", type: 'screen', component: AdminSettings },
  ]
};

// Root app router
const AppRouter: NavigatorParam = {
  path: "/",
  type: 'navigator',
  layout: 'drawer',
  notFoundComponent: GlobalNotFound,
  onInvalidRoute: (path) => {
    // Global redirects
    if (path === '/home') {
      return { path: '/', replace: true };
    }
    return undefined;
  },
  routes: [
    { path: "", type: 'screen', component: HomeScreen },
    AdminNavigator,
    { path: "about", type: 'screen', component: AboutScreen },
    { path: "contact", type: 'screen', component: ContactScreen },
  ]
};

export default AppRouter;
\`\`\`

## Best Practices

1. **Always provide a root notFoundComponent** - Ensures all invalid routes are handled
2. **Use scoped handlers for sections** - Different 404 styles for different app areas
3. **Redirect deprecated URLs** - Use \`onInvalidRoute\` to maintain URL compatibility
4. **Include helpful information** - Show the attempted path and suggest alternatives
5. **Provide navigation options** - Add buttons to go home or back
6. **Use \`replace: true\` for redirects** - Prevents invalid routes in browser history
7. **Log unhandled routes** - Monitor for missing pages in production

## TypeScript Types

\`\`\`tsx
import {
  NavigatorParam,
  NotFoundComponentProps,
  NavigateParams
} from '@idealyst/navigation';

// NotFoundComponentProps
type NotFoundComponentProps = {
  path: string;
  params?: Record<string, string>;
};

// Handler signature
type InvalidRouteHandler = (invalidPath: string) => NavigateParams | undefined;

// NavigateParams (used by handler return and navigate function)
type NavigateParams = {
  path: string;
  vars?: Record<string, string>;
  replace?: boolean;
};
\`\`\`
`,
};
