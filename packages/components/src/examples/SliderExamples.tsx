import React, { useState } from 'react';
import { Screen, View, Text } from '@idealyst/components';
import Slider from '../Slider';

export const SliderExamples: React.FC = () => {
  const [basicValue, setBasicValue] = useState(50);
  const [volumeValue, setVolumeValue] = useState(75);
  const [temperatureValue, setTemperatureValue] = useState(20);

  return (
    <Screen background="primary" padding="lg">
      <View gap="lg">
        <Text typography="h3">Slider Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic Slider</Text>
        <Slider
          value={basicValue}
          onChange={setBasicValue}
          showValue
        />
        <Text typography="caption" color="secondary">Value: {basicValue}</Text>
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View gap="xs">
            <Text typography="body2">Small</Text>
            <Slider defaultValue={30} size="sm" />
          </View>
          <View gap="xs">
            <Text typography="body2">Medium (default)</Text>
            <Slider defaultValue={50} size="md" />
          </View>
          <View gap="xs">
            <Text typography="body2">Large</Text>
            <Slider defaultValue={70} size="lg" />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Intent Colors</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View gap="xs">
            <Text typography="body2">Primary</Text>
            <Slider defaultValue={60} intent="primary" />
          </View>
          <View gap="xs">
            <Text typography="body2">Success</Text>
            <Slider defaultValue={60} intent="success" />
          </View>
          <View gap="xs">
            <Text typography="body2">Error</Text>
            <Slider defaultValue={60} intent="danger" />
          </View>
          <View gap="xs">
            <Text typography="body2">Warning</Text>
            <Slider defaultValue={60} intent="warning" />
          </View>
          <View gap="xs">
            <Text typography="body2">Neutral</Text>
            <Slider defaultValue={60} intent="neutral" />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">With Min/Max Labels</Text>
        <Slider
          defaultValue={50}
          showMinMax
        />
      </View>

      <View gap="md">
        <Text typography="h5">Custom Range & Step</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View gap="xs">
            <Text typography="body2">Range: 0-10, Step: 1</Text>
            <Slider
              min={0}
              max={10}
              step={1}
              defaultValue={5}
              showValue
              showMinMax
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Range: -50 to 50, Step: 5</Text>
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

      <View gap="md">
        <Text typography="h5">With Marks</Text>
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

      <View gap="md">
        <Text typography="h5">Volume Control</Text>
        <Slider
          value={volumeValue}
          onChange={setVolumeValue}
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

      <View gap="md">
        <Text typography="h5">With Icons</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <View gap="xs">
            <Text typography="body2">Volume with icon</Text>
            <Slider
              defaultValue={60}
              icon="volume-high"
              intent="primary"
              showMinMax
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Brightness with icon</Text>
            <Slider
              defaultValue={75}
              icon="brightness-6"
              intent="warning"
              showMinMax
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Temperature with icon</Text>
            <Slider
              defaultValue={22}
              min={10}
              max={30}
              icon="thermometer"
              intent="danger"
              showMinMax
            />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Temperature Control</Text>
        <Slider
          value={temperatureValue}
          onChange={setTemperatureValue}
          min={10}
          max={30}
          step={0.5}
          showValue
          showMinMax
          intent="warning"
        />
        <Text typography="caption" color="secondary">Temperature: {temperatureValue}°C</Text>
      </View>

      <View gap="md">
        <Text typography="h5">Disabled</Text>
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