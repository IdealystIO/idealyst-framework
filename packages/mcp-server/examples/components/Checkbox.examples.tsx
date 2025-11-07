/**
 * Checkbox Component Examples
 *
 * These examples are type-checked against the actual CheckboxProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Checkbox, View, Text } from '@idealyst/components';

// Example 1: Basic Checkbox
export function BasicCheckbox() {
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
      label="Accept terms and conditions"
    />
  );
}

// Example 2: Checkbox Sizes
export function CheckboxSizes() {
  const [checked, setChecked] = React.useState(true);

  return (
    <View spacing="md">
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Extra Small" size="xs" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Small" size="sm" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Medium" size="md" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Large" size="lg" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Extra Large" size="xl" />
    </View>
  );
}

// Example 3: Checkbox Intents
export function CheckboxIntents() {
  const [checked, setChecked] = React.useState(true);

  return (
    <View spacing="md">
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Primary" intent="primary" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Success" intent="success" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Error" intent="error" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Warning" intent="warning" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Neutral" intent="neutral" />
      <Checkbox checked={checked} onCheckedChange={setChecked} label="Info" intent="info" />
    </View>
  );
}

// Example 4: Checkbox Variants
export function CheckboxVariants() {
  const [checked, setChecked] = React.useState(true);

  return (
    <View spacing="md">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        label="Default variant"
        variant="default"
      />
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        label="Outlined variant"
        variant="outlined"
      />
    </View>
  );
}

// Example 5: Indeterminate State
export function IndeterminateCheckbox() {
  const [parentChecked, setParentChecked] = React.useState(false);
  const [child1, setChild1] = React.useState(false);
  const [child2, setChild2] = React.useState(false);

  const indeterminate = child1 !== child2;
  const allChecked = child1 && child2;

  React.useEffect(() => {
    setParentChecked(allChecked);
  }, [child1, child2, allChecked]);

  return (
    <View spacing="sm">
      <Checkbox
        checked={parentChecked}
        indeterminate={indeterminate}
        onCheckedChange={(checked) => {
          setParentChecked(checked);
          setChild1(checked);
          setChild2(checked);
        }}
        label="Select All"
      />
      <View spacing="sm" style={{ paddingLeft: 20 }}>
        <Checkbox checked={child1} onCheckedChange={setChild1} label="Option 1" />
        <Checkbox checked={child2} onCheckedChange={setChild2} label="Option 2" />
      </View>
    </View>
  );
}

// Example 6: Disabled Checkbox
export function DisabledCheckbox() {
  return (
    <View spacing="md">
      <Checkbox checked={false} onCheckedChange={() => {}} label="Unchecked disabled" disabled />
      <Checkbox checked={true} onCheckedChange={() => {}} label="Checked disabled" disabled />
    </View>
  );
}

// Example 7: Checkbox with Custom Children
export function CheckboxWithCustomContent() {
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox checked={checked} onCheckedChange={setChecked}>
      <View spacing="xs">
        <Text weight="bold">Marketing emails</Text>
        <Text size="sm" color="gray.600">
          Receive updates about new features and special offers
        </Text>
      </View>
    </Checkbox>
  );
}

// Example 8: Checkbox with Helper Text and Error
export function CheckboxWithHelperText() {
  const [accepted, setAccepted] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const showError = submitted && !accepted;

  return (
    <View spacing="md">
      <Checkbox
        checked={accepted}
        onCheckedChange={setAccepted}
        label="I agree to the terms and conditions"
        required
        error={showError ? 'You must accept the terms to continue' : undefined}
        helperText={!showError ? 'Required field' : undefined}
      />
    </View>
  );
}

// Example 9: Checkbox Group
export function CheckboxGroup() {
  const [interests, setInterests] = React.useState({
    tech: false,
    design: false,
    business: false,
    marketing: false,
  });

  const toggleInterest = (key: keyof typeof interests) => {
    setInterests(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View spacing="sm">
      <Text weight="bold">Select your interests:</Text>
      <Checkbox
        checked={interests.tech}
        onCheckedChange={() => toggleInterest('tech')}
        label="Technology"
      />
      <Checkbox
        checked={interests.design}
        onCheckedChange={() => toggleInterest('design')}
        label="Design"
      />
      <Checkbox
        checked={interests.business}
        onCheckedChange={() => toggleInterest('business')}
        label="Business"
      />
      <Checkbox
        checked={interests.marketing}
        onCheckedChange={() => toggleInterest('marketing')}
        label="Marketing"
      />
    </View>
  );
}
