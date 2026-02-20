/**
 * Settings Recipes - App settings and preferences
 */

import { Recipe } from "./types.js";

export const settingsRecipes: Record<string, Recipe> = {
  "settings-screen": {
    name: "Settings Screen",
    description: "App settings screen with toggles, selections, and grouped options",
    category: "settings",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme", "@idealyst/storage"],
    code: `import React, { useState, useEffect } from 'react';
import {
  Screen, View, Text, Switch, Select, Card, Divider, Icon,
} from '@idealyst/components';
import type { IconName } from '@idealyst/components';
import { ThemeSettings } from '@idealyst/theme';
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
      const raw = await storage.getItem('user-settings');
      if (raw) {
        setSettings(JSON.parse(raw) as Settings);
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
    await storage.setItem('user-settings', JSON.stringify(newSettings));

    // Apply dark mode toggle immediately
    if (key === 'darkMode') {
      const isDark = value as boolean;
      ThemeSettings.setAdaptiveThemes(false);
      // setTheme(lightTheme, darkTheme) — pass same value for both to force a single mode
      ThemeSettings.setTheme(isDark ? 'dark' : 'light', isDark ? 'dark' : 'light');
    }
  };

  if (isLoading) {
    return (
      <Screen safeArea padding="md">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text typography="body1">Loading...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable safeArea padding="md">
      <View gap="md">
        <Text typography="h5" weight="bold">Settings</Text>

        <Card padding="md" gap="sm">
          <Text typography="h6" weight="semibold">Notifications</Text>

          <SettingRow icon="bell" label="Push Notifications" description="Receive push notifications">
            <Switch
              checked={settings.notifications}
              onChange={(v) => updateSetting('notifications', v)}
            />
          </SettingRow>

          <Divider spacing="xs" />

          <SettingRow icon="email" label="Email Updates" description="Receive weekly email updates">
            <Switch
              checked={settings.emailUpdates}
              onChange={(v) => updateSetting('emailUpdates', v)}
            />
          </SettingRow>
        </Card>

        <Card padding="md" gap="sm">
          <Text typography="h6" weight="semibold">Appearance</Text>

          <SettingRow icon="theme-light-dark" label="Dark Mode" description="Use dark theme">
            <Switch
              checked={settings.darkMode}
              onChange={(v) => updateSetting('darkMode', v)}
            />
          </SettingRow>

          <Divider spacing="xs" />

          <SettingRow icon="format-size" label="Font Size">
            <Select
              value={settings.fontSize}
              onChange={(v) => updateSetting('fontSize', v)}
              options={[
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ]}
            />
          </SettingRow>
        </Card>
      </View>
    </Screen>
  );
}

function SettingRow({ icon, label, description, children }: {
  icon: IconName;
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <Icon name={icon} size="sm" />
        <View style={{ flex: 1 }}>
          <Text typography="body1">{label}</Text>
          {description && <Text typography="caption" color="tertiary">{description}</Text>}
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
- Reusable SettingRow component with IconName typing
- Theme switching via ThemeSettings (not direct Unistyles)`,
    tips: [
      "Consider debouncing saves for rapid toggles",
      "Add a 'Reset to Defaults' option",
      "Use IconName type (not string) when passing icon names through props",
      "Use ThemeSettings.setTheme() for theme switching — never import from react-native-unistyles",
      "Button uses leftIcon/rightIcon — NOT icon. <Button leftIcon=\"check\">Save</Button>",
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
import { ThemeSettings, getColorScheme } from '@idealyst/theme';
import { storage } from '@idealyst/storage';
import { Switch, View, Text, Icon, Pressable } from '@idealyst/components';

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

    if (mode === 'system') {
      ThemeSettings.setAdaptiveThemes(true);
    } else {
      ThemeSettings.setAdaptiveThemes(false);
      // setTheme(lightTheme, darkTheme) — pass same value for both to force a single mode
      ThemeSettings.setTheme(mode, mode);
    }
  }, [mode, isLoaded]);

  const loadTheme = async () => {
    const saved = await storage.getItem('theme-mode');
    if (saved) setModeState(saved as ThemeMode);
    setIsLoaded(true);
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await storage.setItem('theme-mode', newMode);
  };

  const isDark = mode === 'dark' ||
    (mode === 'system' && getColorScheme() === 'dark');

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeMode must be used within ThemeProvider');
  return context;
}

export function ThemeToggle() {
  const { isDark, setMode } = useThemeMode();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Icon name={isDark ? 'weather-night' : 'weather-sunny'} size="sm" />
      <Text typography="body1">Dark Mode</Text>
      <Switch
        checked={isDark}
        onChange={(checked) => setMode(checked ? 'dark' : 'light')}
      />
    </View>
  );
}

export function ThemeSelector() {
  const { mode, setMode } = useThemeMode();

  return (
    <View gap="sm">
      {(['light', 'dark', 'system'] as const).map((m) => (
        <Pressable key={m} onPress={() => setMode(m)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 8,
              backgroundColor: mode === m ? 'rgba(0,0,0,0.1)' : 'transparent',
            }}
          >
            <Icon
              name={m === 'light' ? 'weather-sunny' : m === 'dark' ? 'weather-night' : 'cellphone'}
              size="sm"
            />
            <Text typography="body1" style={{ textTransform: 'capitalize' }}>{m}</Text>
            {mode === m && <Icon name="check" size="sm" intent="success" />}
          </View>
        </Pressable>
      ))}
    </View>
  );
}`,
    explanation: `This theme switcher provides:
