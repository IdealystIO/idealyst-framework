import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type TabsIntentVariant = IntentVariant;
export type TabsSizeVariant = ButtonSize;
export type TabsVariant = 'default' | 'pills' | 'underline';

export interface TabProps {
  value: string;
  label: string;
  disabled?: boolean;
  children?: ReactNode;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSizeVariant;
  intent?: TabsIntentVariant;
  style?: ViewStyle;
  testID?: string;
  children: ReactNode;
}
