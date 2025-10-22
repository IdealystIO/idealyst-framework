import React, { useState } from 'react';
import { Alert, Screen, View, Text, Divider, Button } from '../index';
export const AlertExamples = () => {
  const [successVisible, setSuccessVisible] = useState(true);
  const [errorVisible, setErrorVisible] = useState(true);

  return (
    <Screen background="primary" safeArea>
      <View spacing="lg" style={{ maxWidth: 800, width: '100%', paddingHorizontal: 16, marginHorizontal: 'auto' }}>
        <Text size="xl" weight="bold">Alert Examples</Text>

        <View spacing="md">
          <Text size="lg" weight="semibold">Intent Variants</Text>

          <View spacing="sm">
            <Alert
              intent="primary"
              title="Primary"
              message="This is a primary alert for main actions and information."
            />

            <Alert
              intent="success"
              title="Success"
              message="Your changes have been saved successfully."
            />

            <Alert
              intent="error"
              title="Error"
              message="There was an error processing your request."
            />

            <Alert
              intent="warning"
              title="Warning"
              message="Your session will expire in 5 minutes."
            />

            <Alert
              intent="info"
              title="Information"
              message="A new version of the app is available."
            />

            <Alert
              intent="neutral"
              title="Note"
              message="This is a general informational message."
            />
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Style Variants</Text>

          <View spacing="sm">
            <Text size="md" weight="semibold">Filled</Text>
            <Alert
              variant="filled"
              intent="primary"
              title="Filled Alert"
              message="This is a filled alert with solid background."
            />
          </View>

          <View spacing="sm">
            <Text size="md" weight="semibold">Outlined</Text>
            <Alert
              variant="outlined"
              intent="primary"
              title="Outlined Alert"
              message="This is an outlined alert with border."
            />
          </View>

          <View spacing="sm">
            <Text size="md" weight="semibold">Soft (Default)</Text>
            <Alert
              variant="soft"
              intent="primary"
              title="Soft Alert"
              message="This is a soft alert with subtle background."
            />
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Without Icons</Text>

          <Alert
            intent="success"
            title="No Icon"
            message="This alert does not display an icon."
            showIcon={false}
          />
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Custom Icons</Text>

          <View spacing="sm">
            <Alert
              intent="info"
              title="Custom Icon"
              message="This alert uses a custom icon."
              icon="🚀"
            />

            <Alert
              intent="warning"
              title="Custom Component Icon"
              message="You can also use custom React components as icons."
              icon={<Text style={{ fontSize: 20 }}>⭐</Text>}
            />
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Dismissible Alerts</Text>

          <View spacing="sm">
            {successVisible && (
              <Alert
                intent="success"
                title="Dismissible Success"
                message="Click the X button to dismiss this alert."
                dismissible
                onDismiss={() => setSuccessVisible(false)}
              />
            )}

            {!successVisible && (
              <Button onPress={() => setSuccessVisible(true)}>
                Show Success Alert
              </Button>
            )}

            {errorVisible && (
              <Alert
                variant="outlined"
                intent="error"
                title="Dismissible Error"
                message="This outlined alert can also be dismissed."
                dismissible
                onDismiss={() => setErrorVisible(false)}
              />
            )}

            {!errorVisible && (
              <Button onPress={() => setErrorVisible(true)}>
                Show Error Alert
              </Button>
            )}
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">With Actions</Text>

          <View spacing="sm">
            <Alert
              intent="warning"
              title="Unsaved Changes"
              message="You have unsaved changes. Do you want to save them?"
              actions={
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button variant="contained" intent="primary" size="sm">
                    Save
                  </Button>
                  <Button variant="outlined" intent="neutral" size="sm">
                    Discard
                  </Button>
                </View>
              }
            />

            <Alert
              variant="outlined"
              intent="info"
              title="New Feature Available"
              message="Check out our new collaboration features."
              actions={
                <Button variant="text" intent="primary" size="sm">
                  Learn More
                </Button>
              }
            />
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">With Children</Text>

          <Alert
            intent="info"
            title="Custom Content"
          >
            <View spacing="sm">
              <Text size="sm">You can use children to add custom content:</Text>
              <View style={{ paddingLeft: 16 }}>
                <Text size="sm">• Custom formatted text</Text>
                <Text size="sm">• Lists and structured content</Text>
                <Text size="sm">• Any React components</Text>
              </View>
            </View>
          </Alert>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Complex Example</Text>

          <Alert
            variant="filled"
            intent="success"
            title="Payment Successful"
            message="Your order has been confirmed and will be shipped soon."
            dismissible
            onDismiss={() => console.log('Dismissed')}
            actions={
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button variant="outlined" size="sm" onPress={() => console.log('View order')}>
                  View Order
                </Button>
                <Button variant="outlined" size="sm" onPress={() => console.log('Track')}>
                  Track Shipment
                </Button>
              </View>
            }
          />
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">All Intent Colors (Soft Variant)</Text>

          <View spacing="sm">
            {(['primary', 'success', 'error', 'warning', 'info', 'neutral'] as const).map((intent) => (
              <Alert
                key={intent}
                variant="soft"
                intent={intent}
                message={`${intent.charAt(0).toUpperCase() + intent.slice(1)} alert message`}
              />
            ))}
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">All Intent Colors (Outlined Variant)</Text>

          <View spacing="sm">
            {(['primary', 'success', 'error', 'warning', 'info', 'neutral'] as const).map((intent) => (
              <Alert
                key={intent}
                variant="outlined"
                intent={intent}
                message={`${intent.charAt(0).toUpperCase() + intent.slice(1)} alert message`}
              />
            ))}
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">All Intent Colors (Filled Variant)</Text>

          <View spacing="sm">
            {(['primary', 'success', 'error', 'warning', 'info', 'neutral'] as const).map((intent) => (
              <Alert
                key={intent}
                variant="filled"
                intent={intent}
                message={`${intent.charAt(0).toUpperCase() + intent.slice(1)} alert message`}
              />
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
};
