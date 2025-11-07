/**
 * Alert Component Examples
 *
 * These examples are type-checked against the actual AlertProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Alert, View, Text, Button, Icon } from '@idealyst/components';

// Example 1: Basic Alert
export function BasicAlert() {
  return (
    <Alert
      title="Basic Alert"
      message="This is a simple alert message."
    />
  );
}

// Example 2: Alert Intents
export function AlertIntents() {
  return (
    <View spacing="md">
      <Alert
        intent="primary"
        title="Primary Alert"
        message="This is a primary alert message."
      />
      <Alert
        intent="success"
        title="Success"
        message="Your changes have been saved successfully."
      />
      <Alert
        intent="error"
        title="Error"
        message="An error occurred while processing your request."
      />
      <Alert
        intent="warning"
        title="Warning"
        message="Please review your information before proceeding."
      />
      <Alert
        intent="info"
        title="Information"
        message="Here's some helpful information for you."
      />
      <Alert
        intent="neutral"
        title="Neutral"
        message="This is a neutral alert message."
      />
    </View>
  );
}

// Example 3: Alert Types
export function AlertTypes() {
  return (
    <View spacing="md">
      <Alert
        type="filled"
        intent="success"
        title="Filled Alert"
        message="This is a filled alert with a solid background."
      />
      <Alert
        type="outlined"
        intent="info"
        title="Outlined Alert"
        message="This is an outlined alert with a border."
      />
      <Alert
        type="soft"
        intent="warning"
        title="Soft Alert"
        message="This is a soft alert with a subtle background."
      />
    </View>
  );
}

// Example 4: Alert with Icons
export function AlertWithIcons() {
  return (
    <View spacing="md">
      <Alert
        intent="success"
        title="Success"
        message="Operation completed successfully."
        showIcon
      />
      <Alert
        intent="error"
        title="Error"
        message="Something went wrong."
        showIcon
      />
      <Alert
        intent="warning"
        title="Warning"
        message="Please be careful."
        showIcon
      />
      <Alert
        intent="info"
        title="Info"
        message="Did you know?"
        showIcon
      />
    </View>
  );
}

// Example 5: Alert with Custom Icon
export function AlertWithCustomIcon() {
  return (
    <View spacing="md">
      <Alert
        intent="primary"
        title="Custom Icon"
        message="This alert has a custom icon."
        icon={<Icon name="rocket" size="lg" />}
      />
      <Alert
        intent="success"
        title="Verified"
        message="Your account has been verified."
        icon={<Icon name="check-decagram" size="lg" />}
      />
    </View>
  );
}

// Example 6: Dismissible Alert
export function DismissibleAlert() {
  const [visible1, setVisible1] = React.useState(true);
  const [visible2, setVisible2] = React.useState(true);

  return (
    <View spacing="md">
      {visible1 && (
        <Alert
          intent="info"
          title="Dismissible Alert"
          message="You can close this alert by clicking the X button."
          dismissible
          onDismiss={() => setVisible1(false)}
          showIcon
        />
      )}
      {visible2 && (
        <Alert
          intent="warning"
          title="Another Dismissible Alert"
          message="This one can also be dismissed."
          dismissible
          onDismiss={() => setVisible2(false)}
          showIcon
        />
      )}
      {!visible1 && !visible2 && (
        <Button
          onPress={() => {
            setVisible1(true);
            setVisible2(true);
          }}
        >
          Reset Alerts
        </Button>
      )}
    </View>
  );
}

// Example 7: Alert with Actions
export function AlertWithActions() {
  return (
    <View spacing="md">
      <Alert
        intent="info"
        title="Update Available"
        message="A new version of the app is available."
        showIcon
        actions={
          <View spacing="sm">
            <Button size="sm" intent="primary">
              Update Now
            </Button>
            <Button size="sm" type="outlined">
              Later
            </Button>
          </View>
        }
      />
      <Alert
        intent="error"
        title="Connection Lost"
        message="Unable to connect to the server."
        showIcon
        actions={
          <Button size="sm" intent="error">
            Retry
          </Button>
        }
      />
    </View>
  );
}

// Example 8: Alert with Children
export function AlertWithChildren() {
  return (
    <Alert intent="info" showIcon>
      <View spacing="sm">
        <View spacing="xs">
          <Text weight="bold" size="md">
            Important Notice
          </Text>
          <Text size="sm" >
            Please read the following information carefully:
          </Text>
        </View>
        <View spacing="xs">
          <Text size="sm">• Your account will expire in 30 days</Text>
          <Text size="sm">• Make sure to backup your data</Text>
          <Text size="sm">• Contact support if you need help</Text>
        </View>
      </View>
    </Alert>
  );
}

// Example 9: Notification-style Alerts
export function NotificationStyleAlerts() {
  return (
    <View spacing="md">
      <Alert
        type="soft"
        intent="success"
        title="Payment Received"
        message="Your payment of $99.99 has been processed."
        showIcon
        dismissible
        onDismiss={() => {}}
      />
      <Alert
        type="soft"
        intent="info"
        title="New Message"
        message="You have 3 unread messages from Sarah."
        showIcon
        dismissible
        onDismiss={() => {}}
      />
      <Alert
        type="soft"
        intent="warning"
        title="Subscription Expiring"
        message="Your subscription expires in 7 days."
        showIcon
        dismissible
        onDismiss={() => {}}
        actions={
          <Button size="sm" type="outlined">
            Renew
          </Button>
        }
      />
    </View>
  );
}

// Example 10: Form Validation Alerts
export function FormValidationAlerts() {
  return (
    <View spacing="md">
      <Alert
        type="outlined"
        intent="error"
        title="Form Validation Failed"
        message="Please correct the following errors:"
        showIcon
      >
        <View spacing="xs">
          <Text size="sm" >
            • Email address is required
          </Text>
          <Text size="sm" >
            • Password must be at least 8 characters
          </Text>
          <Text size="sm" >
            • Terms and conditions must be accepted
          </Text>
        </View>
      </Alert>
    </View>
  );
}

// Example 11: System Status Alerts
export function SystemStatusAlerts() {
  return (
    <View spacing="md">
      <Alert
        type="filled"
        intent="success"
        title="All Systems Operational"
        message="All services are running normally."
        showIcon
      />
      <Alert
        type="filled"
        intent="warning"
        title="Scheduled Maintenance"
        message="The system will be down for maintenance on Sunday at 2 AM."
        showIcon
        actions={
          <Button size="sm">
            Learn More
          </Button>
        }
      />
      <Alert
        type="filled"
        intent="error"
        title="Service Disruption"
        message="We're experiencing technical difficulties. Our team is working on it."
        showIcon
      />
    </View>
  );
}
