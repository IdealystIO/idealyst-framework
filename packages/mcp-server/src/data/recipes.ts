/**
 * Idealyst Recipes - Common UI Patterns
 * Ready-to-use code examples for building apps with Idealyst
 */

export interface Recipe {
  name: string;
  description: string;
  category: "forms" | "navigation" | "data" | "layout" | "auth" | "settings" | "media";
  difficulty: "beginner" | "intermediate" | "advanced";
  packages: string[];
  code: string;
  explanation: string;
  tips?: string[];
  relatedRecipes?: string[];
}

export const recipes: Record<string, Recipe> = {
  "login-form": {
    name: "Login Form",
    description: "A complete login form with email/password validation and error handling",
    category: "auth",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme"],
    code: `import React, { useState } from 'react';
import { Button, Input, Card, Text, View } from '@idealyst/components';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSubmit, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding="lg">
      <Text variant="headline" style={{ marginBottom: 24 }}>
        Sign In
      </Text>

      {submitError && (
        <View style={{ marginBottom: 16 }}>
          <Text intent="danger">{submitError}</Text>
        </View>
      )}

      <View style={{ gap: 16 }}>
        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          error={errors.password}
        />

        <Button
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>

        {onForgotPassword && (
          <Button type="text" onPress={onForgotPassword}>
            Forgot Password?
          </Button>
        )}
      </View>
    </Card>
  );
}`,
    explanation: `This login form demonstrates:
- Controlled inputs with useState
- Client-side validation with error messages
- Loading state during submission
- Error handling for failed login attempts
- Proper keyboard types and autocomplete hints for better UX`,
    tips: [
      "Add onBlur validation for immediate feedback",
      "Consider using react-hook-form for complex forms",
      "Store tokens securely using @idealyst/storage after successful login",
    ],
    relatedRecipes: ["signup-form", "forgot-password", "protected-route"],
  },

  "signup-form": {
    name: "Signup Form",
    description: "User registration form with password confirmation and terms acceptance",
    category: "auth",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme"],
    code: `import React, { useState } from 'react';
import { Button, Input, Card, Text, View, Checkbox, Link } from '@idealyst/components';

interface SignupFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>;
  onTermsPress?: () => void;
}

export function SignupForm({ onSubmit, onTermsPress }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit({ name, email, password });
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding="lg">
      <Text variant="headline" style={{ marginBottom: 24 }}>
        Create Account
      </Text>

      {errors.submit && (
        <View style={{ marginBottom: 16 }}>
          <Text intent="danger">{errors.submit}</Text>
        </View>
      )}

      <View style={{ gap: 16 }}>
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          autoComplete="name"
          error={errors.name}
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <Input
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={setAcceptedTerms}
          />
          <Text>
            I agree to the{' '}
            <Link onPress={onTermsPress}>Terms and Conditions</Link>
          </Text>
        </View>
        {errors.terms && <Text intent="danger" size="sm">{errors.terms}</Text>}

        <Button
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </View>
    </Card>
  );
}`,
    explanation: `This signup form includes:
- Multiple field validation including password matching
- Terms and conditions checkbox with validation
- Proper autocomplete hints for password managers
- Loading and error states`,
    tips: [
      "Add password strength indicator for better UX",
      "Consider email verification flow after signup",
      "Use secure password hashing on the backend",
    ],
    relatedRecipes: ["login-form", "email-verification"],
  },

  "settings-screen": {
    name: "Settings Screen",
    description: "App settings screen with toggles, selections, and grouped options",
    category: "settings",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme", "@idealyst/storage"],
    code: `import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  View, Text, Switch, Select, Card, Divider, Icon
} from '@idealyst/components';
import { storage } from '@idealyst/storage';

interface Settings {
  notifications: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
  language: string;
  fontSize: string;
}

const defaultSettings: Settings = {
  notifications: true,
  emailUpdates: false,
  darkMode: false,
  language: 'en',
  fontSize: 'medium',
};

export function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await storage.get<Settings>('user-settings');
      if (saved) {
        setSettings(saved);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await storage.set('user-settings', newSettings);
  };

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 16 }}>
        {/* Notifications Section */}
        <Card>
          <Text variant="title" style={{ marginBottom: 16 }}>
            Notifications
          </Text>

          <SettingRow
            icon="bell"
            label="Push Notifications"
            description="Receive push notifications"
          >
            <Switch
              checked={settings.notifications}
              onCheckedChange={(v) => updateSetting('notifications', v)}
            />
          </SettingRow>

          <Divider />

          <SettingRow
            icon="email"
            label="Email Updates"
            description="Receive weekly email updates"
          >
            <Switch
              checked={settings.emailUpdates}
              onCheckedChange={(v) => updateSetting('emailUpdates', v)}
            />
          </SettingRow>
        </Card>

        {/* Appearance Section */}
        <Card>
          <Text variant="title" style={{ marginBottom: 16 }}>
            Appearance
          </Text>

          <SettingRow
            icon="theme-light-dark"
            label="Dark Mode"
            description="Use dark theme"
          >
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(v) => updateSetting('darkMode', v)}
            />
          </SettingRow>

          <Divider />

          <SettingRow
            icon="format-size"
            label="Font Size"
          >
            <Select
              value={settings.fontSize}
              onValueChange={(v) => updateSetting('fontSize', v)}
              options={[
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ]}
              style={{ width: 120 }}
            />
          </SettingRow>
        </Card>

        {/* Language Section */}
        <Card>
          <Text variant="title" style={{ marginBottom: 16 }}>
            Language & Region
          </Text>

          <SettingRow
            icon="translate"
            label="Language"
          >
            <Select
              value={settings.language}
              onValueChange={(v) => updateSetting('language', v)}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'German', value: 'de' },
              ]}
              style={{ width: 140 }}
            />
          </SettingRow>
        </Card>
      </View>
    </ScrollView>
  );
}

// Helper component for consistent setting rows
function SettingRow({
  icon,
  label,
  description,
  children
}: {
  icon: string;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <Icon name={icon} size={24} />
        <View style={{ flex: 1 }}>
          <Text>{label}</Text>
          {description && (
            <Text size="sm" style={{ opacity: 0.7 }}>{description}</Text>
          )}
        </View>
      </View>
      {children}
    </View>
  );
}`,
    explanation: `This settings screen demonstrates:
- Loading and persisting settings with @idealyst/storage
- Grouped settings sections with Cards
- Switch toggles for boolean options
- Select dropdowns for choices
- Reusable SettingRow component for consistent layout`,
    tips: [
      "Consider debouncing saves for rapid toggles",
      "Add a 'Reset to Defaults' option",
      "Sync settings with backend for cross-device consistency",
    ],
    relatedRecipes: ["theme-switcher", "profile-screen"],
  },

  "theme-switcher": {
    name: "Theme Switcher",
    description: "Toggle between light and dark mode with persistence",
    category: "settings",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme", "@idealyst/storage"],
    code: `import React, { createContext, useContext, useEffect, useState } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import { storage } from '@idealyst/storage';
import { Switch, View, Text, Icon } from '@idealyst/components';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Apply theme based on mode
    if (mode === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(mode);
    }
  }, [mode, isLoaded]);

  const loadTheme = async () => {
    const saved = await storage.get<ThemeMode>('theme-mode');
    if (saved) {
      setModeState(saved);
    }
    setIsLoaded(true);
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await storage.set('theme-mode', newMode);
  };

  const isDark = mode === 'dark' ||
    (mode === 'system' && UnistylesRuntime.colorScheme === 'dark');

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Simple toggle component
export function ThemeToggle() {
  const { isDark, setMode } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Icon name={isDark ? 'weather-night' : 'weather-sunny'} size={24} />
      <Text>Dark Mode</Text>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setMode(checked ? 'dark' : 'light')}
      />
    </View>
  );
}

// Full selector with system option
export function ThemeSelector() {
  const { mode, setMode } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <ThemeOption
        label="Light"
        icon="weather-sunny"
        selected={mode === 'light'}
        onPress={() => setMode('light')}
      />
      <ThemeOption
        label="Dark"
        icon="weather-night"
        selected={mode === 'dark'}
        onPress={() => setMode('dark')}
      />
      <ThemeOption
        label="System"
        icon="cellphone"
        selected={mode === 'system'}
        onPress={() => setMode('system')}
      />
    </View>
  );
}

function ThemeOption({
  label,
  icon,
  selected,
  onPress
}: {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 8,
        backgroundColor: selected ? 'rgba(0,0,0,0.1)' : 'transparent',
      }}>
        <Icon name={icon} size={20} />
        <Text>{label}</Text>
        {selected && <Icon name="check" size={20} intent="success" />}
      </View>
    </Pressable>
  );
}`,
    explanation: `This theme switcher provides:
- ThemeProvider context for app-wide theme state
- Persistence with @idealyst/storage
- Support for light, dark, and system-follow modes
- Integration with Unistyles runtime
- Both simple toggle and full selector UI components`,
    tips: [
      "Wrap your app root with ThemeProvider",
      "The system option follows device settings automatically",
      "Theme changes are instant with no reload required",
    ],
    relatedRecipes: ["settings-screen"],
  },

  "tab-navigation": {
    name: "Tab Navigation",
    description: "Bottom tab navigation with icons and badges",
    category: "navigation",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `import React from 'react';
import { Router, TabBar } from '@idealyst/navigation';
import { Icon, Badge, View } from '@idealyst/components';

// Define your screens
function HomeScreen() {
  return <View><Text>Home</Text></View>;
}

function SearchScreen() {
  return <View><Text>Search</Text></View>;
}

function NotificationsScreen() {
  return <View><Text>Notifications</Text></View>;
}

function ProfileScreen() {
  return <View><Text>Profile</Text></View>;
}

// Route configuration
const routes = {
  home: {
    path: '/',
    screen: HomeScreen,
    options: {
      title: 'Home',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Icon name={focused ? 'home' : 'home-outline'} size={24} />
      ),
    },
  },
  search: {
    path: '/search',
    screen: SearchScreen,
    options: {
      title: 'Search',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Icon name={focused ? 'magnify' : 'magnify'} size={24} />
      ),
    },
  },
  notifications: {
    path: '/notifications',
    screen: NotificationsScreen,
    options: {
      title: 'Notifications',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <View>
          <Icon name={focused ? 'bell' : 'bell-outline'} size={24} />
          {/* Show badge when there are unread notifications */}
          <Badge
            count={3}
            style={{ position: 'absolute', top: -4, right: -8 }}
          />
        </View>
      ),
    },
  },
  profile: {
    path: '/profile',
    screen: ProfileScreen,
    options: {
      title: 'Profile',
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Icon name={focused ? 'account' : 'account-outline'} size={24} />
      ),
    },
  },
};

export function App() {
  return (
    <Router
      routes={routes}
      navigator="tabs"
      tabBarPosition="bottom"
    />
  );
}`,
    explanation: `This tab navigation setup includes:
- Four tabs with icons that change when focused
- Badge on notifications tab for unread count
- Type-safe route configuration
- Works on both web and native`,
    tips: [
      "Use outline/filled icon variants to indicate focus state",
      "Keep tab count to 3-5 for best usability",
      "Consider hiding tabs on certain screens (like detail views)",
    ],
    relatedRecipes: ["drawer-navigation", "stack-navigation", "protected-route"],
  },

  "drawer-navigation": {
    name: "Drawer Navigation",
    description: "Side drawer menu with navigation items and user profile",
    category: "navigation",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `import React from 'react';
import { Router, useNavigator } from '@idealyst/navigation';
import { View, Text, Icon, Avatar, Pressable, Divider } from '@idealyst/components';

// Custom drawer content
function DrawerContent() {
  const { navigate, currentRoute } = useNavigator();

  const menuItems = [
    { route: 'home', icon: 'home', label: 'Home' },
    { route: 'dashboard', icon: 'view-dashboard', label: 'Dashboard' },
    { route: 'messages', icon: 'message', label: 'Messages' },
    { route: 'settings', icon: 'cog', label: 'Settings' },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* User Profile Header */}
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Avatar
          source={{ uri: 'https://example.com/avatar.jpg' }}
          size="lg"
        />
        <Text variant="title" style={{ marginTop: 12 }}>John Doe</Text>
        <Text size="sm" style={{ opacity: 0.7 }}>john@example.com</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      {/* Menu Items */}
      <View style={{ gap: 4 }}>
        {menuItems.map((item) => (
          <DrawerItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            active={currentRoute === item.route}
            onPress={() => navigate(item.route)}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={{ marginTop: 'auto' }}>
        <Divider style={{ marginVertical: 16 }} />
        <DrawerItem
          icon="logout"
          label="Sign Out"
          onPress={() => {
            // Handle logout
          }}
        />
      </View>
    </View>
  );
}

function DrawerItem({
  icon,
  label,
  active,
  onPress
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: active ? 'rgba(0,0,0,0.1)' : 'transparent',
      }}>
        <Icon name={icon} size={24} intent={active ? 'primary' : undefined} />
        <Text intent={active ? 'primary' : undefined}>{label}</Text>
      </View>
    </Pressable>
  );
}

// Route configuration
const routes = {
  home: { path: '/', screen: HomeScreen },
  dashboard: { path: '/dashboard', screen: DashboardScreen },
  messages: { path: '/messages', screen: MessagesScreen },
  settings: { path: '/settings', screen: SettingsScreen },
};

export function App() {
  return (
    <Router
      routes={routes}
      navigator="drawer"
      drawerContent={DrawerContent}
    />
  );
}`,
    explanation: `This drawer navigation includes:
- Custom drawer content with user profile
- Active state highlighting for current route
- Grouped menu items with icons
- Sign out button at the bottom
- Works on both web (sidebar) and native (slide-out drawer)`,
    tips: [
      "Add a hamburger menu button to open drawer on native",
      "Consider using drawer on tablet/desktop, tabs on mobile",
      "Add gesture support for swipe-to-open on native",
    ],
    relatedRecipes: ["tab-navigation", "stack-navigation"],
  },

  "protected-route": {
    name: "Protected Routes",
    description: "Redirect unauthenticated users to login with auth state management",
    category: "auth",
    difficulty: "intermediate",
    packages: ["@idealyst/navigation", "@idealyst/storage", "@idealyst/components"],
    code: `import React, { createContext, useContext, useEffect, useState } from 'react';
import { Router, useNavigator } from '@idealyst/navigation';
import { storage } from '@idealyst/storage';
import { View, Text, ActivityIndicator } from '@idealyst/components';

// Auth Context
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storage.get<string>('auth-token');
      if (token) {
        // Validate token and get user data
        const userData = await fetchUser(token);
        setUser(userData);
      }
    } catch (error) {
      // Token invalid or expired
      await storage.remove('auth-token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    await storage.set('auth-token', token);
    setUser(user);
  };

  const logout = async () => {
    await storage.remove('auth-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { navigate } = useNavigator();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="lg" />
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

// Route configuration
const routes = {
  login: {
    path: '/login',
    screen: LoginScreen,
    options: { public: true },
  },
  signup: {
    path: '/signup',
    screen: SignupScreen,
    options: { public: true },
  },
  home: {
    path: '/',
    screen: () => (
      <ProtectedRoute>
        <HomeScreen />
      </ProtectedRoute>
    ),
  },
  profile: {
    path: '/profile',
    screen: () => (
      <ProtectedRoute>
        <ProfileScreen />
      </ProtectedRoute>
    ),
  },
  settings: {
    path: '/settings',
    screen: () => (
      <ProtectedRoute>
        <SettingsScreen />
      </ProtectedRoute>
    ),
  },
};

export function App() {
  return (
    <AuthProvider>
      <Router routes={routes} />
    </AuthProvider>
  );
}`,
    explanation: `This protected routes setup includes:
- AuthProvider context for app-wide auth state
- Token persistence with @idealyst/storage
- Loading state while checking authentication
- Automatic redirect to login for unauthenticated users
- ProtectedRoute wrapper component for easy use`,
    tips: [
      "Add token refresh logic for long-lived sessions",
      "Consider deep link handling for login redirects",
      "Use @idealyst/oauth-client for OAuth flows",
    ],
    relatedRecipes: ["login-form", "oauth-flow"],
  },

  "data-list": {
    name: "Data List with Pull-to-Refresh",
    description: "Scrollable list with pull-to-refresh, loading states, and empty state",
    category: "data",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { View, Text, Card, ActivityIndicator, Button, Icon } from '@idealyst/components';

interface Item {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface DataListProps {
  fetchItems: () => Promise<Item[]>;
  onItemPress?: (item: Item) => void;
}

export function DataList({ fetchItems, onItemPress }: DataListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);

    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="lg" />
        <Text style={{ marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Icon name="alert-circle" size={48} intent="danger" />
        <Text variant="title" style={{ marginTop: 16 }}>Something went wrong</Text>
        <Text style={{ textAlign: 'center', marginTop: 8, opacity: 0.7 }}>
          {error}
        </Text>
        <Button onPress={() => loadData()} style={{ marginTop: 24 }}>
          Try Again
        </Button>
      </View>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Icon name="inbox" size={48} style={{ opacity: 0.5 }} />
        <Text variant="title" style={{ marginTop: 16 }}>No items yet</Text>
        <Text style={{ textAlign: 'center', marginTop: 8, opacity: 0.7 }}>
          Pull down to refresh or check back later
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      }
      renderItem={({ item }) => (
        <Card
          onPress={() => onItemPress?.(item)}
          style={{ padding: 16 }}
        >
          <Text variant="title">{item.title}</Text>
          <Text style={{ marginTop: 4, opacity: 0.7 }}>
            {item.description}
          </Text>
          <Text size="sm" style={{ marginTop: 8, opacity: 0.5 }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </Card>
      )}
    />
  );
}

// Usage example
function MyScreen() {
  const fetchItems = async () => {
    const response = await fetch('/api/items');
    return response.json();
  };

  return (
    <DataList
      fetchItems={fetchItems}
      onItemPress={(item) => console.log('Selected:', item)}
    />
  );
}`,
    explanation: `This data list component handles:
- Initial loading state with spinner
- Pull-to-refresh functionality
- Error state with retry button
- Empty state with helpful message
- Efficient FlatList rendering for large lists`,
    tips: [
      "Add pagination with onEndReached for large datasets",
      "Use skeleton loading for smoother perceived performance",
      "Consider optimistic updates for better UX",
    ],
    relatedRecipes: ["search-filter", "infinite-scroll"],
  },

  "search-filter": {
    name: "Search with Filters",
    description: "Search input with filter chips and debounced search",
    category: "data",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { View, Input, Chip, Text, Icon } from '@idealyst/components';

interface SearchFilterProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  filterOptions: { key: string; label: string; values: string[] }[];
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchFilter<T extends Record<string, any>>({
  data,
  searchKeys,
  filterOptions,
  renderItem,
  placeholder = 'Search...',
}: SearchFilterProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const debouncedQuery = useDebounce(searchQuery, 300);

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [key]: updated };
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    for (const [key, values] of Object.entries(activeFilters)) {
      if (values.length > 0) {
        result = result.filter((item) => values.includes(String(item[key])));
      }
    }

    return result;
  }, [data, debouncedQuery, activeFilters, searchKeys]);

  const hasActiveFilters =
    searchQuery || Object.values(activeFilters).some((v) => v.length > 0);

  return (
    <View style={{ flex: 1 }}>
      {/* Search Input */}
      <View style={{ padding: 16 }}>
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="magnify"
          rightIcon={searchQuery ? 'close' : undefined}
          onRightIconPress={() => setSearchQuery('')}
        />
      </View>

      {/* Filter Chips */}
      {filterOptions.map((filter) => (
        <View key={filter.key} style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <Text size="sm" style={{ marginBottom: 8, opacity: 0.7 }}>
            {filter.label}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {filter.values.map((value) => (
                <Chip
                  key={value}
                  selected={(activeFilters[filter.key] || []).includes(value)}
                  onPress={() => toggleFilter(filter.key, value)}
                >
                  {value}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>
      ))}

      {/* Results Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}>
        <Text size="sm" style={{ opacity: 0.7 }}>
          {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
        </Text>
        {hasActiveFilters && (
          <Chip onPress={clearFilters} size="sm">
            <Icon name="close" size={14} /> Clear all
          </Chip>
        )}
      </View>

      {/* Results */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {filteredData.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Icon name="magnify-close" size={48} style={{ opacity: 0.5 }} />
            <Text style={{ marginTop: 16 }}>No results found</Text>
          </View>
        ) : (
          filteredData.map((item, index) => (
            <View key={index}>{renderItem(item)}</View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Usage example
const products = [
  { id: '1', name: 'iPhone', category: 'Electronics', price: 999 },
  { id: '2', name: 'MacBook', category: 'Electronics', price: 1999 },
  { id: '3', name: 'Desk Chair', category: 'Furniture', price: 299 },
];

function ProductSearch() {
  return (
    <SearchFilter
      data={products}
      searchKeys={['name']}
      filterOptions={[
        { key: 'category', label: 'Category', values: ['Electronics', 'Furniture'] },
      ]}
      renderItem={(product) => (
        <Card>
          <Text>{product.name}</Text>
          <Text>\${product.price}</Text>
        </Card>
      )}
    />
  );
}`,
    explanation: `This search and filter component provides:
- Debounced search input (300ms delay)
- Multiple filter categories with chips
- Combined search + filter logic
- Clear all filters button
- Result count display
- Empty state handling`,
    tips: [
      "Add URL query params sync for shareable filtered views",
      "Consider server-side filtering for large datasets",
      "Add sort options alongside filters",
    ],
    relatedRecipes: ["data-list", "infinite-scroll"],
  },

  "modal-confirmation": {
    name: "Confirmation Dialog",
    description: "Reusable confirmation modal for destructive actions",
    category: "layout",
    difficulty: "beginner",
    packages: ["@idealyst/components"],
    code: `import React, { createContext, useContext, useState, useCallback } from 'react';
import { Dialog, Button, Text, View, Icon } from '@idealyst/components';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: 'danger' | 'warning' | 'primary';
  icon?: string;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setResolveRef(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleClose = (confirmed: boolean) => {
    setIsOpen(false);
    resolveRef?.(confirmed);
    // Clean up after animation
    setTimeout(() => {
      setOptions(null);
      setResolveRef(null);
    }, 300);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose(false)}>
        {options && (
          <View style={{ padding: 24, alignItems: 'center' }}>
            {options.icon && (
              <Icon
                name={options.icon}
                size={48}
                intent={options.intent || 'danger'}
                style={{ marginBottom: 16 }}
              />
            )}

            <Text variant="headline" style={{ textAlign: 'center' }}>
              {options.title}
            </Text>

            <Text style={{ textAlign: 'center', marginTop: 8, opacity: 0.7 }}>
              {options.message}
            </Text>

            <View style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 24,
              width: '100%',
            }}>
              <Button
                type="outlined"
                onPress={() => handleClose(false)}
                style={{ flex: 1 }}
              >
                {options.cancelLabel || 'Cancel'}
              </Button>

              <Button
                intent={options.intent || 'danger'}
                onPress={() => handleClose(true)}
                style={{ flex: 1 }}
              >
                {options.confirmLabel || 'Confirm'}
              </Button>
            </View>
          </View>
        )}
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context.confirm;
}

// Usage example
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const confirm = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item?',
      message: 'This action cannot be undone. Are you sure you want to delete this item?',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      intent: 'danger',
      icon: 'delete',
    });

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <Button intent="danger" type="outlined" onPress={handleDelete}>
      Delete
    </Button>
  );
}

// Wrap your app
function App() {
  return (
    <ConfirmProvider>
      <MyApp />
    </ConfirmProvider>
  );
}`,
    explanation: `This confirmation dialog system provides:
- Async/await API for easy use: \`if (await confirm({...})) { ... }\`
- Customizable title, message, buttons, and icon
- Intent-based styling (danger, warning, primary)
- Promise-based resolution
- Clean context-based architecture`,
    tips: [
      "Use danger intent for destructive actions",
      "Keep messages concise and actionable",
      "Consider adding a 'Don't ask again' checkbox for repeated actions",
    ],
    relatedRecipes: ["toast-notifications"],
  },

  "toast-notifications": {
    name: "Toast Notifications",
    description: "Temporary notification messages that auto-dismiss",
    category: "layout",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { createContext, useContext, useState, useCallback } from 'react';
import { Animated, Pressable } from 'react-native';
import { View, Text, Icon } from '@idealyst/components';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const toastConfig: Record<ToastType, { icon: string; intent: string }> = {
  success: { icon: 'check-circle', intent: 'success' },
  error: { icon: 'alert-circle', intent: 'danger' },
  warning: { icon: 'alert', intent: 'warning' },
  info: { icon: 'information', intent: 'primary' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const contextValue: ToastContextType = {
    showToast,
    success: (msg) => showToast('success', msg),
    error: (msg) => showToast('error', msg),
    warning: (msg) => showToast('warning', msg),
    info: (msg) => showToast('info', msg),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <View
        style={{
          position: 'absolute',
          top: 60,
          left: 16,
          right: 16,
          zIndex: 9999,
          gap: 8,
        }}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const config = toastConfig[toast.type];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-20, 0],
    }) }] }}>
      <Pressable onPress={onDismiss}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#1a1a1a',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Icon name={config.icon} size={20} intent={config.intent as any} />
          <Text style={{ flex: 1, color: '#fff' }}>{toast.message}</Text>
          <Icon name="close" size={16} style={{ opacity: 0.5 }} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// Usage example
