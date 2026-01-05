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

export interface AccordionProps extends ContainerStyleProps, AccessibilityProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  type?: AccordionType;
  size?: AccordionSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
