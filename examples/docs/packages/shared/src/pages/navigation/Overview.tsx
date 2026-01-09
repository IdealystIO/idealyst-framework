import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { useTranslation } from '@idealyst/translate';
import { CodeBlock } from '../../components/CodeBlock';

export function NavigationOverviewPage() {
  const { t } = useTranslation('navigation');

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          {t('overview.title')}
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          {t('overview.description')}
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('overview.architecture.title')}
        </Text>

        <View
          background="inverse"
          style={{
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <Text
            typography="body2"
            color="inverse"
            style={{ fontFamily: 'monospace', lineHeight: 20 }}
          >
{`┌─────────────────────────────────────────────────┐
│           NavigatorProvider                      │
│  (Wraps app with routing context)                │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│         NavigatorParam (Route Config)            │
│  • Stack layouts (push/pop navigation)           │
│  • Tab layouts (bottom tab bar)                  │
│  • Drawer layouts (side menu)                    │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│           Platform Adapters                      │
│  • Web: react-router-dom                         │
│  • Native: @react-navigation/native              │
└─────────────────────────────────────────────────┘`}
          </Text>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('overview.keyConcepts.title')}
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              {t('overview.keyConcepts.navigatorProvider.title')}
            </Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              {t('overview.keyConcepts.navigatorProvider.description')}
            </Text>
          </Card>

          <Card variant="outlined" style={{ padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              {t('overview.keyConcepts.navigatorParam.title')}
            </Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              {t('overview.keyConcepts.navigatorParam.description')}
            </Text>
          </Card>

          <Card variant="outlined" style={{ padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              {t('overview.keyConcepts.useNavigator.title')}
            </Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              {t('overview.keyConcepts.useNavigator.description')}
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('overview.quickStart.title')}
        </Text>

        <CodeBlock title={t('overview.quickStart.codeTitle')}>
{`import { NavigatorProvider, NavigatorParam } from '@idealyst/navigation';
import { HomeScreen } from './screens/Home';
import { ProfileScreen } from './screens/Profile';
import { SettingsScreen } from './screens/Settings';

// Define your routes
const AppRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  routes: [
    { path: '/', type: 'screen', component: HomeScreen },
    { path: 'profile', type: 'screen', component: ProfileScreen },
    { path: 'settings', type: 'screen', component: SettingsScreen },
  ],
};

// Wrap your app
export function App() {
  return <NavigatorProvider route={AppRouter} />;
}`}
        </CodeBlock>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          {t('overview.layoutTypes.title')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <Card variant="outlined" style={{ flex: 1, minWidth: 200, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              {t('overview.layoutTypes.stack.title')}
            </Text>
            <Text typography="body2" color="tertiary">
              {t('overview.layoutTypes.stack.description')}
            </Text>
          </Card>

          <Card variant="outlined" style={{ flex: 1, minWidth: 200, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              {t('overview.layoutTypes.tab.title')}
            </Text>
            <Text typography="body2" color="tertiary">
              {t('overview.layoutTypes.tab.description')}
            </Text>
          </Card>

          <Card variant="outlined" style={{ flex: 1, minWidth: 200, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              {t('overview.layoutTypes.drawer.title')}
            </Text>
            <Text typography="body2" color="tertiary">
              {t('overview.layoutTypes.drawer.description')}
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('overview.example.title')}
        </Text>

        <CodeBlock title={t('overview.example.codeTitle')}>
{`import { useNavigator } from '@idealyst/navigation';
import { Button } from '@idealyst/components';

function HomeScreen() {
  const { navigate, goBack } = useNavigator();

  return (
    <View>
      {/* Path-based navigation */}
      <Button onPress={() => navigate({ path: '/profile' })}>
        Go to Profile
      </Button>

      {/* With parameters */}
      <Button onPress={() => navigate({ path: '/profile/123' })}>
        View User 123
      </Button>

      {/* Go back */}
      <Button onPress={() => goBack()}>
        Go Back
      </Button>
    </View>
  );
}`}
        </CodeBlock>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          {t('overview.platformDifferences.title')}
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              {t('overview.platformDifferences.web.title')}
            </Text>
            <Text typography="body2" color="tertiary">
              {t('overview.platformDifferences.web.description')}
            </Text>
          </View>

          <View>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              {t('overview.platformDifferences.native.title')}
            </Text>
            <Text typography="body2" color="tertiary">
              {t('overview.platformDifferences.native.description')}
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
