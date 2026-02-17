import React from 'react';
import { View, Text, Grid, Card, Screen } from '@idealyst/components';
import { ComponentPlayground, gridPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper that coerces columns to number and provides sample children
function DemoGrid(props: any) {
  const { columns, ...rest } = props;
  const numColumns = columns ? Number(columns) : 2;

  return (
    <Grid {...rest} columns={numColumns}>
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} type="outlined" padding="md">
          <Text weight="medium">Item {i + 1}</Text>
        </Card>
      ))}
    </Grid>
  );
}

export function GridPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Grid
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Cross-platform responsive grid layout. Uses CSS Grid on web and
          flexbox wrapping on native. Supports responsive column counts
          that adapt to screen size.
        </Text>

        <ComponentPlayground
          component={DemoGrid}
          componentName="Grid"
          propConfig={gridPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