function SaveButton() {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveData();
      toast.success('Changes saved successfully!');
    } catch (error) {
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button onPress={handleSave} loading={isSaving}>
      Save
    </Button>
  );
}

// Wrap your app
function App() {
  return (
    <ToastProvider>
      <MyApp />
    </ToastProvider>
  );
}`,
    explanation: `This toast notification system provides:
- Simple API: \`toast.success('Message')\`
- Four types: success, error, warning, info
- Auto-dismiss with configurable duration
- Tap to dismiss
- Animated entrance
- Stacking multiple toasts`,
    tips: [
      "Use success for completed actions, error for failures",
      "Keep messages under 50 characters for readability",
      "Don't show toasts for every action - use sparingly",
    ],
    relatedRecipes: ["modal-confirmation"],
  },

  "form-with-validation": {
    name: "Form with Validation",
    description: "Multi-field form with real-time validation and error handling",
    category: "forms",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  View, Text, Input, Select, Checkbox, Button, Card
} from '@idealyst/components';

// Validation rules
type ValidationRule<T> = {
  validate: (value: T, formData: FormData) => boolean;
  message: string;
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  subscribe: boolean;
}

const validationRules: Partial<Record<keyof FormData, ValidationRule<any>[]>> = {
  name: [
    { validate: (v) => v.trim().length > 0, message: 'Name is required' },
    { validate: (v) => v.trim().length >= 2, message: 'Name must be at least 2 characters' },
  ],
  email: [
    { validate: (v) => v.length > 0, message: 'Email is required' },
    { validate: (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v), message: 'Invalid email format' },
  ],
  phone: [
    { validate: (v) => !v || /^[+]?[0-9\\s-]{10,}$/.test(v), message: 'Invalid phone number' },
  ],
  country: [
    { validate: (v) => v.length > 0, message: 'Please select a country' },
  ],
  message: [
    { validate: (v) => v.length > 0, message: 'Message is required' },
    { validate: (v) => v.length >= 10, message: 'Message must be at least 10 characters' },
  ],
};

