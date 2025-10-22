import React, { useState } from 'react';
import { Screen, View, Text, Checkbox } from '../index';

export const CheckboxExamples = () => {
  const [basicChecked, setBasicChecked] = useState(false);
  const [primaryChecked, setPrimaryChecked] = useState(true);
  const [successChecked, setSuccessChecked] = useState(false);
  const [errorChecked, setErrorChecked] = useState(false);
  const [indeterminateChecked, setIndeterminateChecked] = useState(false);

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="lg" weight="bold" align="center">
        Checkbox Examples
      </Text>
      
      {/* Basic Checkbox */}
      <View spacing="md">
        <Text size="md" weight="semibold">Basic Checkbox</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Checkbox
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            label="Basic checkbox"
          />
          <Checkbox
            checked={true}
            onCheckedChange={() => {}}
            label="Checked checkbox"
          />
          <Checkbox
            checked={false}
            onCheckedChange={() => {}}
            label="Unchecked checkbox"
          />
        </View>
      </View>

      {/* Checkbox Sizes */}
      <View spacing="md">
        <Text size="md" weight="semibold">Sizes</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Checkbox
            size="sm"
            checked={true}
            onCheckedChange={() => {}}
            label="Small checkbox"
          />
          <Checkbox
            size="md"
            checked={true}
            onCheckedChange={() => {}}
            label="Medium checkbox"
          />
          <Checkbox
            size="lg"
            checked={true}
            onCheckedChange={() => {}}
            label="Large checkbox"
          />
        </View>
      </View>

      {/* Checkbox Intents */}
      <View spacing="md">
        <Text size="md" weight="semibold">Intents</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Checkbox
            intent="primary"
            checked={primaryChecked}
            onCheckedChange={setPrimaryChecked}
            label="Primary checkbox"
          />
          <Checkbox
            intent="neutral"
            checked={true}
            onCheckedChange={() => {}}
            label="Neutral checkbox"
          />
          <Checkbox
            intent="success"
            checked={successChecked}
            onCheckedChange={setSuccessChecked}
            label="Success checkbox"
          />
          <Checkbox
            intent="error"
            checked={errorChecked}
            onCheckedChange={setErrorChecked}
            label="Error checkbox"
          />
          <Checkbox
            intent="warning"
            checked={true}
            onCheckedChange={() => {}}
            label="Warning checkbox"
          />
          <Checkbox
            intent="info"
            checked={true}
            onCheckedChange={() => {}}
            label="Info checkbox"
          />
        </View>
      </View>

      {/* Checkbox Variants */}
      <View spacing="md">
        <Text size="md" weight="semibold">Variants</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Checkbox
            variant="default"
            checked={true}
            onCheckedChange={() => {}}
            label="Default variant"
          />
          <Checkbox
            variant="outlined"
            checked={true}
            onCheckedChange={() => {}}
            label="Outlined variant"
          />
        </View>
      </View>

      {/* Checkbox States */}
      <View spacing="md">
        <Text size="md" weight="semibold">States</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Checkbox
            checked={false}
            onCheckedChange={() => {}}
            label="Normal state"
          />
          <Checkbox
            checked={true}
            onCheckedChange={() => {}}
            label="Checked state"
          />
          <Checkbox
            indeterminate={true}
            checked={indeterminateChecked}
            onCheckedChange={setIndeterminateChecked}
            label="Indeterminate state"
          />
          <Checkbox
            checked={true}
            disabled
            onCheckedChange={() => {}}
            label="Disabled checked"
          />
          <Checkbox
            checked={false}
            disabled
            onCheckedChange={() => {}}
            label="Disabled unchecked"
          />
        </View>
      </View>

      {/* Checkbox with Custom Children */}
      <View spacing="md">
        <Text size="md" weight="semibold">Custom Content</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Checkbox
            checked={true}
            onCheckedChange={() => {}}
          >
            <Text>Custom label with </Text>
            <Text weight="bold" color="primary">styled text</Text>
          </Checkbox>
          
          <Checkbox
            checked={false}
            onCheckedChange={() => {}}
          >
            <View>
              <Text weight="semibold">Multi-line Label</Text>
              <Text size="sm" color="secondary">
                This checkbox has a more complex label with multiple lines
              </Text>
            </View>
          </Checkbox>
        </View>
      </View>

      {/* Checkbox with Helper Text and Errors */}
      <View spacing="md">
        <Text size="md" weight="semibold">With Helper Text</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Checkbox
            checked={true}
            onCheckedChange={() => {}}
            label="Checkbox with helper text"
            helperText="This is some helpful information"
          />
          <Checkbox
            checked={false}
            onCheckedChange={() => {}}
            label="Checkbox with error"
            error="This field is required"
            intent="error"
          />
          <Checkbox
            checked={false}
            onCheckedChange={() => {}}
            label="Required checkbox"
            required
            helperText="This checkbox is required"
          />
        </View>
      </View>
    </View>
    </Screen>
  );
}; 