import React, { forwardRef, useEffect, useRef, useState } from 'react';
// @ts-ignore - web-specific import
import { getWebProps } from 'react-native-unistyles/web';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';
import { PositionedPortal } from '../internal/PositionedPortal';
import { selectStyles } from './Select.styles';
import { SelectOption, SelectProps } from './types';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Dropdown selection component with search, keyboard navigation, and custom option rendering.
 * Supports single selection with filterable options list.
 */
const Select = forwardRef<IdealystElement, SelectProps>(({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  helperText,
  label,
  type = 'outlined',
  intent = 'neutral',
  size = 'md',
  searchable = false,
  filterOption,
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
  // Derive hasError boolean from error prop
  const hasError = Boolean(error);
  // Get error message if error is a string
  const errorMessage = typeof error === 'string' ? error : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Get the index of the currently selected option
  const getSelectedIndex = () => {
    if (!value) return 0;
    const index = filteredOptions.findIndex(option => option.value === value);
    return index >= 0 ? index : 0;
  };

  // Apply styles with variants
  selectStyles.useVariants({
    type,
    size,
    disabled,
    hasError,
    focused: isOpen,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Handle keyboard navigation on the trigger button
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Handle opening with arrow keys when closed
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(getSelectedIndex());
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Tab':
        if (event.shiftKey) {
          // Shift+Tab: go to previous option or exit
          if (focusedIndex <= 0) {
            setIsOpen(false);
          } else {
            event.preventDefault();
            setFocusedIndex(prev => prev - 1);
          }
        } else {
          // Tab: go to next option or exit
          if (focusedIndex >= filteredOptions.length - 1) {
            setIsOpen(false);
          } else {
            event.preventDefault();
            setFocusedIndex(prev => prev < 0 ? 0 : prev + 1);
          }
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          const option = filteredOptions[focusedIndex];
          if (!option.disabled) {
            handleOptionSelect(option);
          }
        }
        break;
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          const option = filteredOptions[focusedIndex];
          if (!option.disabled) {
            handleOptionSelect(option);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTriggerFocus = () => {
    if (!disabled && !isOpen) {
      setIsOpen(true);
      setSearchTerm('');
      // Focus on selected option, or first option if none selected
      setFocusedIndex(getSelectedIndex());
    }
  };

  const handleOptionSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm('');
      triggerRef.current?.focus();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(0);
  };

  // Get dynamic styles - call as functions for theme reactivity
  const containerStyle = (selectStyles.container as any)({});
  const labelStyle = (selectStyles.label as any)({});
  const triggerStyle = (selectStyles.trigger as any)({ type, intent, disabled, hasError, focused: isOpen });
  const triggerContentStyle = (selectStyles.triggerContent as any)({});
  const triggerTextStyle = (selectStyles.triggerText as any)({});
  const placeholderStyle = (selectStyles.placeholder as any)({});
  const iconStyle = (selectStyles.icon as any)({});
  const chevronStyle = (selectStyles.chevron as any)({});
  const chevronOpenStyle = (selectStyles.chevronOpen as any)({});
  const dropdownStyle = (selectStyles.dropdown as any)({});
  const searchContainerStyle = (selectStyles.searchContainer as any)({});
  const searchInputStyle = (selectStyles.searchInput as any)({});
  const optionsListStyle = (selectStyles.optionsList as any)({});
  const optionStyle = (selectStyles.option as any)({});
  const optionFocusedStyle = (selectStyles.optionFocused as any)({});
  const optionDisabledStyle = (selectStyles.optionDisabled as any)({});
  const optionContentStyle = (selectStyles.optionContent as any)({});
  const optionIconStyle = (selectStyles.optionIcon as any)({});
  const optionTextStyle = (selectStyles.optionText as any)({});
  const optionTextDisabledStyle = (selectStyles.optionTextDisabled as any)({});
  const helperTextStyle = (selectStyles.helperText as any)({ hasError });

  const containerWebProps = getWebProps([containerStyle, style as any]);
  const triggerWebProps = getWebProps([triggerStyle]);

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const mergedRef = useMergeRefs(ref, containerWebProps.ref);

  return (
    <div {...containerWebProps} ref={mergedRef} id={id} data-testid={testID}>
      {label && (
        <label {...getWebProps([labelStyle])}>
          {label}
        </label>
      )}

      <div ref={triggerRef}>
        <button
          {...triggerWebProps}
          onClick={handleTriggerClick}
          onFocus={handleTriggerFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label={accessibilityLabel || label}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          type="button"
        >
          <div {...getWebProps([triggerContentStyle])}>
            {selectedOption?.icon && (
              <span {...getWebProps([iconStyle])}>
                {selectedOption.icon}
              </span>
            )}
            <span
              {...getWebProps([
                selectedOption ? triggerTextStyle : placeholderStyle
              ])}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <IconSvg
            name="chevron-down"
            {...getWebProps([
              chevronStyle,
              isOpen && chevronOpenStyle
            ])}
            aria-label="chevron-down"
          />
        </button>
      </div>
      <PositionedPortal
        open={isOpen}
        anchor={triggerRef as React.RefObject<HTMLElement>}
        placement="bottom-start"
        offset={4}
        onClickOutside={handleClose}
        onEscapeKey={handleClose}
        matchWidth={false}
        zIndex={1000}
      >
        <div
          {...getWebProps([dropdownStyle])}
          style={{
            maxHeight: maxHeight,
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
          }}
          role="listbox"
        >
            {searchable && (
              <div {...getWebProps([searchContainerStyle])}>
                <input
                  {...getWebProps([searchInputStyle])}
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            )}

            <div {...getWebProps([optionsListStyle])}>
              {filteredOptions.map((option, index) => {
                const isFocused = index === focusedIndex;

                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    role="option"
                    aria-selected={option.value === value}
                    onMouseEnter={() => setFocusedIndex(index)}
                    {...getWebProps([
                      optionStyle,
                      isFocused && optionFocusedStyle,
                      option.disabled && optionDisabledStyle,
                    ])}
                  >
                    <div {...getWebProps([optionContentStyle])}>
                      {option.icon && (
                        <span {...getWebProps([optionIconStyle])}>
                          {option.icon}
                        </span>
                      )}
                      <span {...getWebProps([
                        optionTextStyle,
                        option.disabled && optionTextDisabledStyle
                      ])}>
                        {option.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredOptions.length === 0 && (
                <div {...getWebProps([optionStyle])} style={{ cursor: 'default' }}>
                  <span {...getWebProps([optionTextStyle])}>
                    No options found
                  </span>
                </div>
              )}
            </div>
        </div>
      </PositionedPortal>

      {(errorMessage || helperText) && (
        <div {...getWebProps([helperTextStyle])} role={errorMessage ? 'alert' : undefined}>
          {errorMessage || helperText}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
