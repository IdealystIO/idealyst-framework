import { Intent, Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FormInputStyleProps } from '../utils/viewStyleProps';
import { FormAccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type TextAreaIntentVariant = Intent;
export type TextAreaSizeVariant = Size;
export type TextAreaResizeVariant = 'none' | 'vertical' | 'horizontal' | 'both';
export type TextAreaType = 'outlined' | 'filled' | 'bare';

/**
 * Keyboard event data with modifier key states.
 * Provides a cross-platform API for handling key presses with modifiers.
 */
export interface KeyboardEventData {
  /** The key that was pressed (e.g., 'Enter', 'a', 'Escape') */
  key: string;
  /** Whether the Ctrl key (or Cmd on Mac) was held */
  ctrlKey: boolean;
  /** Whether the Shift key was held */
  shiftKey: boolean;
  /** Whether the Alt key (Option on Mac) was held */
  altKey: boolean;
  /** Whether the Meta key (Cmd on Mac, Win on Windows) was held */
  metaKey: boolean;
  /** Prevents the default browser behavior (web only, no-op on native) */
  preventDefault: () => void;
}

export interface TextAreaProps extends FormInputStyleProps, FormAccessibilityProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * Called when a key is pressed while the textarea is focused.
   * Includes modifier key states (ctrl, shift, alt, meta).
   * Web only - no-op on native.
   */
  onKeyDown?: (event: KeyboardEventData) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  minHeight?: number;
  maxHeight?: number;
  autoGrow?: boolean;
  maxLength?: number;
  label?: string;
  error?: string;
  helperText?: string;
  resize?: TextAreaResizeVariant;
  showCharacterCount?: boolean;
  intent?: TextAreaIntentVariant;
  size?: TextAreaSizeVariant;
  /**
   * Visual style type of the textarea
   * @default 'outlined'
   */
  type?: TextAreaType;
  style?: StyleProp<ViewStyle>;
  textareaStyle?: StyleProp<TextStyle>;
  testID?: string;
}
