import React from 'react';
import { View, Text, Button, Card, Screen } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';
import { useTranslation } from '@idealyst/translate';

export function HomePage() {
  const { navigate } = useNavigator();
  const { t } = useTranslation('home');

  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text
          typography="h2"
          weight="bold"
          style={{ marginBottom: 16 }}
        >
          {t('title')}
        </Text>

        <Text
          typography="body1"
          color="secondary"
          style={{ marginBottom: 32, lineHeight: 28 }}
        >
          {t('description')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 48 }}>
          <Button
            intent="primary"
            size="lg"
            onPress={() => navigate({ path: '/installation' })}
          >
            {t('getStarted')}
          </Button>
          <Button
            intent="neutral"
            type="outlined"
            size="lg"
            onPress={() => navigate({ path: '/components/overview' })}
          >
            {t('viewComponents')}
          </Button>
        </View>

        <Text
          weight="semibold"
          typography="h4"
          style={{ marginBottom: 16 }}
        >
          {t('keyFeatures')}
        </Text>

        <View style={{ gap: 16 }}>
          <FeatureCard
            title={t('features.crossPlatform.title')}
            description={t('features.crossPlatform.description')}
          />
          <FeatureCard
            title={t('features.theme.title')}
            description={t('features.theme.description')}
          />
          <FeatureCard
            title={t('features.styleExtensions.title')}
            description={t('features.styleExtensions.description')}
          />
          <FeatureCard
            title={t('features.typeSafe.title')}
            description={t('features.typeSafe.description')}
          />
          <FeatureCard
            title={t('features.navigation.title')}
            description={t('features.navigation.description')}
          />
        </View>
      </View>
    </Screen>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card
      variant="outlined"
      style={{ padding: 20 }}
    >
      <Text weight="semibold" style={{ marginBottom: 8 }}>
        {title}
      </Text>
      <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
        {description}
      </Text>
    </Card>
  );
}
