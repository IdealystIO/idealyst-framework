import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [isPositioned, setIsPositioned] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log when trigger ref is set
  const setTriggerRef = (el: HTMLButtonElement | null) => {
    console.log('Setting trigger ref to:', el);
    triggerRef.current = el;
  };

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

  // Position dropdown when it opens
  useEffect(() => {
    if (!isOpen) return;

    let retryCount = 0;
    const maxRetries = 10;

    const positionDropdown = () => {
      if (!triggerRef.current || !dropdownRef.current) {
        console.log(`[Attempt ${retryCount + 1}/${maxRetries}] Refs not ready:`, {
          trigger: !!triggerRef.current,
          dropdown: !!dropdownRef.current
        });

        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(positionDropdown, 10);
        }
        return;
      }

      const trigger = triggerRef.current;
      const dropdown = dropdownRef.current;
      const triggerRect = trigger.getBoundingClientRect();

      console.log('Trigger button found at:', {
        top: triggerRect.top,
        left: triggerRect.left,
        bottom: triggerRect.bottom,
        right: triggerRect.right,
        width: triggerRect.width,
        height: triggerRect.height
      });

      console.log('Dropdown initial position:', {
        currentTop: dropdown.style.top,
        currentLeft: dropdown.style.left,
        offsetHeight: dropdown.offsetHeight,
        offsetWidth: dropdown.offsetWidth
      });

      // Calculate and set position
      const top = triggerRect.bottom + 4;
      const left = triggerRect.left;
      const width = triggerRect.width;

      dropdown.style.position = 'fixed';
      dropdown.style.top = `${top}px`;
      dropdown.style.left = `${left}px`;
      dropdown.style.width = `${width}px`;
      dropdown.style.maxHeight = `${maxHeight}px`;

      console.log('Dropdown NEW position set to:', {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        actualTop: dropdown.style.top,
        actualLeft: dropdown.style.left,
        actualWidth: dropdown.style.width
      });

      // Verify position was applied
      const dropdownRect = dropdown.getBoundingClientRect();
      console.log('Dropdown actual position after setting:', {
        top: dropdownRect.top,
        left: dropdownRect.left,
        width: dropdownRect.width,
        height: dropdownRect.height
      });

      // Mark as positioned so it becomes visible
      setIsPositioned(true);
    };

    // Start positioning attempts
    positionDropdown();

    // Reposition on scroll/resize
    const handleReposition = () => {
      retryCount = 0;
      positionDropdown();
    };

    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen, maxHeight]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both trigger and dropdown
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    // Use capture phase for better event handling
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
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
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            const option = filteredOptions[focusedIndex];
            if (!option.disabled) {
              handleOptionSelect(option);
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
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
      setIsPositioned(false);
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

  // MUI-style dropdown portal
  const renderDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: '0px', // Explicit initial position
          left: '0px', // Explicit initial position
          opacity: isPositioned ? 1 : 0,
          zIndex: 1300, // MUI's z-index for select
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
          overflow: 'auto',
          minWidth: '200px', // Ensure minimum width
          visibility: 'visible', // Ensure it's visible
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
      </div>,
      document.body
    );
  };

  return (
    <div {...containerWebProps} data-testid={testID}>
      {label && (
        <label {...getWebProps([selectStyles.label])}>
          {label}
        </label>
      )}

      <button
        ref={setTriggerRef}
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

      {renderDropdown()}

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