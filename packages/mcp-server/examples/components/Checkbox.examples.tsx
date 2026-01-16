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
      onChange={setChecked}
      label="Accept terms and conditions"
    />
  );
}

// Example 2: Checkbox Sizes
export function CheckboxSizes() {
  const [checked, setChecked] = React.useState(true);

  return (
    <View spacing="md">
      <Checkbox checked={checked} onChange={setChecked} label="Extra Small" size="xs" />
      <Checkbox checked={checked} onChange={setChecked} label="Small" size="sm" />
      <Checkbox checked={checked} onChange={setChecked} label="Medium" size="md" />
      <Checkbox checked={checked} onChange={setChecked} label="Large" size="lg" />
      <Checkbox checked={checked} onChange={setChecked} label="Extra Large" size="xl" />
    </View>
  );
}

// Example 3: Checkbox Intents
export function CheckboxIntents() {
  const [checked, setChecked] = React.useState(true);

  return (
    <View spacing="md">
      <Checkbox checked={checked} onChange={setChecked} label="Primary" intent="primary" />
      <Checkbox checked={checked} onChange={setChecked} label="Success" intent="success" />
      <Checkbox checked={checked} onChange={setChecked} label="Error" intent="danger" />
      <Checkbox checked={checked} onChange={setChecked} label="Warning" intent="warning" />
      <Checkbox checked={checked} onChange={setChecked} label="Neutral" intent="neutral" />
      <Checkbox checked={checked} onChange={setChecked} label="Info" intent="info" />
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
        onChange={setChecked}
        label="Default variant"
        variant="default"
      />
      <Checkbox
        checked={checked}
        onChange={setChecked}
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
        onChange={(checked) => {
          setParentChecked(checked);
          setChild1(checked);
          setChild2(checked);
        }}
        label="Select All"
      />
      <View spacing="sm" style={{ paddingLeft: 20 }}>
        <Checkbox checked={child1} onChange={setChild1} label="Option 1" />
        <Checkbox checked={child2} onChange={setChild2} label="Option 2" />
      </View>
    </View>
  );
}

// Example 6: Disabled Checkbox
export function DisabledCheckbox() {
  return (
    <View spacing="md">
      <Checkbox checked={false} onChange={() => {}} label="Unchecked disabled" disabled />
      <Checkbox checked={true} onChange={() => {}} label="Checked disabled" disabled />
    </View>
  );
}

// Example 7: Checkbox with Custom Children
export function CheckboxWithCustomContent() {
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox checked={checked} onChange={setChecked}>
      <View spacing="xs">
        <Text weight="bold">Marketing emails</Text>
        <Text typography="body2">
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
        onChange={setAccepted}
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
        onChange={() => toggleInterest('tech')}
        label="Technology"
      />
      <Checkbox
        checked={interests.design}
        onChange={() => toggleInterest('design')}
        label="Design"
      />
      <Checkbox
        checked={interests.business}
        onChange={() => toggleInterest('business')}
        label="Business"
      />
      <Checkbox
        checked={interests.marketing}
        onChange={() => toggleInterest('marketing')}
        label="Marketing"
      />
    </View>
  );
}
