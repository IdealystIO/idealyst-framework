/**
 * TextInput Component Examples
 *
 * These examples are type-checked against the actual TextInputProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { TextInput, View } from '@idealyst/components';

// Example 1: Basic TextInput
export function BasicTextInput() {
  const [value, setValue] = React.useState('');

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder="Enter text..."
    />
  );
}

// Example 2: TextInput Types
export function TextInputTypes() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <TextInput type="outlined" value={value} onChangeText={setValue} placeholder="Outlined" />
      <TextInput type="filled" value={value} onChangeText={setValue} placeholder="Filled" />
      <TextInput type="bare" value={value} onChangeText={setValue} placeholder="Bare" />
    </View>
  );
}

// Example 3: TextInput Sizes
export function TextInputSizes() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <TextInput size="xs" value={value} onChangeText={setValue} placeholder="Extra Small" />
      <TextInput size="sm" value={value} onChangeText={setValue} placeholder="Small" />
      <TextInput size="md" value={value} onChangeText={setValue} placeholder="Medium" />
      <TextInput size="lg" value={value} onChangeText={setValue} placeholder="Large" />
      <TextInput size="xl" value={value} onChangeText={setValue} placeholder="Extra Large" />
    </View>
  );
}

// Example 4: TextInput with Icons
export function TextInputWithIcons() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <TextInput
        leftIcon="magnify"
        value={value}
        onChangeText={setValue}
        placeholder="Search..."
      />
      <TextInput
        rightIcon="email"
        value={value}
        onChangeText={setValue}
        placeholder="Email address"
      />
      <TextInput
        leftIcon="account"
        rightIcon="check"
        value={value}
        onChangeText={setValue}
        placeholder="Username"
      />
    </View>
  );
}

// Example 5: TextInput Modes (inputMode - React Native only)
export function TextInputModes() {
  const [text, setText] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [number, setNumber] = React.useState('');

  return (
    <View spacing="md">
      <TextInput
        inputMode="text"
        value={text}
        onChangeText={setText}
        placeholder="Text input"
      />
      <TextInput
        inputMode="email"
        leftIcon="email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
      />
      <TextInput
        inputMode="password"
        leftIcon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        showPasswordToggle
      />
      <TextInput
        inputMode="number"
        value={number}
        onChangeText={setNumber}
        placeholder="Enter number"
      />
    </View>
  );
}

// Example 6: TextInput States
export function TextInputStates() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Normal state"
      />
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Disabled"
        disabled
      />
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Error state"
        hasError
      />
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Primary intent"
        intent="primary"
      />
    </View>
  );
}

// Example 7: Password TextInput
export function PasswordTextInput() {
  const [password, setPassword] = React.useState('');

  return (
    <TextInput
      inputMode="password"
      leftIcon="lock"
      value={password}
      onChangeText={setPassword}
      placeholder="Enter password"
      showPasswordToggle
      secureTextEntry
    />
  );
}

// Example 8: Form with Validation
export function FormWithValidation() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(!isValid && value.length > 0);
  };

  return (
    <View spacing="md">
      <TextInput
        inputMode="email"
        leftIcon="email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          validateEmail(value);
        }}
        placeholder="Email"
        hasError={emailError}
      />
      <TextInput
        inputMode="password"
        leftIcon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        showPasswordToggle
      />
    </View>
  );
}
