import React, { useState, useRef } from 'react';
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
import { SelectProps, SelectOption } from './types';
import { selectStyles } from './Select.styles';

const Select: React.FC<SelectProps> = ({
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
  size = 'medium',
  searchable = false,
  filterOption,
  presentationMode = 'dropdown',
  maxHeight = 240,
  style,
  testID,
  accessibilityLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

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
    variant: variant as any,
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
      (buttonIndex) => {
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

  const renderChevron = () => (
    <View style={selectStyles.chevron}>
      <Text style={{ color: 'currentColor' }}>▼</Text>
    </View>
  );

  const renderDropdown = () => (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={closeDropdown}
    >
      <Pressable style={selectStyles.overlay} onPress={closeDropdown}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View
            style={[
              selectStyles.dropdown,
              {
                maxHeight,
                transform: [{ scale: scaleAnim }],
                minWidth: 280,
                maxWidth: '90%',
              },
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

            <ScrollView style={selectStyles.optionsList} showsVerticalScrollIndicator={false}>
              {filteredOptions.map((option) => {
                const isSelected = option.value === value;

                selectStyles.useVariants({
                  selected: isSelected,
                  disabled: option.disabled,
                });

                return (
                  <Pressable
                    key={option.value}
                    style={selectStyles.option}
                    onPress={() => handleOptionSelect(option)}
                    disabled={option.disabled}
                    android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                  >
                    <View style={selectStyles.optionContent}>
                      {option.icon && (
                        <View style={selectStyles.optionIcon}>
                          {option.icon}
                        </View>
                      )}
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
                );
              })}

              {filteredOptions.length === 0 && (
                <View style={selectStyles.option}>
                  <Text style={selectStyles.optionText}>
                    No options found
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={[selectStyles.container, style]} testID={testID}>
      {label && (
        <Text style={selectStyles.label}>
          {label}
        </Text>
      )}

      <Pressable
        style={selectStyles.trigger}
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
          {selectedOption?.icon && (
            <View style={selectStyles.icon}>
              {selectedOption.icon}
            </View>
          )}
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
};

export default Select;