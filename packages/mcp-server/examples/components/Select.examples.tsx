/**
 * Select Component Examples
 *
 * These examples are type-checked against the actual SelectProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Select, View } from '@idealyst/components';
import type { SelectOption } from '@idealyst/components';

const countryOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
];

const fruitOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
];

// Example 1: Basic Select
export function BasicSelect() {
  const [value, setValue] = React.useState('');

  return (
    <Select
      options={fruitOptions}
      value={value}
      onChange={setValue}
      placeholder="Select a fruit"
    />
  );
}

// Example 2: Select Types
export function SelectTypes() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <Select
        type="outlined"
        options={fruitOptions}
        value={value}
        onChange={setValue}
        placeholder="Outlined"
      />
      <Select
        type="filled"
        options={fruitOptions}
        value={value}
        onChange={setValue}
        placeholder="Filled"
      />
    </View>
  );
}

// Example 3: Select Sizes
export function SelectSizes() {
  const [value, setValue] = React.useState('');

  return (
    <View spacing="md">
      <Select
        size="xs"
        options={fruitOptions}
        value={value}
        onChange={setValue}
        placeholder="Extra Small"
      />
      <Select
        size="sm"
        options={fruitOptions}
        value={value}
        onChange={setValue}
        placeholder="Small"
      />
      <Select
        size="md"
        options={fruitOptions}
        value={value}
        onChange={setValue}
        placeholder="Medium"
      />
      <Select
        size="lg"
        options={fruitOptions}
        value={value}
        onChange={setValue}
        placeholder="Large"
      />
      <Select
        size="xl"
        options={fruitOptions}
        value={value}
        onChange={setValue}
        placeholder="Extra Large"
      />
    </View>
  );
}

// Example 4: Select with Label
export function SelectWithLabel() {
  const [value, setValue] = React.useState('');

  return (
    <Select
      label="Country"
      options={countryOptions}
      value={value}
      onChange={setValue}
      placeholder="Select your country"
    />
  );
}

// Example 5: Select with Helper Text
export function SelectWithHelperText() {
  const [value, setValue] = React.useState('');

  return (
    <Select
      label="Shipping Country"
      options={countryOptions}
      value={value}
      onChange={setValue}
      placeholder="Select country"
      helperText="Choose where you want your order shipped"
    />
  );
}

// Example 6: Select with Error State
export function SelectWithError() {
  const [value, setValue] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const hasError = submitted && !value;

  return (
    <View spacing="md">
      <Select
        label="Country *"
        options={countryOptions}
        value={value}
        onChange={setValue}
        placeholder="Select country"
        error={hasError}
        helperText={hasError ? 'Please select a country' : 'Required field'}
      />
    </View>
  );
}

// Example 7: Disabled Select
export function DisabledSelect() {
  return (
    <Select
      options={fruitOptions}
      value="apple"
      onChange={() => {}}
      placeholder="Select a fruit"
      disabled
    />
  );
}

// Example 8: Searchable Select (Web only)
export function SearchableSelect() {
  const [value, setValue] = React.useState('');

  const largeOptions: SelectOption[] = [
    { value: 'af', label: 'Afghanistan' },
    { value: 'al', label: 'Albania' },
    { value: 'dz', label: 'Algeria' },
    { value: 'ar', label: 'Argentina' },
    { value: 'au', label: 'Australia' },
    { value: 'at', label: 'Austria' },
    { value: 'br', label: 'Brazil' },
    { value: 'ca', label: 'Canada' },
    { value: 'cn', label: 'China' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'in', label: 'India' },
    { value: 'it', label: 'Italy' },
    { value: 'jp', label: 'Japan' },
    { value: 'mx', label: 'Mexico' },
    { value: 'ru', label: 'Russia' },
    { value: 'es', label: 'Spain' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'us', label: 'United States' },
  ];

  return (
    <Select
      label="Country"
      options={largeOptions}
      value={value}
      onChange={setValue}
      placeholder="Search for a country..."
      searchable
      maxHeight={300}
    />
  );
}

// Example 9: Select with Disabled Options
export function SelectWithDisabledOptions() {
  const [value, setValue] = React.useState('');

  const optionsWithDisabled: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape', disabled: true },
    { value: 'mango', label: 'Mango' },
  ];

  return (
    <Select
      label="Select a fruit"
      options={optionsWithDisabled}
      value={value}
      onChange={setValue}
      placeholder="Some options are disabled"
      helperText="Banana and Grape are out of stock"
    />
  );
}

// Example 10: Form with Multiple Selects
export function FormWithSelects() {
  const [country, setCountry] = React.useState('');
  const [fruit, setFruit] = React.useState('');
  const [size, setSize] = React.useState('');

  const sizeOptions: SelectOption[] = [
    { value: 'xs', label: 'Extra Small' },
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  return (
    <View spacing="md">
      <Select
        label="Country"
        options={countryOptions}
        value={country}
        onChange={setCountry}
        placeholder="Select country"
      />
      <Select
        label="Favorite Fruit"
        options={fruitOptions}
        value={fruit}
        onChange={setFruit}
        placeholder="Select fruit"
      />
      <Select
        label="Size"
        options={sizeOptions}
        value={size}
        onChange={setSize}
        placeholder="Select size"
      />
    </View>
  );
}
