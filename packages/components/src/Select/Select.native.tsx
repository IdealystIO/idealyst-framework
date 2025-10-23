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
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const triggerRef = useRef<any>(null);

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
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        setDropdownPosition({
          top: y + height + 4, // 4px offset below trigger
          left: x,
          width: width,
        });
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
          <Animated.View
            style={[
              selectStyles.dropdown,
              {
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: maxHeight,
                transform: [{ scale: scaleAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
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