import type { ViewStyle } from 'react-native';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type AccordionVariant = 'default' | 'separated' | 'bordered';
export type AccordionIntentVariant = IntentVariant;
export type AccordionSizeVariant = ButtonSize;

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
  intent?: AccordionIntentVariant;
  size?: AccordionSizeVariant;
  style?: ViewStyle;
  testID?: string;
}
