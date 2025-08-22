import { useState, useRef } from 'react';
import { Screen, View, Button, Text, Popover } from '../index';

export const PopoverExamples = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState<string | null>(null);
  const [arrowOpen, setArrowOpen] = useState(false);

  const basicButtonRef = useRef<HTMLDivElement>(null);
  const placementButtonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const arrowButtonRef = useRef<HTMLDivElement>(null);

  const placements = [
    'top', 'top-start', 'top-end',
    'bottom', 'bottom-start', 'bottom-end',
    'left', 'left-start', 'left-end',
    'right', 'right-start', 'right-end',
  ];

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
        <Text size="large" weight="bold" align="center">
          Popover Examples
        </Text>
        
        {/* Basic Popover */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Basic Popover</Text>
          <div ref={basicButtonRef} style={{ display: 'inline-block' }}>
            <Button onPress={() => setBasicOpen(true)}>
              Open Basic Popover
            </Button>
          </div>
          <Popover
            open={basicOpen}
            onOpenChange={setBasicOpen}
            anchor={basicButtonRef}
            placement="bottom"
          >
            <View spacing="sm">
              <Text weight="bold">Basic Popover</Text>
              <Text size="small">This is a basic popover with some content.</Text>
              <Button size="small" onPress={() => setBasicOpen(false)}>
                Close
              </Button>
            </View>
          </Popover>
        </View>

        {/* Placement Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Placement Options</Text>
          <View style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 8, 
            maxWidth: 400 
          }}>
            {placements.map((placement) => (
              <div 
                key={placement}
                ref={(ref) => placementButtonRefs.current[placement] = ref}
                style={{ display: 'inline-block' }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onPress={() => setPlacementOpen(placement)}
                >
                  {placement}
                </Button>
              </div>
            ))}
          </View>
          
          {placementOpen && (
            <Popover
              open={!!placementOpen}
              onOpenChange={() => setPlacementOpen(null)}
              anchor={{ current: placementButtonRefs.current[placementOpen] }}
              placement={placementOpen as any}
            >
              <View spacing="sm">
                <Text weight="bold">{placementOpen} placement</Text>
                <Text size="small">
                  Positioned {placementOpen} relative to the button
                </Text>
                <Button size="small" onPress={() => setPlacementOpen(null)}>
                  Close
                </Button>
              </View>
            </Popover>
          )}
        </View>

        {/* Arrow Example */}
        <View spacing="md">
          <Text size="medium" weight="semibold">With Arrow</Text>
          <div ref={arrowButtonRef} style={{ display: 'inline-block' }}>
            <Button 
              variant="contained"
              intent="success"
              onPress={() => setArrowOpen(true)}
            >
              Popover with Arrow
            </Button>
          </div>
          <Popover
            open={arrowOpen}
            onOpenChange={setArrowOpen}
            anchor={arrowButtonRef}
            placement="top"
            showArrow={true}
          >
            <View spacing="sm">
              <Text weight="bold">Arrow Popover</Text>
              <Text size="small">
                This popover includes an arrow pointing to the anchor element.
              </Text>
              <Button size="small" onPress={() => setArrowOpen(false)}>
                Close
              </Button>
            </View>
          </Popover>
        </View>

        {/* Features Description */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Features</Text>
          <View spacing="sm">
            <Text size="small" color="secondary">
              • Automatically positions within viewport bounds
            </Text>
            <Text size="small" color="secondary">
              • 12 placement options (top, bottom, left, right with start/end variants)
            </Text>
            <Text size="small" color="secondary">
              • Optional arrow pointing to anchor element
            </Text>
            <Text size="small" color="secondary">
              • Click outside or escape key to close
            </Text>
            <Text size="small" color="secondary">
              • Smooth animations and transitions
            </Text>
            <Text size="small" color="secondary">
              • Follows anchor element on scroll/resize (web)
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};