export function ContactForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    subscribe: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof FormData, value: any): string | undefined => {
    const rules = validationRules[field];
    if (!rules) return undefined;

    for (const rule of rules) {
      if (!rule.validate(value, formData)) {
        return rule.message;
      }
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    for (const field of Object.keys(validationRules) as (keyof FormData)[]) {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Submission failed'
      } as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <Card padding="lg">
        <Text variant="headline" style={{ marginBottom: 24 }}>
          Contact Us
        </Text>

        <View style={{ gap: 16 }}>
          <Input
            label="Name *"
            placeholder="Your full name"
            value={formData.name}
            onChangeText={(v) => handleChange('name', v)}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : undefined}
          />

          <Input
            label="Email *"
            placeholder="you@example.com"
            value={formData.email}
            onChangeText={(v) => handleChange('email', v)}
            onBlur={() => handleBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email ? errors.email : undefined}
          />

          <Input
            label="Phone"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChangeText={(v) => handleChange('phone', v)}
            onBlur={() => handleBlur('phone')}
            keyboardType="phone-pad"
            error={touched.phone ? errors.phone : undefined}
          />

          <Select
            label="Country *"
            placeholder="Select your country"
            value={formData.country}
            onValueChange={(v) => handleChange('country', v)}
            options={[
              { label: 'United States', value: 'us' },
              { label: 'United Kingdom', value: 'uk' },
              { label: 'Canada', value: 'ca' },
              { label: 'Australia', value: 'au' },
              { label: 'Other', value: 'other' },
            ]}
            error={touched.country ? errors.country : undefined}
          />

          <Input
            label="Message *"
            placeholder="How can we help you?"
            value={formData.message}
            onChangeText={(v) => handleChange('message', v)}
            onBlur={() => handleBlur('message')}
            multiline
            numberOfLines={4}
            error={touched.message ? errors.message : undefined}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Checkbox
              checked={formData.subscribe}
              onCheckedChange={(v) => handleChange('subscribe', v)}
            />
            <Text>Subscribe to our newsletter</Text>
          </View>

          <Button
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={{ marginTop: 8 }}
          >
            Send Message
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}`,
    explanation: `This form demonstrates:
