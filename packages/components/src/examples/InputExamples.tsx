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
      <View gap="xl">
      <Text typography="h4" align="center">
        Input Examples
      </Text>

      {/* With Icons */}
      <View gap="md">
        <Text typography="subtitle1">With Icons</Text>
        <View gap="sm" style={{ gap: 10 }}>
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
      <View gap="md">
        <Text typography="subtitle1">Input Types</Text>
        <View gap="sm" style={{ gap: 10 }}>
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
      <View gap="md">
        <Text typography="subtitle1">Sizes</Text>
        <View gap="sm" style={{ gap: 10 }}>
          <Input
            leftIcon="email"
            placeholder="Small input"
            size="sm"
          />
          <Input
            leftIcon="email"
            placeholder="Medium input"
            size="md"
          />
          <Input
            leftIcon="email"
            placeholder="Large input"
            size="lg"
          />
        </View>
      </View>

      {/* Input Variants */}
      <View gap="md">
        <Text typography="subtitle1">Variants</Text>
        <View gap="sm" style={{ gap: 10 }}>
          <Input
            leftIcon="magnify"
            placeholder="Outlined variant"
            type="outlined"
          />
          <Input
            leftIcon="magnify"
            placeholder="Filled variant"
            type="filled"
          />
          <Input
            leftIcon="magnify"
            placeholder="Bare variant"
            type="bare"
          />
        </View>
      </View>

      {/* Input States */}
      <View gap="md">
        <Text typography="subtitle1">States</Text>
        <View gap="sm" style={{ gap: 10 }}>
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
      <View gap="md">
        <Text typography="subtitle1">Auto-capitalization</Text>
        <View gap="sm" style={{ gap: 10 }}>
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

      {/* Accessibility Examples */}
      <View gap="md">
        <Text typography="subtitle1">Accessibility</Text>
        <View gap="sm" style={{ gap: 10 }}>
          {/* Basic accessible input with label */}
          <Input
            leftIcon="email"
            value={emailValue}
            onChangeText={setEmailValue}
            placeholder="Email address"
            inputType="email"
            accessibilityLabel="Email address"
            accessibilityRequired
          />
          <Text id="email-helper" typography="caption" color="muted">
            Enter your work email address
          </Text>

          {/* Input with error state and accessible error association */}
          <Input
            leftIcon="lock"
            value={passwordValue}
            onChangeText={setPasswordValue}
            placeholder="Password"
            inputType="password"
            accessibilityLabel="Password"
            accessibilityDescribedBy="password-helper"
            accessibilityInvalid={passwordValue.length > 0 && passwordValue.length < 8}
            accessibilityRequired
            hasError={passwordValue.length > 0 && passwordValue.length < 8}
          />
          <Text
            id="password-helper"
            typography="caption"
            color={passwordValue.length > 0 && passwordValue.length < 8 ? 'error' : 'muted'}
          >
            {passwordValue.length > 0 && passwordValue.length < 8
              ? 'Password must be at least 8 characters'
              : 'Enter a secure password'}
          </Text>

          {/* Disabled input with accessibility indication */}
          <Input
            leftIcon="account"
            value="readonly@example.com"
            placeholder="Readonly input"
            disabled
            accessibilityLabel="Email (read-only)"
            accessibilityDisabled
          />
        </View>
      </View>
    </View>
    </Screen>
  );
}; 