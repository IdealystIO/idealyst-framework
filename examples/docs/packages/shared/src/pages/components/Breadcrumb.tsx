import React from 'react';
import { View, Text, Breadcrumb, Screen } from '@idealyst/components';
import { ComponentPlayground, breadcrumbPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper with sample items
function DemoBreadcrumb(props: any) {
  const items = [
    { label: 'Home', onPress: () => {} },
    { label: 'Products', onPress: () => {} },
    { label: 'Electronics', onPress: () => {} },
    { label: 'Phones' },
  ];
  return <Breadcrumb {...props} items={items} />;
}

export function BreadcrumbPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Breadcrumb
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Navigation trail showing the current page location within a hierarchy.
          Supports responsive collapsing and custom separators.
        </Text>

        <ComponentPlayground
          component={DemoBreadcrumb}
          componentName="Breadcrumb"
          propConfig={breadcrumbPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
