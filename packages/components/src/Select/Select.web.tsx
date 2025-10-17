import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore - web-specific import
import { getWebProps } from 'react-native-unistyles/web';
import { SelectProps, SelectOption } from './types';
import { selectStyles } from './Select.styles';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath } from '../Icon/icon-resolver';
import { PositionedPortal } from '../internal/PositionedPortal';

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


  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) return;

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
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          const option = filteredOptions[focusedIndex];
          if (!option.disabled) {
            handleOptionSelect(option);
          }
        }
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, filteredOptions]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      // Delay to ensure dropdown is positioned
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
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
      onValueChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
      triggerRef.current?.focus();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(0);
  };

  const containerWebProps = getWebProps([
    selectStyles.container,
    style
  ]);

  const triggerWebProps = getWebProps([
    selectStyles.trigger,
    isOpen && selectStyles.triggerOpen
  ]);

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div {...containerWebProps} data-testid={testID}>
      {label && (
        <label {...getWebProps([selectStyles.label])}>
          {label}
        </label>
      )}

      <div ref={triggerRef}>
        <button
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

          <IconSvg
            path={resolveIconPath('chevron-down')}
            {...getWebProps([
              selectStyles.chevron,
              isOpen && selectStyles.chevronOpen
            ])}
            aria-label="chevron-down"
          />
        </button>
      </div>
      <PositionedPortal
        open={isOpen}
        anchor={triggerRef}
        placement="bottom-start"
        offset={4}
        onClickOutside={handleClose}
        onEscapeKey={handleClose}
        matchWidth={false}
        zIndex={1000}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
            maxHeight: maxHeight,
            overflow: 'auto',
          }}
          role="listbox"
        >
            {searchable && (
              <div
                style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1976d2';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
                  }}
                />
              </div>
            )}

            <div style={{ padding: '8px 0' }}>
              {filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setFocusedIndex(index)}
                    style={{
                      padding: '6px 16px',
                      cursor: option.disabled ? 'default' : 'pointer',
                      backgroundColor: isFocused
                        ? 'rgba(0, 0, 0, 0.04)'
                        : isSelected
                          ? 'rgba(25, 118, 210, 0.08)'
                          : 'transparent',
                      color: option.disabled
                        ? 'rgba(0, 0, 0, 0.38)'
                        : 'rgba(0, 0, 0, 0.87)',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {option.icon && (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {option.icon}
                      </span>
                    )}
                    <span>{option.label}</span>
                  </div>
                );
              })}

              {filteredOptions.length === 0 && (
                <div
                  style={{
                    padding: '6px 16px',
                    color: 'rgba(0, 0, 0, 0.54)',
                    fontSize: '14px',
                  }}
                >
                  No options found
                </div>
              )}
            </div>
        </div>
      </PositionedPortal>

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