- ThemeProvider context for app-wide theme state
- Persistence with @idealyst/storage
- Support for light, dark, and system-follow modes
- Uses ThemeSettings and getColorScheme from @idealyst/theme (not Unistyles directly)
- Both simple toggle and full selector UI components`,
    tips: [
      "Wrap your app root with ThemeProvider",
      "The system option follows device settings automatically via ThemeSettings.setAdaptiveThemes()",
      "Theme changes are instant with no reload required",
      "Never import from react-native-unistyles — use @idealyst/theme utilities instead",
    ],
    relatedRecipes: ["settings-screen"],
  },

  "profile-screen": {
    name: "Profile Screen",
    description:
      "User profile screen with avatar, info display, edit form, and skeleton loading state",
    category: "settings",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { useState } from 'react';
import {
  Screen, View, Text, TextInput, TextArea, Button, Card,
  Avatar, Icon, Skeleton, Divider, Pressable,
} from '@idealyst/components';
import type { IconName } from '@idealyst/components';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

const mockUser: UserProfile = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  bio: 'Software engineer who loves building cross-platform apps.',
  avatarUrl: 'https://i.pravatar.cc/150?u=jane',
};

export function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfile>(mockUser);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Screen safeArea padding="md">
        <ProfileSkeleton />
      </Screen>
    );
  }

  if (!user) return null;

  const handleSave = () => {
    setUser(editData);
    setIsEditing(false);
  };

  return (
    <Screen scrollable safeArea padding="md">
      <View gap="md">
        {/* Profile Header */}
        <Card padding="lg">
          <View style={{ alignItems: 'center' }} gap="sm">
            <Avatar src={user.avatarUrl} fallback={user.name.slice(0, 2)} size="xl" />
            <Text typography="h5" weight="bold">{user.name}</Text>
            <Text typography="body2" color="secondary">{user.email}</Text>
            {user.bio ? (
              <Text typography="body2" style={{ textAlign: 'center' }}>{user.bio}</Text>
            ) : null}
          </View>
        </Card>

        {/* Edit Profile Section */}
        {isEditing ? (
          <Card padding="md">
            <Text typography="h6" weight="semibold" style={{ marginBottom: 16 }}>Edit Profile</Text>
            <View gap="md">
              <View>
                <Text typography="body2" weight="semibold" style={{ marginBottom: 4 }}>Name</Text>
                <TextInput
                  value={editData.name}
                  onChangeText={(v) => setEditData({ ...editData, name: v })}
                  placeholder="Your name"
                />
              </View>
              <View>
                <Text typography="body2" weight="semibold" style={{ marginBottom: 4 }}>Email</Text>
                <TextInput
                  value={editData.email}
                  onChangeText={(v) => setEditData({ ...editData, email: v })}
                  placeholder="you@example.com"
                  inputMode="email"
                  autoCapitalize="none"
                />
              </View>
              <TextArea
                label="Bio"
                value={editData.bio}
                onChange={(v) => setEditData({ ...editData, bio: v })}
                placeholder="Tell us about yourself..."
                rows={3}
              />
              <View style={{ flexDirection: 'row' }} gap="sm">
                <Button onPress={() => setIsEditing(false)} type="outlined" style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button onPress={handleSave} intent="primary" style={{ flex: 1 }}>
                  Save
                </Button>
              </View>
            </View>
          </Card>
        ) : (
          <Button
            onPress={() => { setEditData(user); setIsEditing(true); }}
            type="outlined"
            leftIcon="account-edit"
          >
            Edit Profile
          </Button>
        )}

        {/* Profile Menu */}
        <Card padding="md" gap="xs">
          <ProfileMenuItem icon="cog" label="Settings" onPress={() => {}} />
          <Divider spacing="xs" />
          <ProfileMenuItem icon="bell" label="Notifications" onPress={() => {}} />
          <Divider spacing="xs" />
          <ProfileMenuItem icon="shield-check" label="Privacy" onPress={() => {}} />
          <Divider spacing="xs" />
          <ProfileMenuItem icon="help-circle" label="Help & Support" onPress={() => {}} />
        </Card>

        <Button onPress={() => {}} intent="danger" type="text" leftIcon="logout">
          Log Out
        </Button>
      </View>
    </Screen>
  );
}

function ProfileMenuItem({ icon, label, onPress }: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name={icon} size="sm" />
          <Text typography="body1">{label}</Text>
        </View>
        <Icon name="chevron-right" size="sm" />
      </View>
    </Pressable>
  );
}

function ProfileSkeleton() {
  return (
    <View gap="md">
      <Card padding="lg">
        <View style={{ alignItems: 'center' }} gap="sm">
          <Skeleton shape="circle" width={80} height={80} />
          <Skeleton width={150} height={16} />
          <Skeleton width={200} height={14} />
          <Skeleton width={250} height={14} />
        </View>
      </Card>
      <Skeleton width="100%" height={48} shape="rounded" />
      <Card padding="md" gap="sm">
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
      </Card>
    </View>
  );
}`,
    explanation: `This profile screen demonstrates:
- User info display with Avatar, name, email, and bio
- Inline edit form toggling with TextInput and TextArea
- Skeleton loading state while user data loads
- Pressable menu items with icons (NOT View with onPress)
- IconName typing for icon props (NOT string)
- Button with leftIcon/rightIcon (NOT icon prop)
- Card used as simple container (NO Card.Content/Card.Header)`,
    tips: [
      "Use Pressable for interactive rows — View does NOT have onPress",
      "Avatar uses src for image URL and fallback for initials",
      "TextInput does NOT have label/error props — compose with Text + View",
      "TextArea DOES have label and error props",
      "Use leftIcon on Button, not icon: <Button leftIcon=\"edit\">Edit</Button>",
      "Skeleton uses 'shape' prop: 'rectangle' | 'circle' | 'rounded' (NOT 'variant')",
    ],
    relatedRecipes: ["settings-screen", "form-with-validation", "skeleton-loading"],
  },
};
