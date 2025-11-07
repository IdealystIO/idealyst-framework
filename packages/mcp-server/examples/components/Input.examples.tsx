/**
 * Input Component Examples
 *
 * These examples are type-checked against the actual InputProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Input, View } from '@idealyst/components';

// Example 1: Basic Input
export function BasicInput() {
  const [value, setValue] = React.useState('');

  return (
    <Input
      value={value}
      onChangeText={setValue}
      placeholder="Enter text..."
    />
  );
}

// Example 2: Input Types
export function InputTypes() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <Input type="outlined" value={value} onChangeText={setValue} placeholder="Outlined" />
      <Input type="filled" value={value} onChangeText={setValue} placeholder="Filled" />
      <Input type="bare" value={value} onChangeText={setValue} placeholder="Bare" />
    </View>
  );
}

// Example 3: Input Sizes
export function InputSizes() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <Input size="xs" value={value} onChangeText={setValue} placeholder="Extra Small" />
      <Input size="sm" value={value} onChangeText={setValue} placeholder="Small" />
      <Input size="md" value={value} onChangeText={setValue} placeholder="Medium" />
      <Input size="lg" value={value} onChangeText={setValue} placeholder="Large" />
      <Input size="xl" value={value} onChangeText={setValue} placeholder="Extra Large" />
    </View>
  );
}

// Example 4: Input with Icons
export function InputWithIcons() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <Input
        leftIcon="magnify"
        value={value}
        onChangeText={setValue}
        placeholder="Search..."
      />
      <Input
        rightIcon="email"
        value={value}
        onChangeText={setValue}
        placeholder="Email address"
      />
      <Input
        leftIcon="account"
        rightIcon="check"
        value={value}
        onChangeText={setValue}
        placeholder="Username"
      />
    </View>
  );
}

// Example 5: Input Types (inputType)
export function InputInputTypes() {
  const [text, setText] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [number, setNumber] = React.useState('');

  return (
    <View spacing="md">
      <Input
        inputType="text"
        value={text}
        onChangeText={setText}
        placeholder="Text input"
      />
      <Input
        inputType="email"
        leftIcon="email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
      />
      <Input
        inputType="password"
        leftIcon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        showPasswordToggle
      />
      <Input
        inputType="number"
        value={number}
        onChangeText={setNumber}
        placeholder="Enter number"
      />
    </View>
  );
}

// Example 6: Input States
export function InputStates() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <Input
        value={value}
        onChangeText={setValue}
        placeholder="Normal state"
      />
      <Input
        value={value}
        onChangeText={setValue}
        placeholder="Disabled"
        disabled
      />
      <Input
        value={value}
        onChangeText={setValue}
        placeholder="Error state"
        hasError
      />
      <Input
        value={value}
        onChangeText={setValue}
        placeholder="Primary intent"
        intent="primary"
      />
    </View>
  );
}

// Example 7: Password Input
export function PasswordInput() {
  const [password, setPassword] = React.useState('');

  return (
    <Input
      inputType="password"
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
      <Input
        inputType="email"
        leftIcon="email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          validateEmail(value);
        }}
        placeholder="Email"
        hasError={emailError}
      />
      <Input
        inputType="password"
        leftIcon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        showPasswordToggle
      />
    </View>
  );
}
