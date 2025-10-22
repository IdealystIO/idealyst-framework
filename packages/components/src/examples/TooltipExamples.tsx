import React from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';
import Tooltip from '../Tooltip';

export const TooltipExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg">
    <View spacing="lg">
      <Text size="xl" weight="bold">Tooltip Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic Tooltip</Text>
        <Tooltip content="This is a tooltip">
          <Button variant="outlined">Hover over me</Button>
        </Tooltip>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Placements</Text>
        <View spacing="sm" style={{ alignItems: 'center' }}>
          <Tooltip content="Top tooltip" placement="top">
            <Button variant="outlined">Top</Button>
          </Tooltip>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Tooltip content="Left tooltip" placement="left">
              <Button variant="outlined">Left</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" placement="right">
              <Button variant="outlined">Right</Button>
            </Tooltip>
          </View>
          <Tooltip content="Bottom tooltip" placement="bottom">
            <Button variant="outlined">Bottom</Button>
          </Tooltip>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Tooltip content="Small tooltip" size="sm">
            <Button variant="outlined" size="sm">Small</Button>
          </Tooltip>
          <Tooltip content="Medium tooltip" size="md">
            <Button variant="outlined" size="md">Medium</Button>
          </Tooltip>
          <Tooltip content="Large tooltip" size="lg">
            <Button variant="outlined" size="lg">Large</Button>
          </Tooltip>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Intent Colors</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Tooltip content="Primary tooltip" intent="primary">
            <Button variant="contained" intent="primary">Primary</Button>
          </Tooltip>
          <Tooltip content="Success tooltip" intent="success">
            <Button variant="contained" intent="success">Success</Button>
          </Tooltip>
          <Tooltip content="Warning tooltip" intent="warning">
            <Button variant="contained" intent="warning">Warning</Button>
          </Tooltip>
          <Tooltip content="Error tooltip" intent="error">
            <Button variant="contained" intent="error">Error</Button>
          </Tooltip>
          <Tooltip content="Neutral tooltip" intent="neutral">
            <Button variant="contained" intent="neutral">Neutral</Button>
          </Tooltip>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Custom Delay</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Tooltip content="Instant (0ms)" delay={0}>
            <Button variant="outlined">No Delay</Button>
          </Tooltip>
          <Tooltip content="Quick (200ms)" delay={200}>
            <Button variant="outlined">Default</Button>
          </Tooltip>
          <Tooltip content="Slow (1000ms)" delay={1000}>
            <Button variant="outlined">Slow</Button>
          </Tooltip>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Long Content</Text>
        <Tooltip content="This is a longer tooltip that demonstrates how the component handles multi-line content automatically">
          <Button variant="outlined">Hover for long text</Button>
        </Tooltip>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">On Text</Text>
        <View>
          <Tooltip content="Additional information">
            <Text style={{ textDecorationLine: 'underline' }}>
              Hover over this text
            </Text>
          </Tooltip>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Rich Content</Text>
        <Tooltip
          content={
            <View spacing="xs">
              <Text weight="bold">Rich Tooltip</Text>
              <Text>With multiple lines</Text>
              <Text>and formatting</Text>
            </View>
          }
        >
          <Button variant="outlined">Rich Content</Button>
        </Tooltip>
      </View>
    </View>
    </Screen>
  );
};

export default TooltipExamples;
