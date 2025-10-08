import React, { useState } from 'react';
import { View, Text } from '@idealyst/components';
import Slider from '../Slider';

export const SliderExamples: React.FC = () => {
  const [basicValue, setBasicValue] = useState(50);
  const [volumeValue, setVolumeValue] = useState(75);
  const [temperatureValue, setTemperatureValue] = useState(20);

  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Slider Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic Slider</Text>
        <Slider
          value={basicValue}
          onValueChange={setBasicValue}
          showValue
        />
        <Text size="small" color="secondary">Value: {basicValue}</Text>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Sizes</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View spacing="xs">
            <Text size="small">Small</Text>
            <Slider defaultValue={30} size="small" />
          </View>
          <View spacing="xs">
            <Text size="small">Medium (default)</Text>
            <Slider defaultValue={50} size="medium" />
          </View>
          <View spacing="xs">
            <Text size="small">Large</Text>
            <Slider defaultValue={70} size="large" />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent Colors</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View spacing="xs">
            <Text size="small">Primary</Text>
            <Slider defaultValue={60} intent="primary" />
          </View>
          <View spacing="xs">
            <Text size="small">Success</Text>
            <Slider defaultValue={60} intent="success" />
          </View>
          <View spacing="xs">
            <Text size="small">Error</Text>
            <Slider defaultValue={60} intent="error" />
          </View>
          <View spacing="xs">
            <Text size="small">Warning</Text>
            <Slider defaultValue={60} intent="warning" />
          </View>
          <View spacing="xs">
            <Text size="small">Neutral</Text>
            <Slider defaultValue={60} intent="neutral" />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Min/Max Labels</Text>
        <Slider
          defaultValue={50}
          showMinMax
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Custom Range & Step</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View spacing="xs">
            <Text size="small">Range: 0-10, Step: 1</Text>
            <Slider
              min={0}
              max={10}
              step={1}
              defaultValue={5}
              showValue
              showMinMax
            />
          </View>
          <View spacing="xs">
            <Text size="small">Range: -50 to 50, Step: 5</Text>
            <Slider
              min={-50}
              max={50}
              step={5}
              defaultValue={0}
              showValue
              showMinMax
            />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Marks</Text>
        <Slider
          min={0}
          max={100}
          defaultValue={50}
          marks={[
            { value: 0, label: '0%' },
            { value: 25, label: '25%' },
            { value: 50, label: '50%' },
            { value: 75, label: '75%' },
            { value: 100, label: '100%' },
          ]}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Volume Control</Text>
        <Slider
          value={volumeValue}
          onValueChange={setVolumeValue}
          min={0}
          max={100}
          showValue
          intent="primary"
          marks={[
            { value: 0, label: 'Mute' },
            { value: 50 },
            { value: 100, label: 'Max' },
          ]}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Temperature Control</Text>
        <Slider
          value={temperatureValue}
          onValueChange={setTemperatureValue}
          min={10}
          max={30}
          step={0.5}
          showValue
          showMinMax
          intent="warning"
        />
        <Text size="small" color="secondary">Temperature: {temperatureValue}°C</Text>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled</Text>
        <Slider
          defaultValue={60}
          disabled
        />
      </View>
    </View>
  );
};

export default SliderExamples;