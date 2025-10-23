import React, { useState, useRef, useEffect, isValidElement, cloneElement, forwardRef } from 'react';
import { View, Modal, Text, Pressable } from 'react-native';
import { tooltipStyles } from './Tooltip.styles';
import type { TooltipProps } from './types';

const Tooltip = forwardRef<View, TooltipProps>(({
  content,
  children,
  placement = 'top',
  delay = 200,
  intent = 'neutral',
  size = 'md',
  style,
  testID,
}, ref) => {
  const [visible, setVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Apply variants
  tooltipStyles.useVariants({
    size,
    intent,
    placement,
    visible,
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const calculateTooltipPosition = (x: number, y: number, width: number, height: number) => {
    const offset = 8;
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = y - offset;
        left = x + width / 2;
        break;
      case 'bottom':
        top = y + height + offset;
        left = x + width / 2;
        break;
      case 'left':
        top = y + height / 2;
        left = x - offset;
        break;
      case 'right':
        top = y + height / 2;
        left = x + width + offset;
        break;
    }

    setTooltipPosition({ top, left, width });
  };

  const handleLongPress = () => {
    if (!triggerRef.current) return;

    triggerRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
      calculateTooltipPosition(x, y, width, height);
      setVisible(true);
    });
  };

  const handlePress = () => {
    if (visible) {
      setVisible(false);
    }
  };

  // Clone child and inject long press handler
  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        onLongPress: () => {
          const originalOnLongPress = (children as any).props?.onLongPress;
          originalOnLongPress?.();
          handleLongPress();
        },
        onPress: (e: any) => {
          const originalOnPress = (children as any).props?.onPress;
          originalOnPress?.(e);
          handlePress();
        },
      })
    : children;

  const getPositionStyle = () => {
    switch (placement) {
      case 'top':
        return {
          bottom: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: [{ translateX: -50 }],
        };
      case 'bottom':
        return {
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: [{ translateX: -50 }],
        };
      case 'left':
        return {
          top: tooltipPosition.top,
          right: tooltipPosition.left,
          transform: [{ translateY: -50 }],
        };
      case 'right':
        return {
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: [{ translateY: -50 }],
        };
      default:
        return {
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        };
    }
  };

  return (
    <>
      <View ref={ref} collapsable={false} style={style}>
        {trigger}
      </View>

      {visible && (
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={() => setVisible(false)}
          testID={testID}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
            <View
              style={[
                tooltipStyles.tooltip,
                { position: 'absolute' },
                getPositionStyle(),
              ]}
              pointerEvents="none"
            >
              {typeof content === 'string' ? (
                <Text style={tooltipStyles.tooltip}>{content}</Text>
              ) : (
                content
              )}
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
