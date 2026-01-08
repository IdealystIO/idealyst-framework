import React, { useState } from 'react';
import { View, Text, Card, Input, Button, Screen } from '@idealyst/components';
import { LivePreview } from '../../components/LivePreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

const inputProps = [
  { name: 'value', type: 'string', description: 'Current value of the input' },
  { name: 'onChangeText', type: '(text: string) => void', description: 'Called when text changes' },
  { name: 'placeholder', type: 'string', description: 'Placeholder text' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the input is disabled' },
  { name: 'inputType', type: "'text' | 'email' | 'password' | 'number'", default: "'text'", description: 'Input type (affects keyboard on mobile)' },
  { name: 'secureTextEntry', type: 'boolean', description: 'Hide text (for passwords)' },
  { name: 'leftIcon', type: 'IconName | React.ReactNode', description: 'Icon on the left side' },
  { name: 'rightIcon', type: 'IconName | React.ReactNode', description: 'Icon on the right side' },
  { name: 'showPasswordToggle', type: 'boolean', default: 'true', description: 'Show password visibility toggle' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the input' },
  { name: 'type', type: "'default' | 'outlined' | 'filled' | 'bare'", default: "'default'", description: 'Visual style variant' },
  { name: 'intent', type: "'primary' | 'neutral' | 'success' | 'error' | 'warning'", default: "'neutral'", description: 'Color scheme for focus/validation' },
  { name: 'hasError', type: 'boolean', default: 'false', description: 'Show error state' },
  { name: 'autoCapitalize', type: "'none' | 'sentences' | 'words' | 'characters'", description: 'Auto-capitalization behavior' },
];

export function InputPage() {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text size="xl" weight="bold" style={{ marginBottom: 16 }}>
          Input
        </Text>

        <Text style={{ marginBottom: 32, lineHeight: 26, color: '#333333' }}>
          Text input field with icon support, password visibility toggle, and various
          input types. Optimized for both web and mobile with appropriate keyboard types.
        </Text>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          Basic Usage
        </Text>

        <CodeBlock title="Import">
{`import { Input } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [value, setValue] = useState('');

  return (
    <Input
      value={value}
      onChangeText={setValue}
      placeholder="Enter text..."
    />
  );
}`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Interactive Demo
        </Text>

        <LivePreview title="Text Input">
          <View style={{ gap: 8 }}>
            <Input
              value={text}
              onChangeText={setText}
              placeholder="Type something..."
            />
            <Text size="sm" style={{ color: '#666666' }}>
              You typed: {text || '(nothing yet)'}
            </Text>
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Input Types
        </Text>

        <LivePreview title="Different Input Types">
          <View style={{ gap: 16 }}>
            <View>
              <Text size="sm" weight="semibold" style={{ marginBottom: 4 }}>Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                inputType="email"
                leftIcon="email"
                autoCapitalize="none"
              />
            </View>
            <View>
              <Text size="sm" weight="semibold" style={{ marginBottom: 4 }}>Password</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                inputType="password"
                leftIcon="lock"
              />
            </View>
            <View>
              <Text size="sm" weight="semibold" style={{ marginBottom: 4 }}>Search</Text>
              <Input
                value={search}
                onChangeText={setSearch}
                placeholder="Search..."
                leftIcon="magnify"
                rightIcon={search ? 'close' : undefined}
              />
            </View>
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Style Variants
        </Text>

        <LivePreview title="Visual Styles">
          <View style={{ gap: 12 }}>
            <Input placeholder="Default" type="default" />
            <Input placeholder="Outlined" type="outlined" />
            <Input placeholder="Filled" type="filled" />
            <Input placeholder="Bare" type="bare" />
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Sizes
        </Text>

        <LivePreview title="Size Variants">
          <View style={{ gap: 12 }}>
            <Input placeholder="Extra Small" size="xs" />
            <Input placeholder="Small" size="sm" />
            <Input placeholder="Medium (default)" size="md" />
            <Input placeholder="Large" size="lg" />
            <Input placeholder="Extra Large" size="xl" />
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Intent Colors
        </Text>

        <LivePreview title="Focus/Validation Colors">
          <View style={{ gap: 12 }}>
            <Input placeholder="Primary intent" intent="primary" />
            <Input placeholder="Success intent" intent="success" />
            <Input placeholder="Error intent (validation failed)" intent="error" hasError />
            <Input placeholder="Warning intent" intent="warning" />
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          With Icons
        </Text>

        <LivePreview title="Icon Placement">
          <View style={{ gap: 12 }}>
            <Input placeholder="Left icon" leftIcon="account" />
            <Input placeholder="Right icon" rightIcon="check" />
            <Input placeholder="Both icons" leftIcon="email" rightIcon="send" />
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          States
        </Text>

        <LivePreview title="Input States">
          <View style={{ gap: 12 }}>
            <Input placeholder="Normal" />
            <Input placeholder="Disabled" disabled />
            <Input placeholder="With error" hasError intent="error" />
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Props Reference
        </Text>

        <PropsTable props={inputProps} />

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Best Practices
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <View style={{ gap: 12 }}>
            <View>
              <Text weight="semibold" style={{ marginBottom: 4 }}>Use contextual icons</Text>
              <Text size="sm" style={{ color: '#666666' }}>
                Add leftIcon to hint at the expected content (e.g., email icon for email fields).
              </Text>
            </View>
            <View>
              <Text weight="semibold" style={{ marginBottom: 4 }}>Set correct inputType</Text>
              <Text size="sm" style={{ color: '#666666' }}>
                Use 'email' for email fields, 'password' for passwords, 'number' for numeric input
                to get the right mobile keyboard.
              </Text>
            </View>
            <View>
              <Text weight="semibold" style={{ marginBottom: 4 }}>Show validation state</Text>
              <Text size="sm" style={{ color: '#666666' }}>
                Use hasError and intent="error" for validation errors, intent="success" for valid input.
              </Text>
            </View>
            <View>
              <Text weight="semibold" style={{ marginBottom: 4 }}>Disable autoCapitalize when needed</Text>
              <Text size="sm" style={{ color: '#666666' }}>
                Set autoCapitalize="none" for email, username, and other case-sensitive fields.
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
