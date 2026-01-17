import React, { useState } from 'react';
import {
  Screen,
  View,
  Text,
  Card,
  Button,
  Icon,
  TextInput,
  Select,
  Switch,
  Slider,
  Progress,
  Alert,
  Divider,
  List,
  ListItem,
} from '@idealyst/components';

const selectOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

export const ExploreScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('1');
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [progressValue, setProgressValue] = useState(65);

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="xl">
        {/* Header */}
        <View gap="sm">
          <Text typography="h3">Component Explorer</Text>
          <Text color="secondary">Interactive demos of Idealyst components</Text>
        </View>

        {/* Buttons Section */}
        <View gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="gesture-tap-button" size={24} intent="primary" />
            <Text typography="subtitle1">Buttons</Text>
          </View>
          <Card type="outlined" padding="md" gap="md">
            <Text typography="caption" color="secondary">
              Buttons with different intents and types
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Button intent="primary" size="sm">
                Primary
              </Button>
              <Button intent="success" size="sm">
                Success
              </Button>
              <Button intent="danger" size="sm">
                Danger
              </Button>
              <Button intent="warning" size="sm">
                Warning
              </Button>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Button type="outlined" intent="primary" size="sm">
                Outlined
              </Button>
              <Button type="text" intent="primary" size="sm">
                Ghost
              </Button>
              <Button type="outlined" intent="primary" size="sm">
                Soft
              </Button>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Button
                intent="primary"
                size="sm"
                leftIcon={<Icon name="plus" size={16} textColor='inverse' />}
              >
                With Icon
              </Button>
              <Button intent="neutral" size="sm" disabled>
                Disabled
              </Button>
            </View>
          </Card>
        </View>

        {/* Form Controls Section */}
        <View gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="form-textbox" size={24} intent="primary" />
            <Text typography="subtitle1">Form Controls</Text>
          </View>
          <Card type="outlined" padding="md" gap="md">
            <TextInput
              placeholder="Enter some text..."
              value={inputValue}
              onChangeText={setInputValue}
              leftIcon={<Icon name="magnify" size={20} />}
            />

            <Select
              label="Select"
              value={selectValue}
              onChange={setSelectValue}
              options={selectOptions}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 8,
              }}
            >
              <View>
                <Text weight="medium">Enable Feature</Text>
                <Text typography="caption" color="secondary">
                  Toggle this setting on or off
                </Text>
              </View>
              <Switch
                checked={switchValue}
                onChange={setSwitchValue}
                intent="primary"
              />
            </View>

            <View gap="xs">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text weight="medium">Volume</Text>
                <Text color="secondary">{sliderValue}%</Text>
              </View>
              <Slider
                value={sliderValue}
                onChange={setSliderValue}
                min={0}
                max={100}
                intent="primary"
              />
            </View>
          </Card>
        </View>

        {/* Feedback Section */}
        <View gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="message-alert-outline" size={24} intent="primary" />
            <Text typography="subtitle1">Feedback</Text>
          </View>
          <Card type="outlined" padding="md" gap="md">
            <Alert intent="info" title="Info Alert">
              This is an informational message for the user.
            </Alert>
            <Alert intent="success" title="Success!">
              Your changes have been saved successfully.
            </Alert>
            <Alert intent="warning" title="Warning">
              Please review your input before continuing.
            </Alert>

            <Divider />

            <View gap="xs">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text weight="medium">Upload Progress</Text>
                <Text color="secondary">{progressValue}%</Text>
              </View>
              <Progress value={progressValue} intent="primary" />
            </View>

            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Button
                size="sm"
                type="outlined"
                onPress={() => setProgressValue(Math.max(0, progressValue - 10))}
              >
                -10%
              </Button>
              <Button
                size="sm"
                type="outlined"
                onPress={() => setProgressValue(Math.min(100, progressValue + 10))}
              >
                +10%
              </Button>
              <Button size="sm" intent="success" onPress={() => setProgressValue(100)}>
                Complete
              </Button>
            </View>
          </Card>
        </View>

        {/* List Section */}
        <View gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="format-list-bulleted" size={24} intent="primary" />
            <Text typography="subtitle1">Lists</Text>
          </View>
          <Card type="outlined" padding="md">
            <List>
              <ListItem
                label="Notifications"
                leading={<Icon name="bell-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
              <ListItem
                label="Privacy"
                leading={<Icon name="shield-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
              <ListItem
                label="Storage"
                leading={<Icon name="folder-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
            </List>
          </Card>
        </View>
      </View>
    </Screen>
  );
};

export default ExploreScreen;
