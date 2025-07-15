import React, { useState } from 'react';
import { Screen, View, Text, Input } from '../index';

export const InputExamples = () => {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [numberValue, setNumberValue] = useState('');

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Input Examples
      </Text>
      
      {/* Input Types */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Input Types</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Input
            value={textValue}
            onChangeText={setTextValue}
            placeholder="Text input"
            inputType="text"
          />
          <Input
            value={emailValue}
            onChangeText={setEmailValue}
            placeholder="Email input"
            inputType="email"
          />
          <Input
            value={passwordValue}
            onChangeText={setPasswordValue}
            placeholder="Password input"
            inputType="password"
            secureTextEntry
          />
          <Input
            value={numberValue}
            onChangeText={setNumberValue}
            placeholder="Number input"
            inputType="number"
          />
        </View>
      </View>

      {/* Input Sizes */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Sizes</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Input
            placeholder="Small input"
            size="small"
          />
          <Input
            placeholder="Medium input"
            size="medium"
          />
          <Input
            placeholder="Large input"
            size="large"
          />
        </View>
      </View>

      {/* Input Variants */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Variants</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Input
            placeholder="Default variant"
            variant="default"
          />
          <Input
            placeholder="Outlined variant"
            variant="outlined"
          />
          <Input
            placeholder="Filled variant"
            variant="filled"
          />
        </View>
      </View>

      {/* Input States */}
      <View spacing="md">
        <Text size="medium" weight="semibold">States</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Input
            placeholder="Normal state"
          />
          <Input
            placeholder="Disabled state"
            disabled
          />
          <Input
            placeholder="Error state"
            hasError
          />
          <Input
            value="Pre-filled value"
            onChangeText={() => {}}
          />
        </View>
      </View>

      {/* Auto-capitalization Examples */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Auto-capitalization</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Input
            placeholder="No capitalization"
            autoCapitalize="none"
          />
          <Input
            placeholder="Sentences capitalization"
            autoCapitalize="sentences"
          />
          <Input
            placeholder="Words capitalization"
            autoCapitalize="words"
          />
          <Input
            placeholder="Characters capitalization"
            autoCapitalize="characters"
          />
        </View>
      </View>
    </View>
    </Screen>
  );
}; 