- Field-level validation with custom rules
- Validation on blur (after first touch)
- Real-time validation after field is touched
- Full form validation on submit
- Error display with touched state tracking
- Loading state during submission`,
    tips: [
      "Consider using a form library like react-hook-form for complex forms",
      "Add success state/message after submission",
      "Implement autosave for long forms",
    ],
    relatedRecipes: ["login-form", "signup-form"],
  },

  "image-upload": {
    name: "Image Upload",
    description: "Image picker with preview, crop option, and upload progress",
    category: "media",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/camera"],
    code: `import React, { useState } from 'react';
import { Image } from 'react-native';
import { View, Text, Button, Card, Icon, Progress } from '@idealyst/components';
// Note: You'll need expo-image-picker or react-native-image-picker

interface ImageUploadProps {
  onUpload: (uri: string) => Promise<string>; // Returns uploaded URL
  currentImage?: string;
}

export function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [imageUri, setImageUri] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      // Using expo-image-picker as example
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      setError('Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      setError('Failed to take photo');
    }
  };

  const handleUpload = async () => {
    if (!imageUri) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const uploadedUrl = await onUpload(imageUri);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setImageUri(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUri(null);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <Card padding="lg">
      <Text variant="title" style={{ marginBottom: 16 }}>
        Profile Photo
      </Text>

      {/* Image Preview */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {imageUri ? (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
              }}
            />
            <Pressable
              onPress={removeImage}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 12,
                padding: 4,
              }}
            >
              <Icon name="close" size={16} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: 'rgba(0,0,0,0.1)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="account" size={64} style={{ opacity: 0.3 }} />
          </View>
        )}
      </View>

      {/* Upload Progress */}
      {isUploading && (
        <View style={{ marginBottom: 16 }}>
          <Progress value={uploadProgress} />
          <Text size="sm" style={{ textAlign: 'center', marginTop: 4 }}>
            Uploading... {uploadProgress}%
          </Text>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <Text intent="danger" style={{ textAlign: 'center', marginBottom: 16 }}>
          {error}
        </Text>
      )}

      {/* Action Buttons */}
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            type="outlined"
            onPress={pickImage}
            disabled={isUploading}
            style={{ flex: 1 }}
          >
            <Icon name="image" size={18} /> Gallery
          </Button>
          <Button
            type="outlined"
            onPress={takePhoto}
            disabled={isUploading}
            style={{ flex: 1 }}
          >
            <Icon name="camera" size={18} /> Camera
          </Button>
        </View>

        {imageUri && !imageUri.startsWith('http') && (
          <Button
            onPress={handleUpload}
            loading={isUploading}
            disabled={isUploading}
          >
            Upload Photo
          </Button>
        )}
      </View>
    </Card>
  );
}

