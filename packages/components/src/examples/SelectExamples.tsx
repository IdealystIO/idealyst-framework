import React, { useState } from 'react';
import { Screen, View, Text, Select, Card, Button, Icon, Divider } from '../index';

// Mock data for examples
const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'mango', label: 'Mango' },
  { value: 'kiwi', label: 'Kiwi' },
];

const countryOptions = [
  { value: 'us', label: 'United States', icon: <Text>🇺🇸</Text> },
  { value: 'ca', label: 'Canada', icon: <Text>🇨🇦</Text> },
  { value: 'uk', label: 'United Kingdom', icon: <Text>🇬🇧</Text> },
  { value: 'de', label: 'Germany', icon: <Text>🇩🇪</Text> },
  { value: 'fr', label: 'France', icon: <Text>🇫🇷</Text> },
  { value: 'jp', label: 'Japan', icon: <Text>🇯🇵</Text> },
  { value: 'au', label: 'Australia', icon: <Text>🇦🇺</Text> },
  { value: 'in', label: 'India', icon: <Text>🇮🇳</Text> },
];

const priorityOptions = [
  {
    value: 'low',
    label: 'Low Priority',
    icon: <Text style={{ color: '#22c55e' }}>●</Text>
  },
  {
    value: 'medium',
    label: 'Medium Priority',
    icon: <Text style={{ color: '#f59e0b' }}>●</Text>
  },
  {
    value: 'high',
    label: 'High Priority',
    icon: <Text style={{ color: '#ef4444' }}>●</Text>
  },
  {
    value: 'urgent',
    label: 'Urgent',
    icon: <Text style={{ color: '#dc2626' }}>🔥</Text>
  },
];

const statusOptions = [
  { value: 'draft', label: 'Draft', disabled: false },
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'archived', label: 'Archived (Disabled)', disabled: true },
  { value: 'deleted', label: 'Deleted (Disabled)', disabled: true },
];

