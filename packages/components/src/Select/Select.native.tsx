import React, { useState, useRef, forwardRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  ActionSheetIOS,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectProps, SelectOption } from './types';
import { selectStyles } from './Select.styles';
import { calculateSmartPosition, calculateAvailableHeight } from '../utils/positionUtils.native';
import { BoundedModalContent } from '../internal/BoundedModalContent.native';

const Select = forwardRef<View, SelectProps>(({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  helperText,
  label,
  variant = 'outlined',
  intent = 'neutral',
  size = 'md',
  searchable = false,
  filterOption,
  presentationMode = 'dropdown',
  maxHeight = 240,
  style,
  testID,
  accessibilityLabel,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const [dropdownSize, setDropdownSize] = useState({ width: 0, height: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const triggerRef = useRef<any>(null);
  const anchorMeasurements = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const insets = useSafeAreaInsets();

  const selectedOption = options.find(option => option.value === value);

  // Helper function to calculate dropdown position
  const calculateDropdownPosition = (x: number, y: number, width: number, height: number) => {
    if (__DEV__) {
      console.log('[Select] 6. Calculate desired position');
    }

    // For flip detection, we need to use maxHeight to properly detect insufficient space
    // But once we have a measured height, use that for tighter positioning
    // Wait for first measurement before positioning to avoid gaps
    let heightForPositioning = maxHeight;

    if (dropdownSize.height > 0) {
      // We have a measured height - use it if it's less than maxHeight
      heightForPositioning = Math.min(dropdownSize.height, maxHeight);
    }

    const desiredSize = {
      width: dropdownSize.width,
      height: heightForPositioning
    };

    // Calculate position with flip detection
    const position = calculateSmartPosition(
      { x, y, width, height },
      desiredSize,
      'bottom-start',
      4,
      true,
      insets
    );

    if (__DEV__) {
      console.log('[Select] Position calculation:', {
        anchorY: y,
        anchorHeight: height,
        measuredHeight: dropdownSize.height,
        heightForPositioning,
        maxHeight,
        calculatedTop: position.top,
        willFlipAbove: position.top < y,
      });
    }

    if (__DEV__) {
      console.log('[Select] 7. Show component at position:', position);
    }

    setDropdownPosition({
      top: position.top,
      left: position.left,
      width: position.width || width,
    });

    // Mark as positioned after the next frame to allow layout to stabilize
    requestAnimationFrame(() => {
      setIsPositioned(true);
    });
  };

  // Recalculate position when dropdown size changes
  useEffect(() => {
    if (isOpen && anchorMeasurements.current && dropdownSize.width > 0 && dropdownSize.height > 0) {
      const { x, y, width, height } = anchorMeasurements.current;
      calculateDropdownPosition(x, y, width, height);
    }
  }, [dropdownSize, isOpen]);

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => {
        if (filterOption) {
          return filterOption(option, searchTerm);
        }
        return option.label.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : options;

  // Apply styles with variants
  selectStyles.useVariants({
    type: variant,
    size,
    intent,
    disabled,
    error,
    focused: isOpen,
  });

  const handleTriggerPress = () => {
    if (disabled) return;

    if (Platform.OS === 'ios' && presentationMode === 'actionSheet') {
      showIOSActionSheet();
    } else {
      // Measure trigger position before opening
      triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
        if (__DEV__) {
          console.log('[Select] 1. Handle Press - Anchor measured:', { x, y, width, height });
        }

        // Store anchor measurements for potential recalculation
        anchorMeasurements.current = { x, y, width, height };

        // Set initial position to bottom-start (will be adjusted after measurement)
        // Don't use -9999 as that prevents proper layout
        setDropdownPosition({ top: y + height + 4, left: x, width });

        if (__DEV__) {
          console.log('[Select] 2. Set open state with initial position');
        }

        // Open the modal (it will be invisible with opacity 0 until positioned)
        setIsOpen(true);
        setIsPositioned(false);
        setSearchTerm('');
        // Animate dropdown appearance
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 20,
        }).start();
      });
    }
  };

  const showIOSActionSheet = () => {
    const actionOptions = options.map(option => option.label);
    const cancelButtonIndex = actionOptions.length;
    actionOptions.push('Cancel');

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: actionOptions,
        cancelButtonIndex,
        title: label || 'Select an option',
        message: helperText,
      },
      (buttonIndex: number) => {
        if (buttonIndex !== cancelButtonIndex && buttonIndex < options.length) {
          const selectedOption = options[buttonIndex];
          if (!selectedOption.disabled) {
            onValueChange?.(selectedOption.value);
          }
        }
      }
    );
  };

  const handleOptionSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onValueChange?.(option.value);
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    Animated.spring(scaleAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start(() => {
      setIsOpen(false);
      setIsPositioned(false);
      setSearchTerm('');
    });
  };

  const handleDropdownLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;

    if (__DEV__) {
      console.log('[Select] 4. Layout measured:', { width, height, current: dropdownSize });
    }

    // Only update if size has changed significantly
    if (Math.abs(width - dropdownSize.width) > 1 || Math.abs(height - dropdownSize.height) > 1) {
      if (__DEV__) {
        console.log('[Select] 5. Setting dimensions (state update)');
      }
      setDropdownSize({ width, height });
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const renderChevron = () => {
    const chevronStyle = selectStyles.chevron;
    return (
      <View style={chevronStyle}>
        <MaterialCommunityIcons
          name="chevron-down"
          size={chevronStyle.width || 20}
          color={chevronStyle.color}
        />
      </View>
    );
  };

  const renderTriggerIcon = (icon: any) => {
    if (!icon) return null;

    // If it's a string, render as MaterialCommunityIcons
    if (typeof icon === 'string') {
      const iconStyle = selectStyles.icon;
      return (
        <View style={iconStyle}>
          <MaterialCommunityIcons
            name={icon}
            size={iconStyle.width || 20}
            color={selectStyles.triggerText.color}
          />
        </View>
      );
    }

    // Otherwise render the React element directly
    return <View style={selectStyles.icon}>{icon}</View>;
  };

  const renderOptionIcon = (icon: any) => {
    if (!icon) return null;

    // If it's a string, render as MaterialCommunityIcons
    if (typeof icon === 'string') {
      const iconStyle = selectStyles.optionIcon;
      return (
        <View style={iconStyle}>
          <MaterialCommunityIcons
            name={icon}
            size={iconStyle.width || 20}
            color={selectStyles.optionText.color}
          />
        </View>
      );
    }

    // Otherwise render the React element directly
    return <View style={selectStyles.optionIcon}>{icon}</View>;
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    // Show dropdown only after it has been measured AND positioned
    const isMeasured = dropdownSize.height > 0;
    const shouldShow = isMeasured && isPositioned;

    if (__DEV__) {
      console.log('[Select] 3. Render popover, isMeasured:', isMeasured, 'isPositioned:', isPositioned);
    }

    return (
      <Modal
        visible={true}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <Pressable
          style={selectStyles.overlay}
          onPress={closeDropdown}
        >
          <BoundedModalContent
            top={dropdownPosition.top}
            left={dropdownPosition.left}
            width={dropdownPosition.width}
            maxHeight={maxHeight}
          >
            <Animated.View
              style={[
                selectStyles.dropdown,
                {
                  position: 'relative', // Override absolute positioning from styles
                  top: 0, // Override top: '100%' from styles
                  left: 0, // Override left from styles
                  right: undefined, // Remove right constraint
                  transform: [{ scale: scaleAnim }],
                  opacity: shouldShow ? 1 : 0, // Hide until measured AND positioned
                }
              ]}
              onLayout={handleDropdownLayout}
            >
            {searchable && (
              <View style={selectStyles.searchContainer}>
                <TextInput
                  style={selectStyles.searchInput}
                  placeholder="Search options..."
                  value={searchTerm}
                  onChangeText={handleSearchChange}
                  autoFocus
                />
              </View>
            )}

            <ScrollView
              style={selectStyles.optionsList}
              showsVerticalScrollIndicator={true}
            >
              {__DEV__ && console.log('[Select] Rendering', filteredOptions.length, 'options')}
              {filteredOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={selectStyles.option}
                    onPress={() => handleOptionSelect(option)}
                    disabled={option.disabled}
                    android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                  >
                    <View style={selectStyles.optionContent}>
                      {renderOptionIcon(option.icon)}
                      <Text
                        style={[
                          selectStyles.optionText,
                          option.disabled && selectStyles.optionTextDisabled,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}

              {filteredOptions.length === 0 && (
                <View style={selectStyles.option}>
                  <Text style={selectStyles.optionText}>
                    No options found
                  </Text>
                </View>
              )}
            </ScrollView>
            </Animated.View>
          </BoundedModalContent>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View ref={ref} style={[selectStyles.container, style]} testID={testID}>
      {label && (
        <Text style={selectStyles.label}>
          {label}
        </Text>
      )}

      <Pressable
        ref={triggerRef}
        style={selectStyles.trigger({ type: variant, intent })}
        onPress={handleTriggerPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="button"
        accessibilityState={{
          expanded: isOpen,
          disabled,
        }}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <View style={selectStyles.triggerContent}>
          {renderTriggerIcon(selectedOption?.icon)}
          <Text
            style={[
              selectedOption ? selectStyles.triggerText : selectStyles.placeholder,
            ]}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>

        {renderChevron()}
      </Pressable>

      {/* Only render dropdown modal if not using iOS ActionSheet */}
      {!(Platform.OS === 'ios' && presentationMode === 'actionSheet') && renderDropdown()}

      {helperText && (
        <Text
          style={[
            selectStyles.helperText,
            error && selectStyles.helperText.variants?.error?.true,
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
});

Select.displayName = 'Select';

export default Select;