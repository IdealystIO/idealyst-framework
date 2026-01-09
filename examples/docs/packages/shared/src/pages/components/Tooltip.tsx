import React from 'react';
import { View, Text, Tooltip, Button, Screen } from '@idealyst/components';
import { ComponentPlayground, tooltipPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper that provides children and content
function DemoTooltip(props: any) {
  return (
    <Tooltip {...props} content="This is a tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  );
}

export function TooltipPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Tooltip
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Contextual information popup that appears on hover or focus.
          Supports multiple placement positions and delay configuration.
        </Text>

        <ComponentPlayground
          component={DemoTooltip}
          componentName="Tooltip"
          propConfig={tooltipPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
