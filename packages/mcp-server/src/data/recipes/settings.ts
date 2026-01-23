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
        <Card>
          <Text variant="title" style={{ marginBottom: 16 }}>
            Notifications
          </Text>

          <SettingRow icon="bell" label="Push Notifications" description="Receive push notifications">
            <Switch
              checked={settings.notifications}
              onChange={(v) => updateSetting('notifications', v)}
            />
          </SettingRow>

          <Divider />

          <SettingRow icon="email" label="Email Updates" description="Receive weekly email updates">
            <Switch
              checked={settings.emailUpdates}
              onChange={(v) => updateSetting('emailUpdates', v)}
            />
          </SettingRow>
        </Card>

        <Card>
          <Text variant="title" style={{ marginBottom: 16 }}>
            Appearance
          </Text>

          <SettingRow icon="theme-light-dark" label="Dark Mode" description="Use dark theme">
            <Switch
              checked={settings.darkMode}
              onChange={(v) => updateSetting('darkMode', v)}
            />
          </SettingRow>

          <Divider />

          <SettingRow icon="format-size" label="Font Size">
            <Select
              value={settings.fontSize}
              onChange={(v) => updateSetting('fontSize', v)}
              options={[
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ]}
              style={{ width: 120 }}
            />
          </SettingRow>
        </Card>
      </View>
    </ScrollView>
  );
}

function SettingRow({ icon, label, description, children }: {
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
          {description && <Text size="sm" style={{ opacity: 0.7 }}>{description}</Text>}
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
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(mode);
    }
  }, [mode, isLoaded]);

  const loadTheme = async () => {
    const saved = await storage.get<ThemeMode>('theme-mode');
    if (saved) setModeState(saved);
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
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export function ThemeToggle() {
  const { isDark, setMode } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Icon name={isDark ? 'weather-night' : 'weather-sunny'} size={24} />
      <Text>Dark Mode</Text>
      <Switch
        checked={isDark}
        onChange={(checked) => setMode(checked ? 'dark' : 'light')}
      />
    </View>
  );
}

export function ThemeSelector() {
  const { mode, setMode } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      {(['light', 'dark', 'system'] as const).map((m) => (
        <Pressable key={m} onPress={() => setMode(m)}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            borderRadius: 8,
            backgroundColor: mode === m ? 'rgba(0,0,0,0.1)' : 'transparent',
          }}>
            <Icon name={m === 'light' ? 'weather-sunny' : m === 'dark' ? 'weather-night' : 'cellphone'} size={20} />
            <Text style={{ textTransform: 'capitalize' }}>{m}</Text>
            {mode === m && <Icon name="check" size={20} intent="success" />}
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
- Integration with Unistyles runtime
- Both simple toggle and full selector UI components`,
    tips: [
      "Wrap your app root with ThemeProvider",
      "The system option follows device settings automatically",
      "Theme changes are instant with no reload required",
    ],
    relatedRecipes: ["settings-screen"],
  },
};
