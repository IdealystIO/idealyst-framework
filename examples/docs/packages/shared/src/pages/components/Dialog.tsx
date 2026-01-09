import React, { useState } from 'react';
import { View, Text, Dialog, Button, Screen } from '@idealyst/components';
import { ComponentPlayground, dialogPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper that manages open state
function DemoDialog(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Button onPress={() => setOpen(true)}>Open Dialog</Button>
      <Dialog {...props} open={open} onOpenChange={setOpen} title="Example Dialog">
        <Text>This is dialog content. Customize using the props above.</Text>
      </Dialog>
    </View>
  );
}

export function DialogPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Dialog
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Modal overlay for focused content, confirmations, or alerts.
          Supports multiple sizes and configurable closing behavior.
        </Text>

        <ComponentPlayground
          component={DemoDialog}
          componentName="Dialog"
          propConfig={dialogPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
