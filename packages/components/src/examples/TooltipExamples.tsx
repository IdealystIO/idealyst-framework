import React from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';
import Tooltip from '../Tooltip';

export const TooltipExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg">
    <View gap="lg">
      <Text typography="h3">Tooltip Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic Tooltip</Text>
        <Tooltip content="This is a tooltip">
          <Button type="outlined">Hover over me</Button>
        </Tooltip>
      </View>

      <View gap="md">
        <Text typography="h5">Placements</Text>
        <View gap="sm" style={{ alignItems: 'center' }}>
          <Tooltip content="Top tooltip" placement="top">
            <Button type="outlined">Top</Button>
          </Tooltip>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Tooltip content="Left tooltip" placement="left">
              <Button type="outlined">Left</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" placement="right">
              <Button type="outlined">Right</Button>
            </Tooltip>
          </View>
          <Tooltip content="Bottom tooltip" placement="bottom">
            <Button type="outlined">Bottom</Button>
          </Tooltip>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Tooltip content="Small tooltip" size="sm">
            <Button type="outlined" size="sm">Small</Button>
          </Tooltip>
          <Tooltip content="Medium tooltip" size="md">
            <Button type="outlined" size="md">Medium</Button>
          </Tooltip>
          <Tooltip content="Large tooltip" size="lg">
            <Button type="outlined" size="lg">Large</Button>
          </Tooltip>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Intent Colors</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Tooltip content="Primary tooltip" intent="primary">
            <Button type="contained" intent="primary">Primary</Button>
          </Tooltip>
          <Tooltip content="Success tooltip" intent="success">
            <Button type="contained" intent="success">Success</Button>
          </Tooltip>
          <Tooltip content="Warning tooltip" intent="warning">
            <Button type="contained" intent="warning">Warning</Button>
          </Tooltip>
          <Tooltip content="Error tooltip" intent="error">
            <Button type="contained" intent="error">Error</Button>
          </Tooltip>
          <Tooltip content="Neutral tooltip" intent="neutral">
            <Button type="contained" intent="neutral">Neutral</Button>
          </Tooltip>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Custom Delay</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Tooltip content="Instant (0ms)" delay={0}>
            <Button type="outlined">No Delay</Button>
          </Tooltip>
          <Tooltip content="Quick (200ms)" delay={200}>
            <Button type="outlined">Default</Button>
          </Tooltip>
          <Tooltip content="Slow (1000ms)" delay={1000}>
            <Button type="outlined">Slow</Button>
          </Tooltip>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Long Content</Text>
        <Tooltip content="This is a longer tooltip that demonstrates how the component handles multi-line content automatically">
          <Button type="outlined">Hover for long text</Button>
        </Tooltip>
      </View>

      <View gap="md">
        <Text typography="h5">On Text</Text>
        <View gap="xl">
          <Tooltip content="Additional information">
            <Text style={{ textDecorationLine: 'underline' }}>
              Hover over this text
            </Text>
          </Tooltip>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Rich Content</Text>
        <Tooltip
          content={
            <View gap="xs">
              <Text weight="bold">Rich Tooltip</Text>
              <Text>With multiple lines</Text>
              <Text>and formatting</Text>
            </View>
          }
        >
          <Button type="outlined">Rich Content</Button>
        </Tooltip>
      </View>
    </View>
    </Screen>
  );
};

export default TooltipExamples;
