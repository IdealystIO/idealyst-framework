import React, { useState, useRef, forwardRef } from 'react';
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
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { SelectProps, SelectOption } from './types';
import { selectStyles } from './Select.styles';
import { BoundedModalContent } from '../internal/BoundedModalContent.native';
import { useSmartPosition } from '../hooks/useSmartPosition.native';
import useMergeRefs from '../hooks/useMergeRefs';

const Select = forwardRef<View, SelectProps>(({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  helperText,
  label,
  type = 'outlined',
  intent = 'neutral',
  size = 'md',
  searchable = false,
  filterOption,
  presentationMode = 'dropdown',
  maxHeight = 240,
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  accessibilityLabel,
  id,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const {
    position: dropdownPosition,
    size: dropdownSize,
    isPositioned,
    anchorRef: triggerRef,
    measureAndPosition,
    handleLayout: handleDropdownLayout,
    reset: resetPosition,
  } = useSmartPosition({
    placement: 'bottom-start',
    offset: 4,
    maxHeight,
    matchWidth: true,
  });

  const mergedTriggerRef = useMergeRefs(ref, triggerRef);
  const selectedOption = options.find(option => option.value === value);

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
    type,
    size,
    disabled,
    error,
    focused: isOpen,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Get dynamic styles - call as functions for theme reactivity
  const containerStyle = (selectStyles.container as any)({});
  const labelStyle = (selectStyles.label as any)({});
  const triggerStyle = (selectStyles.trigger as any)({ type, intent, disabled, error, focused: isOpen });
  const triggerContentStyle = (selectStyles.triggerContent as any)({});
  const triggerTextStyle = (selectStyles.triggerText as any)({});
  const placeholderStyle = (selectStyles.placeholder as any)({});
  const iconStyle = (selectStyles.icon as any)({});
  const chevronStyle = (selectStyles.chevron as any)({});
  const dropdownStyle = (selectStyles.dropdown as any)({});
  const searchContainerStyle = (selectStyles.searchContainer as any)({});
  const searchInputStyle = (selectStyles.searchInput as any)({});
  const optionsListStyle = (selectStyles.optionsList as any)({});
  const optionStyle = (selectStyles.option as any)({});
  const optionContentStyle = (selectStyles.optionContent as any)({});
  const optionIconStyle = (selectStyles.optionIcon as any)({});
  const optionTextStyle = (selectStyles.optionText as any)({});
  const optionTextDisabledStyle = (selectStyles.optionTextDisabled as any)({});
  const helperTextStyle = (selectStyles.helperText as any)({ error });
  const overlayStyle = (selectStyles.overlay as any)({});

  const handleTriggerPress = () => {
    if (disabled) return;

    if (Platform.OS === 'ios' && presentationMode === 'actionSheet') {
      showIOSActionSheet();
    } else {
      // Measure and position dropdown
      measureAndPosition();

      // Open the modal (it will be invisible with opacity 0 until positioned)
      setIsOpen(true);
      setSearchTerm('');

      // Animate dropdown appearance
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }).start();
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
      resetPosition();
      setSearchTerm('');
    });
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const renderChevron = () => {
    return (
      <View style={chevronStyle}>
        <MaterialDesignIcons
          name="chevron-down"
          style={chevronStyle}
        />
      </View>
    );
  };

  const renderTriggerIcon = (icon: any) => {
    if (!icon) return null;

    // If it's a string, render as MaterialCommunityIcons
    if (typeof icon === 'string') {
      return (
        <View style={iconStyle}>
          <MaterialDesignIcons
            style={iconStyle}
            name={icon}
          />
        </View>
      );
    }

    // Otherwise render the React element directly
    return <View style={iconStyle}>{icon}</View>;
  };

  const renderOptionIcon = (icon: any) => {
    if (!icon) return null;

    // If it's a string, render as MaterialCommunityIcons
    if (typeof icon === 'string') {
      return (
        <View style={optionIconStyle}>
          <MaterialDesignIcons
            style={optionIconStyle}
            name={icon}
          />
        </View>
      );
    }

    // Otherwise render the React element directly
    return <View style={optionIconStyle}>{icon}</View>;
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    // Show dropdown only after it has been measured AND positioned
    const isMeasured = dropdownSize.height > 0;
    const shouldShow = isMeasured && isPositioned;

    return (
      <Modal
        visible={true}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <Pressable
          style={overlayStyle}
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
                dropdownStyle,
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
              <View style={searchContainerStyle}>
                <TextInput
                  style={searchInputStyle}
                  placeholder="Search options..."
                  value={searchTerm}
                  onChangeText={handleSearchChange}
                  autoFocus
                />
              </View>
            )}

            <ScrollView
              style={optionsListStyle}
              showsVerticalScrollIndicator={true}
            >
              {filteredOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={optionStyle}
                    onPress={() => handleOptionSelect(option)}
                    disabled={option.disabled}
                    android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                  >
                    <View style={optionContentStyle}>
                      {renderOptionIcon(option.icon)}
                      <Text
                        style={[
                          optionTextStyle,
                          option.disabled && optionTextDisabledStyle,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}

              {filteredOptions.length === 0 && (
                <View style={optionStyle}>
                  <Text style={optionTextStyle}>
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
    <View ref={ref} nativeID={id} style={[containerStyle, style]} testID={testID}>
      {label && (
        <Text style={labelStyle}>
          {label}
        </Text>
      )}

      <Pressable
        ref={mergedTriggerRef}
        style={triggerStyle}
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
        <View style={triggerContentStyle}>
          {renderTriggerIcon(selectedOption?.icon)}
          <Text
            style={[
              selectedOption ? triggerTextStyle : placeholderStyle,
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
        <Text style={helperTextStyle}>
          {helperText}
        </Text>
      )}
    </View>
  );
});

Select.displayName = 'Select';

export default Select;