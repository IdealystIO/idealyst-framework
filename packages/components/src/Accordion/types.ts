import { Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import { AccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type AccordionType = 'standard' | 'separated' | 'bordered';
export type AccordionSizeVariant = Size;

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

/**
 * Expandable content panels for organizing information in collapsible sections.
 * Supports single or multiple expanded items simultaneously.
 */
export interface AccordionProps extends ContainerStyleProps, AccessibilityProps {
  /**
   * Array of accordion items to display
   */
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  type?: AccordionType;
  size?: AccordionSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
