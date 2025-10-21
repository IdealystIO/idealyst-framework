import { useState, useRef } from 'react';
import { Screen, View, Button, Text, Popover } from '../index';

export const PopoverExamples = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState<string | null>(null);
  const [arrowOpen, setArrowOpen] = useState(false);

  const basicButtonRef = useRef<any>(null);
  const placementButtonRefs = useRef<{ [key: string]: any }>({});
  const arrowButtonRef = useRef<any>(null);

  const placements = [
    { id: 'top', label: 'Top' },
    { id: 'top-start', label: 'Top Start' },
    { id: 'top-end', label: 'Top End' },
    { id: 'bottom', label: 'Bottom' },
    { id: 'bottom-start', label: 'Bottom Start' },
    { id: 'bottom-end', label: 'Bottom End' },
  ];

  return (
    <Screen background="primary" padding="lg">
      <View spacing="lg">
        <Text size="large" weight="bold" align="center">
          Popover Examples
        </Text>

        {/* Basic Popover */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Basic Popover</Text>
            <Button
              ref={basicButtonRef}
              onPress={() => setBasicOpen(true)}>
              Open Basic Popover
            </Button>
          <Popover
            open={basicOpen}
            onOpenChange={setBasicOpen}
            anchor={basicButtonRef}
            placement="bottom"
          >
            <View spacing="sm">
              <Text weight="bold">Basic Popover</Text>
              <Text size="sm">This is a basic popover with some content.</Text>
              <Button size="sm" onPress={() => setBasicOpen(false)}>
                Close
              </Button>
            </View>
          </Popover>
        </View>

        {/* Placement Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Placement Options</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {placements.map((placement) => (
              <View key={placement.id}>
                <View
                  ref={(ref) => (placementButtonRefs.current[placement.id] = ref)}
                  style={{ display: 'inline-block' }}
                >
                  <Button
                    size="sm"
                    variant="outlined"
                    onPress={() => setPlacementOpen(placement.id)}
                  >
                    {placement.label}
                  </Button>
                </View>
                {placementOpen === placement.id && (
                  <Popover
                    open={true}
                    onOpenChange={() => setPlacementOpen(null)}
                    anchor={{ current: placementButtonRefs.current[placement.id] }}
                    placement={placement.id as any}
                  >
                    <View spacing="sm">
                      <Text weight="bold">{placement.label} placement</Text>
                      <Text size="sm">
                        Positioned {placement.id} relative to the button
                      </Text>
                      <Button size="sm" onPress={() => setPlacementOpen(null)}>
                        Close
                      </Button>
                    </View>
                  </Popover>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Arrow Example */}
        <View spacing="md">
          <Text size="medium" weight="semibold">With Arrow</Text>
          <Button
            ref={arrowButtonRef}
            variant="contained"
            intent="success"
            onPress={() => setArrowOpen(true)}
          >
            Popover with Arrow
          </Button>
          <Popover
            open={arrowOpen}
            onOpenChange={setArrowOpen}
            anchor={arrowButtonRef}
            placement="top"
            showArrow={true}
          >
            <View spacing="sm">
              <Text weight="bold">Arrow Popover</Text>
              <Text size="sm">
                This popover includes an arrow pointing to the anchor element.
              </Text>
              <Button size="sm" onPress={() => setArrowOpen(false)}>
                Close
              </Button>
            </View>
          </Popover>
        </View>

        {/* Features Description */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Features</Text>
          <View spacing="sm">
            <Text size="sm" color="secondary">
              • Automatically positions within viewport bounds
            </Text>
            <Text size="sm" color="secondary">
              • 12 placement options (top, bottom, left, right with start/end variants)
            </Text>
            <Text size="sm" color="secondary">
              • Optional arrow pointing to anchor element
            </Text>
            <Text size="sm" color="secondary">
              • Click outside or escape key to close
            </Text>
            <Text size="sm" color="secondary">
              • Smooth animations and transitions
            </Text>
            <Text size="sm" color="secondary">
              • Follows anchor element on scroll/resize (web)
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};