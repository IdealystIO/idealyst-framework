import React, { useState } from 'react';
import { Screen, View, Text, Input } from '../index';

export const InputExamples = () => {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Input Examples
      </Text>

      {/* With Icons */}
      <View spacing="md">
        <Text size="medium" weight="semibold">With Icons</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Input
            leftIcon="email"
            value={emailValue}
            onChangeText={setEmailValue}
            placeholder="Email with icon"
            inputType="email"
          />
          <Input
            leftIcon="account"
            value={usernameValue}
            onChangeText={setUsernameValue}
            placeholder="Username with icon"
          />
          <Input
            rightIcon="magnify"
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search with icon"
          />
          <Input
            leftIcon="lock"
            rightIcon="check"
            placeholder="Both icons"
          />
          <Input
            leftIcon="lock"
            value={passwordValue}
            onChangeText={setPasswordValue}
            placeholder="Password with toggle"
            inputType="password"
          />
          <Input
            leftIcon="lock"
            placeholder="Password without toggle"
            inputType="password"
            showPasswordToggle={false}
          />
        </View>
      </View>

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
            leftIcon="email"
            value={emailValue}
            onChangeText={setEmailValue}
            placeholder="Email input"
            inputType="email"
          />
          <Input
            leftIcon="lock"
            value={passwordValue}
            onChangeText={setPasswordValue}
            placeholder="Password input"
            inputType="password"
          />
          <Input
            leftIcon="calculator"
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
            leftIcon="email"
            placeholder="Small input"
            size="small"
          />
          <Input
            leftIcon="email"
            placeholder="Medium input"
            size="medium"
          />
          <Input
            leftIcon="email"
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
            leftIcon="magnify"
            placeholder="Default variant"
            variant="default"
          />
          <Input
            leftIcon="magnify"
            placeholder="Outlined variant"
            variant="outlined"
          />
          <Input
            leftIcon="magnify"
            placeholder="Filled variant"
            variant="filled"
          />
          <Input
            leftIcon="magnify"
            placeholder="Bare variant"
            variant="bare"
          />
        </View>
      </View>

      {/* Input States */}
      <View spacing="md">
        <Text size="medium" weight="semibold">States</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Input
            leftIcon="account"
            placeholder="Normal state"
          />
          <Input
            leftIcon="account"
            placeholder="Disabled state"
            disabled
          />
          <Input
            leftIcon="account"
            placeholder="Error state"
            hasError
          />
          <Input
            leftIcon="account"
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