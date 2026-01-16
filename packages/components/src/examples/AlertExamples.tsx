import { useState } from 'react';
import { Alert, Screen, View, Text, Button } from '../index';
export const AlertExamples = () => {
  const [successVisible, setSuccessVisible] = useState(true);
  const [errorVisible, setErrorVisible] = useState(true);

  return (
    <Screen background="primary" safeArea>
      <View gap="lg" style={{ maxWidth: 800, width: '100%', paddingHorizontal: 16, marginHorizontal: 'auto' }}>
        <Text typography="h3">Alert Examples</Text>

        <View gap="md">
          <Text typography="h5">Intent Variants</Text>

          <View gap="sm">
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
              intent="danger"
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

        <View gap="md">
          <Text typography="h5">Style Variants</Text>

          <View gap="sm">
            <Text typography="subtitle1">Filled</Text>
            <Alert
              type="filled"
              intent="primary"
              title="Filled Alert"
              message="This is a filled alert with solid background."
            />
          </View>

          <View gap="sm">
            <Text typography="subtitle1">Outlined</Text>
            <Alert
              type="outlined"
              intent="primary"
              title="Outlined Alert"
              message="This is an outlined alert with border."
            />
          </View>

          <View gap="sm">
            <Text typography="subtitle1">Soft (Default)</Text>
            <Alert
              type="soft"
              intent="primary"
              title="Soft Alert"
              message="This is a soft alert with subtle background."
            />
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Without Icons</Text>

          <Alert
            intent="success"
            title="No Icon"
            message="This alert does not display an icon."
            showIcon={false}
          />
        </View>

        <View gap="md">
          <Text typography="h5">Custom Icons</Text>

          <View gap="sm">
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

        <View gap="md">
          <Text typography="h5">Dismissible Alerts</Text>

          <View gap="sm">
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
                type="outlined"
                intent="danger"
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

        <View gap="md">
          <Text typography="h5">With Actions</Text>

          <View gap="sm">
            <Alert
              intent="warning"
              title="Unsaved Changes"
              message="You have unsaved changes. Do you want to save them?"
              actions={
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button type="contained" intent="primary" size="sm">
                    Save
                  </Button>
                  <Button type="outlined" intent="neutral" size="sm">
                    Discard
                  </Button>
                </View>
              }
            />

            <Alert
              type="outlined"
              intent="info"
              title="New Feature Available"
              message="Check out our new collaboration features."
              actions={
                <Button type="text" intent="primary" size="sm">
                  Learn More
                </Button>
              }
            />
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">With Children</Text>

          <Alert
            intent="info"
            title="Custom Content"
          >
            <View gap="sm">
              <Text typography="body2">You can use children to add custom content:</Text>
              <View style={{ paddingLeft: 16 }}>
                <Text typography="body2">• Custom formatted text</Text>
                <Text typography="body2">• Lists and structured content</Text>
                <Text typography="body2">• Any React components</Text>
              </View>
            </View>
          </Alert>
        </View>

        <View gap="md">
          <Text typography="h5">Complex Example</Text>

          <Alert
            type="filled"
            intent="success"
            title="Payment Successful"
            message="Your order has been confirmed and will be shipped soon."
            dismissible
            onDismiss={() => console.log('Dismissed')}
            actions={
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button type="outlined" size="sm" onPress={() => console.log('View order')}>
                  View Order
                </Button>
                <Button type="outlined" size="sm" onPress={() => console.log('Track')}>
                  Track Shipment
                </Button>
              </View>
            }
          />
        </View>

        <View gap="md">
          <Text typography="h5">All Intent Colors (Soft Variant)</Text>

          <View gap="sm">
            {(['primary', 'success', 'danger', 'warning', 'info', 'neutral'] as const).map((intent) => (
              <Alert
                key={intent}
                type="soft"
                intent={intent}
                message={`${intent.charAt(0).toUpperCase() + intent.slice(1)} alert message`}
              />
            ))}
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">All Intent Colors (Outlined Variant)</Text>

          <View gap="sm">
            {(['primary', 'success', 'danger', 'warning', 'info', 'neutral'] as const).map((intent) => (
              <Alert
                key={intent}
                type="outlined"
                intent={intent}
                message={`${intent.charAt(0).toUpperCase() + intent.slice(1)} alert message`}
              />
            ))}
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">All Intent Colors (Filled Variant)</Text>

          <View gap="sm">
            {(['primary', 'success', 'danger', 'warning', 'info', 'neutral'] as const).map((intent) => (
              <Alert
                key={intent}
                type="filled"
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
