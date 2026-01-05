import { Size } from '@idealyst/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import { AccessibilityProps } from '../utils/accessibility';

// Component-specific type aliases for future extensibility
export type TabBarSizeVariant = Size;
export type TabBarType = 'standard' | 'pills' | 'underline';
export type TabBarPillMode = 'light' | 'dark';
export type TabBarIconPosition = 'left' | 'top';
/** Layout justification for tabs */
export type TabBarJustify = 'start' | 'center' | 'equal' | 'space-between';

export interface TabBarItem {
  value: string;
  label: string;
  /** Icon to display - can be a React node or a render function receiving active state */
  icon?: ReactNode | ((props: { active: boolean; size: number }) => ReactNode);
  disabled?: boolean;
}

export interface TabBarProps extends ContainerStyleProps, AccessibilityProps {
  items: TabBarItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  type?: TabBarType;
  size?: TabBarSizeVariant;
  /** Mode for pills variant: 'light' for light backgrounds (dark pill), 'dark' for dark backgrounds (light pill) */
  pillMode?: TabBarPillMode;
  /** Position of icon relative to label: 'left' (horizontal) or 'top' (stacked) */
  iconPosition?: TabBarIconPosition;
  /** Layout justification: 'start' (left), 'center', 'equal' (full width equal tabs), 'space-between' */
  justify?: TabBarJustify;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
