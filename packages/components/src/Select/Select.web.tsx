import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore - web-specific import
import { getWebProps } from 'react-native-unistyles/web';
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
  maxHeight = 240,
  style,
  testID,
  accessibilityLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Apply styles with variants
  selectStyles.useVariants({
    variant: variant as any,
    size,
    intent,
    disabled,
    error,
    focused: isOpen,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
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
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleOptionSelect(filteredOptions[focusedIndex]);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, focusedIndex, filteredOptions]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, searchable]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  };

  const handleOptionSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onValueChange?.(option.value);
      setIsOpen(false);
      setSearchTerm('');
      triggerRef.current?.focus();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setFocusedIndex(-1);
  };

  // Generate web props
  const containerWebProps = getWebProps([selectStyles.container, style]);
  const triggerWebProps = getWebProps([selectStyles.trigger]);
  const dropdownWebProps = getWebProps([
    selectStyles.dropdown,
    { maxHeight }
  ]);

  return (
    <div {...containerWebProps} data-testid={testID}>
      {label && (
        <label {...getWebProps([selectStyles.label])}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        {...triggerWebProps}
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-label={accessibilityLabel || label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <div {...getWebProps([selectStyles.triggerContent])}>
          {selectedOption?.icon && (
            <span {...getWebProps([selectStyles.icon])}>
              {selectedOption.icon}
            </span>
          )}
          <span
            {...getWebProps([
              selectedOption ? selectStyles.triggerText : selectStyles.placeholder
            ])}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <svg
          {...getWebProps([
            selectStyles.chevron,
            isOpen && selectStyles.chevronOpen
          ])}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4.427 9.573l3.396-3.396a.25.25 0 01.354 0l3.396 3.396a.25.25 0 01-.177.427H4.604a.25.25 0 01-.177-.427z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div {...getWebProps([selectStyles.overlay])} />
          <div ref={dropdownRef} {...dropdownWebProps} role="listbox">
            {searchable && (
              <div {...getWebProps([selectStyles.searchContainer])}>
                <input
                  ref={searchInputRef}
                  {...getWebProps([selectStyles.searchInput])}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            )}

            <div {...getWebProps([selectStyles.optionsList])}>
              {filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                selectStyles.useVariants({
                  selected: isSelected,
                  disabled: option.disabled,
                });

                return (
                  <div
                    key={option.value}
                    {...getWebProps([
                      selectStyles.option,
                      isFocused && { backgroundColor: '#f3f4f6' }
                    ])}
                    onClick={() => handleOptionSelect(option)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <div {...getWebProps([selectStyles.optionContent])}>
                      {option.icon && (
                        <span {...getWebProps([selectStyles.optionIcon])}>
                          {option.icon}
                        </span>
                      )}
                      <span
                        {...getWebProps([
                          selectStyles.optionText,
                          option.disabled && selectStyles.optionTextDisabled
                        ])}
                      >
                        {option.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredOptions.length === 0 && (
                <div {...getWebProps([selectStyles.option])}>
                  <span {...getWebProps([selectStyles.optionText])}>
                    No options found
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {helperText && (
        <div
          {...getWebProps([
            selectStyles.helperText,
            { error }
          ])}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Select;