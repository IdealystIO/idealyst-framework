/**
 * RadioButton Component Examples
 *
 * These examples are type-checked against the actual RadioButtonProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { RadioButton, View, Text } from '@idealyst/components';

// Example 1: Basic RadioButton
export function BasicRadioButton() {
  const [selected, setSelected] = React.useState('option1');

  return (
    <View spacing="md">
      <RadioButton
        value="option1"
        checked={selected === 'option1'}
        onPress={() => setSelected('option1')}
        label="Option 1"
      />
      <RadioButton
        value="option2"
        checked={selected === 'option2'}
        onPress={() => setSelected('option2')}
        label="Option 2"
      />
      <RadioButton
        value="option3"
        checked={selected === 'option3'}
        onPress={() => setSelected('option3')}
        label="Option 3"
      />
    </View>
  );
}

// Example 2: RadioButton Sizes
export function RadioButtonSizes() {
  const [selected, setSelected] = React.useState('md');

  return (
    <View spacing="md">
      <RadioButton
        value="xs"
        checked={selected === 'xs'}
        onPress={() => setSelected('xs')}
        label="Extra Small"
        size="xs"
      />
      <RadioButton
        value="sm"
        checked={selected === 'sm'}
        onPress={() => setSelected('sm')}
        label="Small"
        size="sm"
      />
      <RadioButton
        value="md"
        checked={selected === 'md'}
        onPress={() => setSelected('md')}
        label="Medium"
        size="md"
      />
      <RadioButton
        value="lg"
        checked={selected === 'lg'}
        onPress={() => setSelected('lg')}
        label="Large"
        size="lg"
      />
      <RadioButton
        value="xl"
        checked={selected === 'xl'}
        onPress={() => setSelected('xl')}
        label="Extra Large"
        size="xl"
      />
    </View>
  );
}

// Example 3: RadioButton with Intent Colors
export function RadioButtonWithIntent() {
  const [selected, setSelected] = React.useState('primary');

  return (
    <View spacing="md">
      <RadioButton
        value="primary"
        checked={selected === 'primary'}
        onPress={() => setSelected('primary')}
        label="Primary"
        intent="primary"
      />
      <RadioButton
        value="success"
        checked={selected === 'success'}
        onPress={() => setSelected('success')}
        label="Success"
        intent="success"
      />
      <RadioButton
        value="error"
        checked={selected === 'error'}
        onPress={() => setSelected('error')}
        label="Error"
        intent="error"
      />
      <RadioButton
        value="warning"
        checked={selected === 'warning'}
        onPress={() => setSelected('warning')}
        label="Warning"
        intent="warning"
      />
      <RadioButton
        value="info"
        checked={selected === 'info'}
        onPress={() => setSelected('info')}
        label="Info"
        intent="info"
      />
      <RadioButton
        value="neutral"
        checked={selected === 'neutral'}
        onPress={() => setSelected('neutral')}
        label="Neutral"
        intent="neutral"
      />
    </View>
  );
}

// Example 4: RadioButton Group with Header
export function RadioButtonGroup() {
  const [preference, setPreference] = React.useState('email');

  return (
    <View spacing="md">
      <Text weight="bold" size="md">
        Contact Preference
      </Text>
      <View spacing="sm">
        <RadioButton
          value="email"
          checked={preference === 'email'}
          onPress={() => setPreference('email')}
          label="Email"
        />
        <RadioButton
          value="phone"
          checked={preference === 'phone'}
          onPress={() => setPreference('phone')}
          label="Phone"
        />
        <RadioButton
          value="sms"
          checked={preference === 'sms'}
          onPress={() => setPreference('sms')}
          label="SMS"
        />
        <RadioButton
          value="none"
          checked={preference === 'none'}
          onPress={() => setPreference('none')}
          label="Do not contact me"
        />
      </View>
      <Text size="sm" >
        Selected: {preference}
      </Text>
    </View>
  );
}

// Example 5: Disabled RadioButton
export function DisabledRadioButton() {
  const [selected, setSelected] = React.useState('option1');

  return (
    <View spacing="md">
      <RadioButton
        value="option1"
        checked={selected === 'option1'}
        onPress={() => setSelected('option1')}
        label="Available Option"
      />
      <RadioButton
        value="option2"
        checked={selected === 'option2'}
        onPress={() => setSelected('option2')}
        label="Disabled Unchecked"
        disabled
      />
      <RadioButton
        value="option3"
        checked={true}
        onPress={() => {}}
        label="Disabled Checked"
        disabled
      />
    </View>
  );
}

// Example 6: Shipping Method Selection
export function ShippingMethodSelection() {
  const [shipping, setShipping] = React.useState('standard');

  const shippingOptions = [
    { value: 'standard', label: 'Standard Shipping', price: 'Free', duration: '5-7 business days' },
    { value: 'express', label: 'Express Shipping', price: '$9.99', duration: '2-3 business days' },
    { value: 'overnight', label: 'Overnight Shipping', price: '$24.99', duration: '1 business day' },
  ];

  return (
    <View spacing="lg">
      <Text weight="bold" size="lg">
        Select Shipping Method
      </Text>
      <View spacing="md">
        {shippingOptions.map((option) => (
          <View
            key={option.value}
            background="primary"
            spacing="md"
            radius="md"
            border="thin"
            style={{
              borderColor: shipping === option.value ? 'blue' : 'gray',
            }}
          >
            <RadioButton
              value={option.value}
              checked={shipping === option.value}
              onPress={() => setShipping(option.value)}
              label={option.label}
            />
            <View spacing="xs">
              <Text size="sm" >
                {option.price} • {option.duration}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// Example 7: Payment Method Selection
export function PaymentMethodSelection() {
  const [payment, setPayment] = React.useState('card');

  return (
    <View spacing="lg">
      <Text weight="bold" size="lg">
        Payment Method
      </Text>
      <View spacing="md">
        <RadioButton
          value="card"
          checked={payment === 'card'}
          onPress={() => setPayment('card')}
          label="Credit or Debit Card"
        />
        <RadioButton
          value="paypal"
          checked={payment === 'paypal'}
          onPress={() => setPayment('paypal')}
          label="PayPal"
        />
        <RadioButton
          value="bank"
          checked={payment === 'bank'}
          onPress={() => setPayment('bank')}
          label="Bank Transfer"
        />
        <RadioButton
          value="cash"
          checked={payment === 'cash'}
          onPress={() => setPayment('cash')}
          label="Cash on Delivery"
        />
      </View>
    </View>
  );
}

// Example 8: Subscription Plan Selection
export function SubscriptionPlanSelection() {
  const [plan, setPlan] = React.useState('pro');

  const plans = [
    { value: 'free', label: 'Free Plan', price: '$0/month', features: 'Basic features' },
    { value: 'pro', label: 'Pro Plan', price: '$9.99/month', features: 'All features included' },
    { value: 'enterprise', label: 'Enterprise Plan', price: '$29.99/month', features: 'Priority support' },
  ];

  return (
    <View spacing="lg">
      <Text weight="bold" size="lg">
        Choose Your Plan
      </Text>
      <View spacing="md">
        {plans.map((planOption) => (
          <View
            key={planOption.value}
            background="primary"
            spacing="lg"
            radius="lg"
            border="thin"
            style={{
              borderColor: plan === planOption.value ? 'blue' : 'gray',
            }}
          >
            <RadioButton
              value={planOption.value}
              checked={plan === planOption.value}
              onPress={() => setPlan(planOption.value)}
              label={planOption.label}
              intent={plan === planOption.value ? 'primary' : 'neutral'}
            />
            <View spacing="xs">
              <Text weight="bold" size="lg">
                {planOption.price}
              </Text>
              <Text size="sm" >
                {planOption.features}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// Example 9: Survey Question
export function SurveyQuestion() {
  const [satisfaction, setSatisfaction] = React.useState<string>('');

  return (
    <View spacing="lg">
      <View spacing="sm">
        <Text weight="bold" size="md">
          How satisfied are you with our service?
        </Text>
        <Text size="sm" >
          Please select one option
        </Text>
      </View>
      <View spacing="md">
        <RadioButton
          value="very-satisfied"
          checked={satisfaction === 'very-satisfied'}
          onPress={() => setSatisfaction('very-satisfied')}
          label="Very Satisfied"
          intent="success"
        />
        <RadioButton
          value="satisfied"
          checked={satisfaction === 'satisfied'}
          onPress={() => setSatisfaction('satisfied')}
          label="Satisfied"
        />
        <RadioButton
          value="neutral"
          checked={satisfaction === 'neutral'}
          onPress={() => setSatisfaction('neutral')}
          label="Neutral"
        />
        <RadioButton
          value="dissatisfied"
          checked={satisfaction === 'dissatisfied'}
          onPress={() => setSatisfaction('dissatisfied')}
          label="Dissatisfied"
          intent="warning"
        />
        <RadioButton
          value="very-dissatisfied"
          checked={satisfaction === 'very-dissatisfied'}
          onPress={() => setSatisfaction('very-dissatisfied')}
          label="Very Dissatisfied"
          intent="error"
        />
      </View>
    </View>
  );
}

// Example 10: Notification Frequency
export function NotificationFrequency() {
  const [frequency, setFrequency] = React.useState('daily');

  return (
    <View spacing="lg">
      <Text weight="bold" size="lg">
        Notification Frequency
      </Text>
      <View spacing="md">
        <RadioButton
          value="realtime"
          checked={frequency === 'realtime'}
          onPress={() => setFrequency('realtime')}
          label="Real-time"
        />
        <Text size="sm"  style={{ marginLeft: 32 }}>
          Get notified immediately when something happens
        </Text>
        <RadioButton
          value="daily"
          checked={frequency === 'daily'}
          onPress={() => setFrequency('daily')}
          label="Daily Digest"
        />
        <Text size="sm"  style={{ marginLeft: 32 }}>
          Receive a summary once per day
        </Text>
        <RadioButton
          value="weekly"
          checked={frequency === 'weekly'}
          onPress={() => setFrequency('weekly')}
          label="Weekly Digest"
        />
        <Text size="sm"  style={{ marginLeft: 32 }}>
          Receive a summary once per week
        </Text>
        <RadioButton
          value="never"
          checked={frequency === 'never'}
          onPress={() => setFrequency('never')}
          label="Never"
        />
        <Text size="sm"  style={{ marginLeft: 32 }}>
          Don't send me any notifications
        </Text>
      </View>
    </View>
  );
}
