/**
 * TextArea Component Examples
 *
 * These examples are type-checked against the actual TextAreaProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { TextArea, View } from '@idealyst/components';

// Example 1: Basic TextArea
export function BasicTextArea() {
  const [value, setValue] = React.useState('');

  return (
    <TextArea
      value={value}
      onChange={setValue}
      placeholder="Enter your message..."
    />
  );
}

// Example 2: TextArea with Label
export function TextAreaWithLabel() {
  const [value, setValue] = React.useState('');

  return (
    <TextArea
      label="Message"
      value={value}
      onChange={setValue}
      placeholder="Type your message here..."
    />
  );
}

// Example 3: TextArea with Character Count
export function TextAreaWithCharacterCount() {
  const [value, setValue] = React.useState('');

  return (
    <TextArea
      label="Bio"
      value={value}
      onChange={setValue}
      placeholder="Tell us about yourself..."
      maxLength={200}
      showCharacterCount
    />
  );
}

// Example 4: Auto-growing TextArea
export function AutoGrowingTextArea() {
  const [value, setValue] = React.useState('');

  return (
    <TextArea
      label="Comments"
      value={value}
      onChange={setValue}
      placeholder="Add your comments..."
      autoGrow
      minHeight={60}
      maxHeight={200}
    />
  );
}

// Example 5: TextArea with Fixed Rows
export function TextAreaWithRows() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <TextArea
        label="Short text (3 rows)"
        value={value}
        onChange={setValue}
        rows={3}
        placeholder="3 rows..."
      />
      <TextArea
        label="Long text (8 rows)"
        value={value}
        onChange={setValue}
        rows={8}
        placeholder="8 rows..."
      />
    </View>
  );
}

// Example 6: TextArea Sizes
export function TextAreaSizes() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <TextArea size="xs" value={value} onChange={setValue} placeholder="Extra Small" />
      <TextArea size="sm" value={value} onChange={setValue} placeholder="Small" />
      <TextArea size="md" value={value} onChange={setValue} placeholder="Medium" />
      <TextArea size="lg" value={value} onChange={setValue} placeholder="Large" />
      <TextArea size="xl" value={value} onChange={setValue} placeholder="Extra Large" />
    </View>
  );
}

// Example 7: TextArea with Error
export function TextAreaWithError() {
  const [value, setValue] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const minLength = 20;
  const hasError = submitted && value.length < minLength;

  return (
    <View spacing="md">
      <TextArea
        label="Description *"
        value={value}
        onChange={setValue}
        placeholder="Enter a detailed description..."
        error={hasError ? `Description must be at least ${minLength} characters` : undefined}
        helperText={!hasError ? `Minimum ${minLength} characters required` : undefined}
        maxLength={500}
        showCharacterCount
      />
    </View>
  );
}

// Example 8: Disabled TextArea
export function DisabledTextArea() {
  return (
    <TextArea
      label="Disabled TextArea"
      value="This text area is disabled"
      onChange={() => {}}
      disabled
    />
  );
}

// Example 9: TextArea with Resize Options
export function TextAreaWithResize() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <TextArea
        label="No Resize"
        value={value}
        onChange={setValue}
        resize="none"
        placeholder="Cannot be resized..."
      />
      <TextArea
        label="Vertical Resize"
        value={value}
        onChange={setValue}
        resize="vertical"
        placeholder="Can resize vertically..."
      />
      <TextArea
        label="Both Directions"
        value={value}
        onChange={setValue}
        resize="both"
        placeholder="Can resize in any direction..."
      />
    </View>
  );
}

// Example 10: Form with TextArea
export function FormWithTextArea() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  return (
    <View spacing="md">
      <TextArea
        label="Title"
        value={title}
        onChange={setTitle}
        placeholder="Enter a title..."
        rows={1}
      />
      <TextArea
        label="Description"
        value={description}
        onChange={setDescription}
        placeholder="Provide a detailed description..."
        rows={6}
        maxLength={1000}
        showCharacterCount
        helperText="Describe your idea in detail"
      />
    </View>
  );
}
