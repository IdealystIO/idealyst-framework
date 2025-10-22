import React, { useState, useEffect } from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';
import Progress from '../Progress';

export const ProgressExamples: React.FC = () => {
  const [dynamicValue, setDynamicValue] = useState(0);
  const [interactiveValue, setInteractiveValue] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicValue((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Screen background="primary" padding="lg">
    <View spacing="lg">
      <Text size="xl" weight="bold">Progress Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Linear Progress</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress value={25} />
          <Progress value={50} />
          <Progress value={75} />
          <Progress value={100} />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Sizes</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress value={60} size="sm" />
          <Progress value={60} size="md" />
          <Progress value={60} size="lg" />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Intent Colors</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress value={70} intent="primary" />
          <Progress value={70} intent="success" />
          <Progress value={70} intent="warning" />
          <Progress value={70} intent="error" />
          <Progress value={70} intent="neutral" />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">With Labels</Text>
        <View spacing="sm">
          <Progress value={30} showLabel />
          <Progress value={60} showLabel label="Loading..." />
          <Progress value={90} showLabel label="Almost done!" />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Indeterminate</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress indeterminate />
          <Progress indeterminate intent="success" />
          <Progress indeterminate size="lg" intent="warning" />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Circular Progress</Text>
        <View spacing="sm" style={{ flexDirection: 'row', gap: 16 }}>
          <Progress variant="circular" value={25} size="sm" />
          <Progress variant="circular" value={50} size="md" />
          <Progress variant="circular" value={75} size="lg" />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Circular with Labels</Text>
        <View spacing="sm" style={{ flexDirection: 'row', gap: 16 }}>
          <Progress variant="circular" value={30} showLabel size="md" />
          <Progress variant="circular" value={60} showLabel size="lg" intent="success" />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Circular Indeterminate</Text>
        <View spacing="sm" style={{ flexDirection: 'row', gap: 16 }}>
          <Progress variant="circular" indeterminate size="sm" />
          <Progress variant="circular" indeterminate size="md" intent="primary" />
          <Progress variant="circular" indeterminate size="lg" intent="warning" />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Rounded vs Straight</Text>
        <View spacing="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <View spacing="xs">
            <Text size="sm">Rounded (default)</Text>
            <Progress value={70} rounded={true} />
          </View>
          <View spacing="xs">
            <Text size="sm">Straight edges</Text>
            <Progress value={70} rounded={false} />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Dynamic Progress</Text>
        <Progress value={dynamicValue} showLabel />
        <Text size="sm" color="secondary">Automatically updating every second</Text>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Interactive Circular Progress</Text>
        <View spacing="sm">
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Progress variant="circular" value={interactiveValue} showLabel size="lg" />
            <View spacing="sm">
              <Button size="sm" onPress={() => setInteractiveValue(Math.max(0, interactiveValue - 10))}>
                -10
              </Button>
              <Button size="sm" onPress={() => setInteractiveValue(Math.min(100, interactiveValue + 10))}>
                +10
              </Button>
            </View>
          </View>
          <Text size="sm" color="secondary">Click buttons to change value</Text>
        </View>
      </View>
    </View>
    </Screen>
  );
};

export default ProgressExamples;