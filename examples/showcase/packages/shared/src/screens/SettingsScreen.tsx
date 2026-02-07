import React, { useState } from 'react';
import {
  Screen,
  View,
  Text,
  Card,
  Button,
  Icon,
  Switch,
  Divider,
  List,
  ListItem,
} from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';
import { UnistylesRuntime } from 'react-native-unistyles';
import { ThemeSettings } from '@idealyst/theme';

export const SettingsScreen: React.FC = () => {
  const { goBack, canGoBack } = useNavigator();
  const [theme, setTheme] = useState(UnistylesRuntime.themeName || 'light');
  const isDarkMode = theme === 'dark';

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    ThemeSettings.setTheme(newTheme, newTheme);
  };

  const selectTheme = (theme: 'light' | 'dark') => {
    setTheme(theme);
    ThemeSettings.setTheme(theme, theme);
  };

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        {/* Header with back button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {canGoBack() && (
            <Button
              type="text"
              size="sm"
              onPress={() => goBack()}
              leftIcon={<Icon name="arrow-left" size={20} />}
            >
              Back
            </Button>
          )}
          <Text typography="h3">Settings</Text>
        </View>

        {/* Appearance Section */}
        <View gap="md">
          <Text typography="subtitle1" color="secondary">
            APPEARANCE
          </Text>

          <Card type="outlined">
            {/* Dark Mode Toggle */}
            <View
              padding="md"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View
                  radius="md"
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDarkMode ? '#312e81' : '#fef3c7',
                  }}
                >
                  <Icon
                    name={isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny'}
                    size={22}
                    intent={isDarkMode ? 'primary' : 'warning'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="medium">Dark Mode</Text>
                  <Text typography="caption" color="secondary">
                    {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
                  </Text>
                </View>
              </View>
              <Switch checked={isDarkMode} onChange={handleThemeToggle} intent="primary" />
            </View>

            <Divider />

            {/* Theme Preview Cards */}
            <View padding="md" style={{ flexDirection: 'row', gap: 12 }}>
              {/* Light Theme */}
              <Card
                type="outlined"
                onPress={() => selectTheme('light')}
                intent={theme === 'light' ? 'primary' : 'neutral'}
                style={{ flex: 1, padding: 0, overflow: 'hidden' }}
              >
                <View style={{ padding: 12, gap: 8, backgroundColor: '#ffffff' }}>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: '#e5e5e5' }} />
                  <View
                    style={{ height: 8, borderRadius: 4, backgroundColor: '#e5e5e5', width: '80%' }}
                  />
                  <View
                    style={{ height: 8, borderRadius: 4, backgroundColor: '#3b82f6', width: '60%' }}
                  />
                </View>
                <View background="secondary" padding="sm" style={{ alignItems: 'center' }}>
                  <Text typography="caption" weight="medium">
                    Light
                  </Text>
                </View>
              </Card>

              {/* Dark Theme */}
              <Card
                type="outlined"
                onPress={() => selectTheme('dark')}
                intent={theme === 'dark' ? 'primary' : 'neutral'}
                style={{ flex: 1, padding: 0, overflow: 'hidden' }}
              >
                <View style={{ padding: 12, gap: 8, backgroundColor: '#1a1a1a' }}>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: '#333333' }} />
                  <View
                    style={{ height: 8, borderRadius: 4, backgroundColor: '#333333', width: '80%' }}
                  />
                  <View
                    style={{ height: 8, borderRadius: 4, backgroundColor: '#3b82f6', width: '60%' }}
                  />
                </View>
                <View background="secondary" padding="sm" style={{ alignItems: 'center' }}>
                  <Text typography="caption" weight="medium">
                    Dark
                  </Text>
                </View>
              </Card>
            </View>
          </Card>
        </View>

        {/* Preferences Section */}
        <View gap="md">
          <Text typography="subtitle1" color="secondary">
            PREFERENCES
          </Text>

          <Card type="outlined">
            <List>
              <ListItem
                label="Notifications"
                leading={<Icon name="bell-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
              <ListItem
                label="Language"
                leading={<Icon name="translate" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
              <ListItem
                label="Accessibility"
                leading={<Icon name="human" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
            </List>
          </Card>
        </View>

        {/* About Section */}
        <View gap="md">
          <Text typography="subtitle1" color="secondary">
            ABOUT
          </Text>

          <Card type="outlined">
            <List>
              <ListItem
                label="Privacy Policy"
                leading={<Icon name="shield-check-outline" size={24} />}
                trailing={<Icon name="open-in-new" size={20} />}
              />
              <ListItem
                label="Terms of Service"
                leading={<Icon name="file-document-outline" size={24} />}
                trailing={<Icon name="open-in-new" size={20} />}
              />
              <ListItem
                label="Licenses"
                leading={<Icon name="license" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
            </List>
          </Card>
        </View>

        {/* Version Info */}
        <View style={{ alignItems: 'center', paddingVertical: 24, gap: 4 }}>
          <Icon name="application-outline" size={32} textColor='primary' />
          <Text typography="caption" color="secondary">
            Idealyst Showcase
          </Text>
          <Text typography="caption" color="secondary">
            Version 1.0.0 | Theme: {theme}
          </Text>
        </View>
      </View>
    </Screen>
  );
};

export default SettingsScreen;
