import type { ViewStyle } from 'react-native';

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
  variant?: 'default' | 'separated' | 'bordered';
  intent?: 'primary' | 'neutral' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  testID?: string;
}