export const SelectExamples = () => {
  // State for all select examples
  const [basicSelect, setBasicSelect] = useState('');
  const [fruitSelect, setFruitSelect] = useState('apple');
  const [countrySelect, setCountrySelect] = useState('');
  const [prioritySelect, setPrioritySelect] = useState('medium');
  const [statusSelect, setStatusSelect] = useState('draft');
  const [searchableSelect, setSearchableSelect] = useState('');
  const [formSelect, setFormSelect] = useState('');
  const [sizeSmall, setSizeSmall] = useState('');
  const [sizeMedium, setSizeMedium] = useState('');
  const [sizeLarge, setSizeLarge] = useState('');
  const [outlinedSelect, setOutlinedSelect] = useState('');
  const [filledSelect, setFilledSelect] = useState('');
  const [primarySelect, setPrimarySelect] = useState('');
  const [successSelect, setSuccessSelect] = useState('');
  const [errorSelect, setErrorSelect] = useState('');
  const [warningSelect, setWarningSelect] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formSelect) {
      errors.formSelect = 'Please select a country';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted successfully!', { country: formSelect });
    } else {
      console.log('Form has validation errors');
    }
  };

  const resetAllSelections = () => {
    setBasicSelect('');
    setFruitSelect('');
    setCountrySelect('');
    setPrioritySelect('');
    setStatusSelect('');
    setSearchableSelect('');
    setFormSelect('');
    setSizeSmall('');
    setSizeMedium('');
    setSizeLarge('');
    setOutlinedSelect('');
    setFilledSelect('');
    setPrimarySelect('');
    setSuccessSelect('');
    setErrorSelect('');
    setWarningSelect('');
    setFormErrors({});
  };

  return (
    <Screen background="primary" padding="lg">
      <View spacing="lg">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="large" weight="bold">
            Select Component Examples
          </Text>
          <Button
            variant="outlined"
            intent="neutral"
            size="small"
            onPress={resetAllSelections}
          >
            Reset All
          </Button>
        </View>

        {/* Basic Usage */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Basic Usage</Text>
            <Select
              options={fruitOptions}
              value={basicSelect}
              onValueChange={setBasicSelect}
              placeholder="Choose a fruit"
            />
            <Text size="small" color="secondary">
              Selected: {basicSelect || 'None'}
            </Text>
          </View>
        </Card>

        {/* With Icons */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">With Icons</Text>
            <Select
              options={countryOptions}
              value={countrySelect}
              onValueChange={setCountrySelect}
              placeholder="Select a country"
              label="Country"
            />
            <Text size="small" color="secondary">
              Selected: {countrySelect || 'None'}
            </Text>
          </View>
        </Card>

        {/* Custom Icons */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Custom Icon Components</Text>
            <Select
              options={priorityOptions}
              value={prioritySelect}
              onValueChange={setPrioritySelect}
              placeholder="Select priority"
              label="Task Priority"
            />
            <Text size="small" color="secondary">
              Selected: {prioritySelect || 'None'}
            </Text>
          </View>
        </Card>

        {/* Disabled Options */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Disabled Options</Text>
            <Select
              options={statusOptions}
              value={statusSelect}
              onValueChange={setStatusSelect}
              placeholder="Select status"
              label="Document Status"
              helperText="Some options are disabled"
            />
            <Text size="small" color="secondary">
              Selected: {statusSelect || 'None'}
            </Text>
          </View>
        </Card>

        {/* Searchable */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Searchable Select</Text>
            <Select
              options={fruitOptions}
              value={searchableSelect}
              onValueChange={setSearchableSelect}
              placeholder="Search for fruits..."
              label="Fruit Search"
              searchable
              helperText="Type to filter options"
            />
            <Text size="small" color="secondary">
              Selected: {searchableSelect || 'None'}
            </Text>
          </View>
        </Card>

        {/* Sizes */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Sizes</Text>
            <View spacing="sm">
              <View>
                <Text size="small" weight="medium">Small</Text>
                <Select
                  options={fruitOptions.slice(0, 3)}
                  value={sizeSmall}
                  onValueChange={setSizeSmall}
                  placeholder="Small select"
                  size="small"
                />
              </View>
              <View>
                <Text size="small" weight="medium">Medium (Default)</Text>
                <Select
                  options={fruitOptions.slice(0, 3)}
                  value={sizeMedium}
                  onValueChange={setSizeMedium}
                  placeholder="Medium select"
                  size="medium"
                />
              </View>
              <View>
                <Text size="small" weight="medium">Large</Text>
                <Select
                  options={fruitOptions.slice(0, 3)}
                  value={sizeLarge}
                  onValueChange={setSizeLarge}
                  placeholder="Large select"
                  size="large"
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Variants */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Variants</Text>
            <View spacing="sm">
              <View>
                <Text size="small" weight="medium">Outlined (Default)</Text>
                <Select
                  options={fruitOptions.slice(0, 4)}
                  value={outlinedSelect}
                  onValueChange={setOutlinedSelect}
                  placeholder="Outlined variant"
                  variant="outlined"
                />
              </View>
              <View>
                <Text size="small" weight="medium">Filled</Text>
                <Select
                  options={fruitOptions.slice(0, 4)}
                  value={filledSelect}
                  onValueChange={setFilledSelect}
                  placeholder="Filled variant"
                  variant="filled"
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Intents */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Intent Colors</Text>
            <View spacing="sm">
              <View>
                <Text size="small" weight="medium">Primary</Text>
                <Select
                  options={fruitOptions.slice(0, 3)}
                  value={primarySelect}
                  onValueChange={setPrimarySelect}
                  placeholder="Primary intent"
                  intent="primary"
                  variant="outlined"
                />
              </View>
              <View>
                <Text size="small" weight="medium">Success</Text>
                <Select
                  options={fruitOptions.slice(0, 3)}
                  value={successSelect}
                  onValueChange={setSuccessSelect}
                  placeholder="Success intent"
                  intent="success"
                  variant="outlined"
                />
              </View>
              <View>
                <Text size="small" weight="medium">Warning</Text>
                <Select
                  options={fruitOptions.slice(0, 3)}
                  value={warningSelect}
                  onValueChange={setWarningSelect}
                  placeholder="Warning intent"
                  intent="warning"
                  variant="outlined"
                />
              </View>
              <View>
                <Text size="small" weight="medium">Error</Text>
                <Select
                  options={fruitOptions.slice(0, 3)}
                  value={errorSelect}
                  onValueChange={setErrorSelect}
                  placeholder="Error intent"
                  intent="error"
                  variant="outlined"
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Form Example */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Form Integration</Text>
            <Select
              options={countryOptions}
              value={formSelect}
              onValueChange={(value) => {
                setFormSelect(value);
                if (formErrors.formSelect) {
                  setFormErrors(prev => ({ ...prev, formSelect: '' }));
                }
              }}
              placeholder="Select your country"
              label="Country *"
              error={!!formErrors.formSelect}
              helperText={formErrors.formSelect || "Required field"}
              variant="outlined"
              intent="primary"
            />
            <Button
              variant="contained"
              intent="primary"
              onPress={handleFormSubmit}
            >
              Submit Form
            </Button>
          </View>
        </Card>

        {/* Disabled State */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Disabled State</Text>
            <Select
              options={fruitOptions}
              value="apple"
              onValueChange={() => {}}
              placeholder="This select is disabled"
              label="Disabled Select"
              disabled
              helperText="This select cannot be interacted with"
            />
          </View>
        </Card>

        {/* Platform-specific Features */}
        <Card variant="outlined" padding="medium">
          <View spacing="md">
            <Text size="medium" weight="semibold">Platform Features</Text>
            <Text size="small" color="secondary">
              On iOS: Try the ActionSheet presentation mode for native feel
            </Text>
            <Select
              options={priorityOptions}
              value={prioritySelect}
              onValueChange={setPrioritySelect}
              placeholder="Select priority"
              label="iOS ActionSheet Mode"
              presentationMode="actionSheet" // iOS only
              helperText="Uses native ActionSheet on iOS"
            />
          </View>
        </Card>

        <Divider spacing="lg" />

        {/* Summary */}
        <Card variant="filled" padding="medium">
          <View spacing="sm">
            <Text size="medium" weight="semibold">Current Selections Summary</Text>
            <Text size="small">Basic: {basicSelect || 'None'}</Text>
            <Text size="small">Country: {countrySelect || 'None'}</Text>
            <Text size="small">Priority: {prioritySelect || 'None'}</Text>
            <Text size="small">Status: {statusSelect || 'None'}</Text>
            <Text size="small">Searchable: {searchableSelect || 'None'}</Text>
            <Text size="small">Form: {formSelect || 'None'}</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
};