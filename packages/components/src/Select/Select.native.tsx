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
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [dropdownSize, setDropdownSize] = useState({ width: 200, height: 240 });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const triggerRef = useRef<any>(null);
  const anchorMeasurements = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const insets = useSafeAreaInsets();

  const selectedOption = options.find(option => option.value === value);

  // Helper function to calculate dropdown position
  const calculateDropdownPosition = (x: number, y: number, width: number, height: number) => {
    // For flip detection, use maxHeight so it properly detects when there's not enough space
    // But if we have a measured size that's SMALLER than maxHeight, use that for final positioning
    // to avoid unnecessary gaps (this happens when content naturally fits)
    const heightForPositioning = dropdownSize.height > 0 && dropdownSize.height < maxHeight
      ? dropdownSize.height
      : maxHeight;

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

    setDropdownPosition({
      top: position.top,
      left: position.left,
      width: position.width || width,
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
        // Store anchor measurements for potential recalculation
        anchorMeasurements.current = { x, y, width, height };

        // Calculate initial position
        calculateDropdownPosition(x, y, width, height);
        setIsOpen(true);
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
      setSearchTerm('');
    });
  };

  const handleDropdownLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    // Only update if size has changed significantly
    if (Math.abs(width - dropdownSize.width) > 1 || Math.abs(height - dropdownSize.height) > 1) {
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
    if (!dropdownPosition) return null;

    return (
      <Modal
        visible={isOpen}
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
            onLayout={handleDropdownLayout}
          >
            <Animated.View
              style={[
                selectStyles.dropdown,
                {
                  transform: [{ scale: scaleAnim }],
                }
              ]}
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