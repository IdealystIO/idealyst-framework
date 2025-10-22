import React, { useState } from 'react';
import { Screen, View, Text } from '@idealyst/components';
import Slider from '../Slider';

export const SliderExamples: React.FC = () => {
  const [basicValue, setBasicValue] = useState(50);
  const [volumeValue, setVolumeValue] = useState(75);
  const [temperatureValue, setTemperatureValue] = useState(20);

  return (
    <Screen background="primary" padding="lg">
      <View spacing="lg">
        <Text size="xl" weight="bold">Slider Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic Slider</Text>
        <Slider
          value={basicValue}
          onValueChange={setBasicValue}
          showValue
        />
        <Text size="sm" color="secondary">Value: {basicValue}</Text>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Sizes</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View spacing="xs">
            <Text size="sm">Small</Text>
            <Slider defaultValue={30} size="sm" />
          </View>
          <View spacing="xs">
            <Text size="sm">Medium (default)</Text>
            <Slider defaultValue={50} size="md" />
          </View>
          <View spacing="xs">
            <Text size="sm">Large</Text>
            <Slider defaultValue={70} size="lg" />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Intent Colors</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View spacing="xs">
            <Text size="sm">Primary</Text>
            <Slider defaultValue={60} intent="primary" />
          </View>
          <View spacing="xs">
            <Text size="sm">Success</Text>
            <Slider defaultValue={60} intent="success" />
          </View>
          <View spacing="xs">
            <Text size="sm">Error</Text>
            <Slider defaultValue={60} intent="error" />
          </View>
          <View spacing="xs">
            <Text size="sm">Warning</Text>
            <Slider defaultValue={60} intent="warning" />
          </View>
          <View spacing="xs">
            <Text size="sm">Neutral</Text>
            <Slider defaultValue={60} intent="neutral" />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">With Min/Max Labels</Text>
        <Slider
          defaultValue={50}
          showMinMax
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Custom Range & Step</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View spacing="xs">
            <Text size="sm">Range: 0-10, Step: 1</Text>
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
            <Text size="sm">Range: -50 to 50, Step: 5</Text>
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
        <Text size="lg" weight="semibold">With Marks</Text>
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
        <Text size="lg" weight="semibold">Volume Control</Text>
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
        <Text size="lg" weight="semibold">With Icons</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View spacing="xs">
            <Text size="sm">Volume with icon</Text>
            <Slider
              defaultValue={60}
              icon="volume-high"
              intent="primary"
              showMinMax
            />
          </View>
          <View spacing="xs">
            <Text size="sm">Brightness with icon</Text>
            <Slider
              defaultValue={75}
              icon="brightness-6"
              intent="warning"
              showMinMax
            />
          </View>
          <View spacing="xs">
            <Text size="sm">Temperature with icon</Text>
            <Slider
              defaultValue={22}
              min={10}
              max={30}
              icon="thermometer"
              intent="error"
              showMinMax
            />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Temperature Control</Text>
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
        <Text size="sm" color="secondary">Temperature: {temperatureValue}°C</Text>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Disabled</Text>
        <Slider
          defaultValue={60}
          disabled
        />
      </View>
      </View>
    </Screen>
  );
};

export default SliderExamples;