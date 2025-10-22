import { useState } from 'react';
import { Screen, View, Button, Text, Dialog } from '../index';

export const DialogExamples = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [sizesOpen, setSizesOpen] = useState<string | null>(null);

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
        <Text size="lg" weight="bold" align="center">
          Dialog Examples
        </Text>
        
        {/* Basic Dialog */}
        <View spacing="md">
          <Text size="md" weight="semibold">Basic Dialog</Text>
          <Button onPress={() => setBasicOpen(true)}>
            Open Basic Dialog
          </Button>
          <Dialog
            open={basicOpen}
            onOpenChange={setBasicOpen}
            title="Basic Dialog"
          >
            <Text>This is a basic dialog with a title and some content.</Text>
            <View spacing="md" style={{ marginTop: 16 }}>
              <Button 
                variant="contained" 
                intent="primary"
                onPress={() => setBasicOpen(false)}
              >
                Close Dialog
              </Button>
            </View>
          </Dialog>
        </View>

        {/* Dialog Variants */}
        <View spacing="md">
          <Text size="md" weight="semibold">Dialog Variants</Text>
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
            onOpenChange={setAlertOpen}
            title="Important Alert"
            variant="alert"
          >
            <Text>This is an alert dialog. It has a top border to indicate importance.</Text>
            <View spacing="md" style={{ marginTop: 16 }}>
              <Button 
                variant="contained" 
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
            onOpenChange={setConfirmationOpen}
            title="Confirm Action"
            variant="confirmation"
            closeOnBackdropClick={false}
          >
            <Text>Are you sure you want to delete this item? This action cannot be undone.</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <Button 
                variant="outlined" 
                intent="neutral"
                onPress={() => setConfirmationOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                intent="error"
                onPress={() => setConfirmationOpen(false)}
              >
                Delete
              </Button>
            </View>
          </Dialog>
        </View>

        {/* Dialog Sizes */}
        <View spacing="md">
          <Text size="md" weight="semibold">Dialog Sizes</Text>
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
              onOpenChange={() => setSizesOpen(null)}
              title={`${sizesOpen === 'sm' ? 'Small' : sizesOpen === 'md' ? 'Medium' : 'Large'} Dialog`}
              size={sizesOpen as 'sm' | 'md' | 'lg'}
            >
              <Text>
                This is a {sizesOpen} dialog. The width and maximum width are adjusted based on the size prop.
              </Text>
              <View spacing="md" style={{ marginTop: 16 }}>
                <Button 
                  variant="contained" 
                  intent="primary"
                  onPress={() => setSizesOpen(null)}
                >
                  Close
                </Button>
              </View>
            </Dialog>
          )}
        </View>


        {/* Dialog Options */}
        <View spacing="md">
          <Text size="md" weight="semibold">Dialog Options</Text>
          <Text size="sm" color="secondary">
            • Close on backdrop click: Enabled by default, disabled for confirmation dialog above
          </Text>
          <Text size="sm" color="secondary">
            • Close on escape key: Enabled by default (web only)
          </Text>
          <Text size="sm" color="secondary">
            • Hardware back button: Handled automatically (native only)
          </Text>
          <Text size="sm" color="secondary">
            • Focus management: Automatic focus trapping and restoration (web only)
          </Text>
        </View>
      </View>
    </Screen>
  );
};