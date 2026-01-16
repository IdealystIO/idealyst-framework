/**
 * Slider Component Examples
 *
 * These examples are type-checked against the actual SliderProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Slider, View, Text } from '@idealyst/components';

// Example 1: Basic Slider
export function BasicSlider() {
  const [value, setValue] = React.useState(50);

  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={100}
    />
  );
}

// Example 2: Slider with Value Display
export function SliderWithValue() {
  const [value, setValue] = React.useState(25);

  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      showValue
    />
  );
}

// Example 3: Slider with Min/Max Labels
export function SliderWithMinMax() {
  const [value, setValue] = React.useState(50);

  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      showMinMax
      showValue
    />
  );
}

// Example 4: Slider with Steps
export function SliderWithSteps() {
  const [value, setValue] = React.useState(50);

  return (
    <View spacing="md">
      <Text>Value: {value}</Text>
      <Slider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={10}
        showValue
        showMinMax
      />
    </View>
  );
}

// Example 5: Slider Sizes
export function SliderSizes() {
  const [value, setValue] = React.useState(50);

  return (
    <View spacing="lg">
      <Slider size="xs" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider size="sm" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider size="md" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider size="lg" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider size="xl" value={value} onChange={setValue} min={0} max={100} showValue />
    </View>
  );
}

// Example 6: Slider Intents
export function SliderIntents() {
  const [value, setValue] = React.useState(50);

  return (
    <View spacing="md">
      <Slider intent="primary" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider intent="success" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider intent="danger" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider intent="warning" value={value} onChange={setValue} min={0} max={100} showValue />
      <Slider intent="info" value={value} onChange={setValue} min={0} max={100} showValue />
    </View>
  );
}

// Example 7: Slider with Icon
export function SliderWithIcon() {
  const [volume, setVolume] = React.useState(50);

  return (
    <View spacing="sm">
      <Text>Volume: {volume}%</Text>
      <Slider
        icon="volume-high"
        value={volume}
        onChange={setVolume}
        min={0}
        max={100}
        showValue
      />
    </View>
  );
}

// Example 8: Slider with Marks
export function SliderWithMarks() {
  const [value, setValue] = React.useState(50);

  const marks = [
    { value: 0, label: '0°C' },
    { value: 25, label: '25°C' },
    { value: 50, label: '50°C' },
    { value: 75, label: '75°C' },
    { value: 100, label: '100°C' },
  ];

  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      marks={marks}
      showValue
    />
  );
}

// Example 9: Disabled Slider
export function DisabledSlider() {
  return (
    <Slider
      value={60}
      onChange={() => {}}
      min={0}
      max={100}
      disabled
      showValue
      showMinMax
    />
  );
}

// Example 10: Price Range Slider
export function PriceRangeSlider() {
  const [price, setPrice] = React.useState(500);

  return (
    <View spacing="sm">
      <Text weight="bold">Maximum Price: ${price}</Text>
      <Slider
        icon="currency-usd"
        value={price}
        onChange={setPrice}
        min={0}
        max={1000}
        step={50}
        showValue
        showMinMax
        intent="success"
      />
    </View>
  );
}

// Example 11: Brightness Control
export function BrightnessControl() {
  const [brightness, setBrightness] = React.useState(75);

  return (
    <View spacing="sm">
      <Text>Brightness: {brightness}%</Text>
      <Slider
        icon="brightness-6"
        value={brightness}
        onChange={setBrightness}
        min={0}
        max={100}
        step={5}
        intent="warning"
      />
    </View>
  );
}

// Example 12: Multiple Sliders with onValueCommit
export function MultipleSliders() {
  const [red, setRed] = React.useState(128);
  const [green, setGreen] = React.useState(128);
  const [blue, setBlue] = React.useState(128);

  return (
    <View spacing="md">
      <View
        style={{
          height: 100,
          backgroundColor: `rgb(${red}, ${green}, ${blue})`,
          borderRadius: 8,
        }}
      />
      <View spacing="md">
        <Slider
          value={red}
          onChange={setRed}
          min={0}
          max={255}
          showValue
          intent="danger"
        />
        <Slider
          value={green}
          onChange={setGreen}
          min={0}
          max={255}
          showValue
          intent="success"
        />
        <Slider
          value={blue}
          onChange={setBlue}
          min={0}
          max={255}
          showValue
          intent="info"
        />
      </View>
    </View>
  );
}
