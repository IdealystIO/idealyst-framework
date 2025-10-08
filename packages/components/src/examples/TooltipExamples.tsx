import React from 'react';
import { View, Text, Button } from '@idealyst/components';
import Tooltip from '../Tooltip';

export const TooltipExamples: React.FC = () => {
  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Tooltip Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic Tooltip</Text>
        <Tooltip content="This is a tooltip">
          <Button variant="outlined">Hover over me</Button>
        </Tooltip>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Placements</Text>
        <View spacing="sm" style={{ alignItems: 'center' }}>
          <Tooltip content="Top tooltip" placement="top">
            <Button variant="outlined">Top</Button>
          </Tooltip>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Tooltip content="Left tooltip" placement="left">
              <Button variant="outlined">Left</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" placement="right">
              <Button variant="outlined">Right</Button>
            </Tooltip>
          </div>
          <Tooltip content="Bottom tooltip" placement="bottom">
            <Button variant="outlined">Bottom</Button>
          </Tooltip>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Sizes</Text>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Tooltip content="Small tooltip" size="small">
            <Button variant="outlined" size="small">Small</Button>
          </Tooltip>
          <Tooltip content="Medium tooltip" size="medium">
            <Button variant="outlined" size="medium">Medium</Button>
          </Tooltip>
          <Tooltip content="Large tooltip" size="large">
            <Button variant="outlined" size="large">Large</Button>
          </Tooltip>
        </div>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent Colors</Text>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
        </div>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Custom Delay</Text>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Tooltip content="Instant (0ms)" delay={0}>
            <Button variant="outlined">No Delay</Button>
          </Tooltip>
          <Tooltip content="Quick (200ms)" delay={200}>
            <Button variant="outlined">Default</Button>
          </Tooltip>
          <Tooltip content="Slow (1000ms)" delay={1000}>
            <Button variant="outlined">Slow</Button>
          </Tooltip>
        </div>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Long Content</Text>
        <Tooltip content="This is a longer tooltip that demonstrates how the component handles multi-line content automatically">
          <Button variant="outlined">Hover for long text</Button>
        </Tooltip>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">On Text</Text>
        <div>
          <Tooltip content="Additional information">
            <Text style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Hover over this text
            </Text>
          </Tooltip>
        </div>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Rich Content</Text>
        <Tooltip
          content={
            <div>
              <strong>Rich Tooltip</strong>
              <div>With multiple lines</div>
              <div>and formatting</div>
            </div>
          }
        >
          <Button variant="outlined">Rich Content</Button>
        </Tooltip>
      </View>
    </View>
  );
};

export default TooltipExamples;
