import React from 'react';
import { View, Text, Card, Button, Chip, Badge, Switch, Screen } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';
import { useTranslation } from '@idealyst/translate';
import { LivePreview } from '../../components/LivePreview';

const componentCategories = [
  {
    key: 'layout',
    components: ['View', 'Screen', 'Divider'],
  },
  {
    key: 'form',
    components: ['Button', 'Input', 'Checkbox', 'Select', 'Switch', 'RadioButton', 'Slider', 'TextArea'],
  },
  {
    key: 'display',
    components: ['Text', 'Card', 'Badge', 'Chip', 'Avatar', 'Icon', 'Skeleton', 'Alert'],
  },
  {
    key: 'navigation',
    components: ['TabBar', 'Breadcrumb', 'Menu', 'List'],
  },
  {
    key: 'overlay',
    components: ['Dialog', 'Popover', 'Tooltip'],
  },
  {
    key: 'data',
    components: ['Table', 'Progress'],
  },
];

export function ComponentsOverviewPage() {
  const { navigate } = useNavigator();
  const { t } = useTranslation('components');

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          {t('overview.title')}
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          {t('overview.description')}
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 16 }}>
          {t('overview.preview')}
        </Text>

        <LivePreview title={t('overview.interactiveComponents')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <Button>Primary Button</Button>
            <Button intent="success" type="outlined">Success</Button>
            <Chip>Chip</Chip>
            <Badge>3</Badge>
            <Switch />
          </View>
        </LivePreview>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 16 }}>
          {t('overview.categories')}
        </Text>

        {componentCategories.map((category) => (
          <View key={category.key} style={{ marginBottom: 24 }}>
            <Text weight="semibold" style={{ marginBottom: 12 }}>
              {t(`overview.categoryNames.${category.key}`)}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {category.components.map((component) => (
                <Chip
                  key={component}
                  onPress={() => navigate({ path: `/components/${component.toLowerCase()}` })}
                  type="outlined"
                >
                  {component}
                </Chip>
              ))}
            </View>
          </View>
        ))}

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          {t('overview.commonProps.title')}
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <Text weight="semibold" style={{ marginBottom: 8 }}>
            {t('overview.commonProps.intentColors.title')}
          </Text>
          <Text typography="body2" color="tertiary" style={{ marginBottom: 16 }}>
            {t('overview.commonProps.intentColors.description')}
          </Text>

          <Text weight="semibold" style={{ marginBottom: 8 }}>
            {t('overview.commonProps.variants.title')}
          </Text>
          <Text typography="body2" color="tertiary" style={{ marginBottom: 16 }}>
            {t('overview.commonProps.variants.description')}
          </Text>

          <Text weight="semibold" style={{ marginBottom: 8 }}>
            {t('overview.commonProps.sizes.title')}
          </Text>
          <Text typography="body2" color="tertiary">
            {t('overview.commonProps.sizes.description')}
          </Text>
        </Card>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          {t('overview.importPattern')}
        </Text>

        <View background="inverse" style={{ padding: 16, borderRadius: 8 }}>
          <Text
            typography="body2"
            color="inverse"
            style={{ fontFamily: 'monospace' }}
          >
            {`import { Button, Card, Text, View } from '@idealyst/components';`}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