// Usage
function ProfileScreen() {
  const uploadImage = async (uri: string): Promise<string> => {
    // Upload to your server/cloud storage
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { url } = await response.json();
    return url;
  };

  return (
    <ImageUpload
      currentImage="https://example.com/current-avatar.jpg"
      onUpload={uploadImage}
    />
  );
}`,
    explanation: `This image upload component provides:
- Pick from gallery or take photo
- Image preview with circular crop
- Upload progress indicator
- Error handling
- Remove/replace image option
- Works with any backend upload API`,
    tips: [
      "Add image compression before upload to reduce size",
      "Consider using a CDN for image hosting",
      "Implement retry logic for failed uploads",
    ],
    relatedRecipes: ["form-with-validation"],
  },
};

/**
 * Get all recipes grouped by category
 */
export function getRecipesByCategory(): Record<string, Recipe[]> {
  const grouped: Record<string, Recipe[]> = {};

  for (const recipe of Object.values(recipes)) {
    if (!grouped[recipe.category]) {
      grouped[recipe.category] = [];
    }
    grouped[recipe.category].push(recipe);
  }

  return grouped;
}

/**
 * Get a summary list of all recipes
 */
export function getRecipeSummary(): Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  packages: string[];
}> {
  return Object.entries(recipes).map(([id, recipe]) => ({
    id,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    packages: recipe.packages,
  }));
}

/**
 * Search recipes by query
 */
export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();

  return Object.values(recipes).filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.category.toLowerCase().includes(lowerQuery) ||
      recipe.packages.some((p) => p.toLowerCase().includes(lowerQuery))
  );
}
