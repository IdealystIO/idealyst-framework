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
    <View gap="lg">
      <Text typography="h3">Progress Examples</Text>

      <View gap="md">
        <Text typography="h5">Linear Progress</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress value={25} />
          <Progress value={50} />
          <Progress value={75} />
          <Progress value={100} />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress value={60} size="sm" />
          <Progress value={60} size="md" />
          <Progress value={60} size="lg" />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Intent Colors</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress value={70} intent="primary" />
          <Progress value={70} intent="success" />
          <Progress value={70} intent="warning" />
          <Progress value={70} intent="danger" />
          <Progress value={70} intent="neutral" />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">With Labels</Text>
        <View gap="sm">
          <Progress value={30} showLabel />
          <Progress value={60} showLabel label="Loading..." />
          <Progress value={90} showLabel label="Almost done!" />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Indeterminate</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress indeterminate />
          <Progress indeterminate intent="success" />
          <Progress indeterminate size="lg" intent="warning" />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Circular Progress</Text>
        <View gap="sm" style={{ flexDirection: 'row', gap: 16 }}>
          <Progress variant="circular" value={25} size="sm" />
          <Progress variant="circular" value={50} size="md" />
          <Progress variant="circular" value={75} size="lg" />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Circular with Labels</Text>
        <View gap="sm" style={{ flexDirection: 'row', gap: 16 }}>
          <Progress variant="circular" value={30} showLabel size="md" />
          <Progress variant="circular" value={60} showLabel size="lg" intent="success" />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Circular Indeterminate</Text>
        <View gap="sm" style={{ flexDirection: 'row', gap: 16 }}>
          <Progress variant="circular" indeterminate size="sm" />
          <Progress variant="circular" indeterminate size="md" intent="primary" />
          <Progress variant="circular" indeterminate size="lg" intent="warning" />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Rounded vs Straight</Text>
        <View gap="sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <View gap="xs">
            <Text typography="body2">Rounded (default)</Text>
            <Progress value={70} rounded={true} />
          </View>
          <View gap="xs">
            <Text typography="body2">Straight edges</Text>
            <Progress value={70} rounded={false} />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Dynamic Progress</Text>
        <Progress value={dynamicValue} showLabel />
        <Text typography="caption" color="secondary">Automatically updating every second</Text>
      </View>

      <View gap="md">
        <Text typography="h5">Interactive Circular Progress</Text>
        <View gap="sm">
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Progress variant="circular" value={interactiveValue} showLabel size="lg" />
            <View gap="sm">
              <Button size="sm" onPress={() => setInteractiveValue(Math.max(0, interactiveValue - 10))}>
                -10
              </Button>
              <Button size="sm" onPress={() => setInteractiveValue(Math.min(100, interactiveValue + 10))}>
                +10
              </Button>
            </View>
          </View>
          <Text typography="caption" color="secondary">Click buttons to change value</Text>
        </View>
      </View>
    </View>
    </Screen>
  );
};

export default ProgressExamples;