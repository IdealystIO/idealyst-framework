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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
      <View style={selectStyles.chevron}>
        <MaterialCommunityIcons
          name="chevron-down"
          style={selectStyles.chevron}
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
            style={iconStyle}
            name={icon}
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
            style={iconStyle}
            name={icon}
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
        ref={mergedTriggerRef}
        style={selectStyles.trigger({ type, intent })}
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