import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput } from '@idealyst/components';
import { DateInputProps } from './types';
import { dateInputStyles } from './DateInput.styles';

interface DateInputBaseProps extends DateInputProps {
  renderInput: (props: {
    value: string;
    onChangeText: (text: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    placeholder?: string;
    editable: boolean;
    style?: any;
    testID?: string;
  }) => React.ReactNode;
}

// Common date formats for parsing
const DEFAULT_INPUT_FORMATS = [
  'MM/dd/yyyy',
  'M/d/yyyy', 
  'MM/dd/yy',
  'M/d/yy',
  'yyyy-MM-dd',
  'MM-dd-yyyy',
  'M-d-yyyy',
  'dd/MM/yyyy',
  'd/M/yyyy',
  'dd-MM-yyyy',
  'd-M-yyyy',
  'yyyy/MM/dd',
  'MMM dd, yyyy',
  'MMM d, yyyy',
  'MMMM dd, yyyy',
  'MMMM d, yyyy',
];

const DEFAULT_DISPLAY_FORMAT = 'MMMM d, yyyy';

export const DateInputBase: React.FC<DateInputBaseProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Enter date...',
  displayFormat = DEFAULT_DISPLAY_FORMAT,
  inputFormats = DEFAULT_INPUT_FORMATS,
  locale = 'en-US',
  style,
  testID,
  onFocus,
  onBlur,
  renderInput,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<any>(null);

  // Format date for display when not focused
  const formatDateForDisplay = useCallback((date: Date) => {
    try {
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
      });
    }
  }, [locale]);

  // Parse date from various input formats
  const parseDate = useCallback((dateString: string): Date | null => {
    if (!dateString.trim()) return null;

    // Try direct Date parsing first
    const directParse = new Date(dateString);
    if (!isNaN(directParse.getTime())) {
      return directParse;
    }

    // Try common formats
    const trimmed = dateString.trim();
    
    // Handle MM/dd/yyyy and variations
    const slashFormats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,
    ];
    
    for (const format of slashFormats) {
      const match = trimmed.match(format);
      if (match) {
        const [, month, day, year] = match;
        const fullYear = year.length === 2 ? 2000 + parseInt(year) : parseInt(year);
        const date = new Date(fullYear, parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) return date;
      }
    }

    // Handle dd/MM/yyyy variations (European format)
    const europeanMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (europeanMatch) {
      const [, day, month, year] = europeanMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) return date;
    }

    // Handle yyyy-MM-dd (ISO format)
    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) return date;
    }

    // Handle dash formats
    const dashFormats = [
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    ];
    
    for (const format of dashFormats) {
      const match = trimmed.match(format);
      if (match) {
        const [, first, second, third] = match;
        let date: Date;
        
        if (third.length === 4) {
          // MM-dd-yyyy or dd-MM-yyyy
          date = new Date(parseInt(third), parseInt(first) - 1, parseInt(second));
        } else {
          // yyyy-MM-dd
          date = new Date(parseInt(first), parseInt(second) - 1, parseInt(third));
        }
        
        if (!isNaN(date.getTime())) return date;
      }
    }

    return null;
  }, []);

  // Validate date against constraints
  const validateDate = useCallback((date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  }, [minDate, maxDate]);

  // Update input value when value prop changes
  useEffect(() => {
    if (isFocused) {
      // When focused, keep the raw input value
      return;
    }
    
    if (value) {
      setInputValue(formatDateForDisplay(value));
      setHasError(false);
    } else {
      setInputValue('');
      setHasError(false);
    }
  }, [value, isFocused, formatDateForDisplay]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // Switch to raw input format when focused
    if (value) {
      // Show in a common input format for editing
      const editFormat = value.toLocaleDateString('en-US');
      setInputValue(editFormat);
    }
    onFocus?.();
  }, [value, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    
    if (inputValue.trim()) {
      const parsedDate = parseDate(inputValue);
      
      if (parsedDate && validateDate(parsedDate)) {
        onChange(parsedDate);
        setHasError(false);
      } else {
        setHasError(true);
        // Revert to previous valid value
        if (value) {
          setInputValue(formatDateForDisplay(value));
        } else {
          setInputValue('');
        }
      }
    } else {
      onChange(null);
      setHasError(false);
    }
    
    onBlur?.();
  }, [inputValue, parseDate, validateDate, onChange, value, formatDateForDisplay, onBlur]);

  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
    setHasError(false);
  }, []);

  return (
    <View style={[dateInputStyles.container, style]} testID={testID}>
      {renderInput({
        value: inputValue,
        onChangeText: handleChangeText,
        onFocus: handleFocus,
        onBlur: handleBlur,
        placeholder,
        editable: !disabled,
        style: [
          dateInputStyles.input,
          hasError && dateInputStyles.inputError,
        ],
        testID: testID ? `${testID}-input` : undefined,
      })}
    </View>
  );
};