import { Size } from '@idealyst/theme';
import type { StyleProp, ViewStyle } from 'react-native';

// Component-specific type aliases for future extensibility
export type AccordionVariant = 'default' | 'separated' | 'bordered';
export type AccordionSizeVariant = Size;

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  variant?: AccordionVariant;
  size?: AccordionSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
