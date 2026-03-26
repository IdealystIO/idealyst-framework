import { forwardRef, useRef } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { PressableProps } from './types';
import { pressableStyles } from './Pressable.styles';
import { createPressEvent } from '../utils/events';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';

const Pressable = forwardRef<IdealystElement, PressableProps>(({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  // Spacing variants from PressableSpacingStyleProps
  padding,
  paddingVertical,
  paddingHorizontal,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole: _accessibilityRole,
  id,
}, ref) => {
  const internalRef = useRef<IdealystElement>(null);
  const mergedRef = useMergeRefs(ref, internalRef);

  // Apply spacing variants
  pressableStyles.useVariants({
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  const pressableStyle = (pressableStyles.pressable as any)({});

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : (e) => onPress?.(createPressEvent(e, 'press', internalRef))}
      onPressIn={disabled ? undefined : (e) => onPressIn?.(createPressEvent(e, 'pressIn', internalRef))}
      onPressOut={disabled ? undefined : (e) => onPressOut?.(createPressEvent(e, 'pressOut', internalRef))}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      <View ref={mergedRef as any} nativeID={id} style={[pressableStyle, style]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
});

Pressable.displayName = 'Pressable';

export default Pressable;
