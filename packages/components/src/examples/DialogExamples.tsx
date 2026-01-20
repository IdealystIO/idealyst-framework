import { useState } from 'react';
import { Screen, View, Button, Text, Dialog } from '../index';
import { BlurView } from '@idealyst/blur';
import type { BackdropComponentProps } from '../Dialog/types';

/**
 * Custom blur backdrop component for dialogs.
 * Uses @idealyst/blur to create a frosted glass effect over the content.
 */
const BlurBackdrop = ({ isVisible }: BackdropComponentProps) => (
  <BlurView
    intensity={isVisible ? 80 : 0}
    blurType="dark"
    style={{
      flex: 1,
      width: '100%',
      height: '100%',
    }}
  />
);

export const DialogExamples = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [sizesOpen, setSizesOpen] = useState<string | null>(null);
  const [blurBackdropOpen, setBlurBackdropOpen] = useState(false);

  return (
    <Screen background="primary" padding="lg">
      <View gap="xl">
        <Text typography="h4" align="center">
          Dialog Examples
        </Text>
        
        {/* Basic Dialog */}
        <View gap="md">
          <Text typography="subtitle1">Basic Dialog</Text>
          <Button onPress={() => setBasicOpen(true)}>
            Open Basic Dialog
          </Button>
          <Dialog
            open={basicOpen}
            onClose={() => setBasicOpen(false)}
            title="Basic Dialog"
          >
            <Text>This is a basic dialog with a title and some content.</Text>
            <View gap="md" style={{ marginTop: 16 }}>
              <Button 
                type="contained" 
                intent="primary"
                onPress={() => setBasicOpen(false)}
              >
                Close Dialog
              </Button>
            </View>
          </Dialog>
        </View>

        {/* Dialog Variants */}
        <View gap="md">
          <Text typography="subtitle1">Dialog Variants</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Button onPress={() => setAlertOpen(true)}>
              Alert Dialog
            </Button>
            <Button onPress={() => setConfirmationOpen(true)}>
              Confirmation Dialog
            </Button>
          </View>
          
          {/* Alert Dialog */}
          <Dialog
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
            title="Important Alert"
            type="alert"
          >
            <Text>This is an alert dialog. It has a top border to indicate importance.</Text>
            <View gap="md" style={{ marginTop: 16 }}>
              <Button 
                type="contained" 
                intent="primary"
                onPress={() => setAlertOpen(false)}
              >
                Acknowledge
              </Button>
            </View>
          </Dialog>

          {/* Confirmation Dialog */}
          <Dialog
            open={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            title="Confirm Action"
            type="confirmation"
            closeOnBackdropClick={false}
          >
            <Text>Are you sure you want to delete this item? This action cannot be undone.</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <Button 
                type="outlined" 
                intent="neutral"
                onPress={() => setConfirmationOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="contained" 
                intent="danger"
                onPress={() => setConfirmationOpen(false)}
              >
                Delete
              </Button>
            </View>
          </Dialog>
        </View>

        {/* Dialog Sizes */}
        <View gap="md">
          <Text typography="subtitle1">Dialog Sizes</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            {['sm', 'md', 'lg'].map((size) => (
              <Button
                key={size}
                onPress={() => setSizesOpen(size)}
              >
                {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'} Dialog
              </Button>
            ))}
          </View>

          {sizesOpen && (
            <Dialog
              open={!!sizesOpen}
              onClose={() => setSizesOpen(null)}
              title={`${sizesOpen === 'sm' ? 'Small' : sizesOpen === 'md' ? 'Medium' : 'Large'} Dialog`}
              size={sizesOpen as 'sm' | 'md' | 'lg'}
            >
              <Text>
                This is a {sizesOpen} dialog. The width and maximum width are adjusted based on the size prop.
              </Text>
              <View gap="md" style={{ marginTop: 16 }}>
                <Button 
                  type="contained" 
                  intent="primary"
                  onPress={() => setSizesOpen(null)}
                >
                  Close
                </Button>
              </View>
            </Dialog>
          )}
        </View>


        {/* Custom Blur Backdrop */}
        <View gap="md">
          <Text typography="subtitle1">Custom Blur Backdrop</Text>
          <Text typography="caption" color="secondary">
            Use the BackdropComponent prop to create a custom blur backdrop using @idealyst/blur.
          </Text>
          <Button onPress={() => setBlurBackdropOpen(true)}>
            Open Dialog with Blur Backdrop
          </Button>
          <Dialog
            open={blurBackdropOpen}
            onClose={() => setBlurBackdropOpen(false)}
            title="Blur Backdrop Dialog"
            BackdropComponent={BlurBackdrop}
          >
            <Text>
              This dialog uses a custom backdrop component with @idealyst/blur to create
              a frosted glass effect over the background content.
            </Text>
            <View gap="md" style={{ marginTop: 16 }}>
              <Text typography="caption" color="secondary">
                The blur intensity animates based on the isVisible prop passed to the
                BackdropComponent.
              </Text>
              <Button
                type="contained"
                intent="primary"
                onPress={() => setBlurBackdropOpen(false)}
              >
                Close
              </Button>
            </View>
          </Dialog>
        </View>

        {/* Dialog Options */}
        <View gap="md">
          <Text typography="subtitle1">Dialog Options</Text>
          <Text typography="caption" color="secondary">
            • Close on backdrop click: Enabled by default, disabled for confirmation dialog above
          </Text>
          <Text typography="caption" color="secondary">
            • Close on escape key: Enabled by default (web only)
          </Text>
          <Text typography="caption" color="secondary">
            • Hardware back button: Handled automatically (native only)
          </Text>
          <Text typography="caption" color="secondary">
            • Focus management: Automatic focus trapping and restoration (web only)
          </Text>
          <Text typography="caption" color="secondary">
            • Custom backdrop: Use BackdropComponent prop for custom effects like blur
          </Text>
        </View>
      </View>
    </Screen>
  );
};