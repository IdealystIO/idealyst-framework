import type { StyleProp, ViewStyle } from 'react-native';

export type ChipSize = 'small' | 'medium' | 'large';
export type ChipVariant = 'filled' | 'outlined' | 'soft';
export type ChipIntent = 'primary' | 'neutral' | 'success' | 'error' | 'warning';

export interface ChipProps {
  /** The text content of the chip */
  label: string;

  /** Visual style variant */
  variant?: ChipVariant;

  /** Color intent/semantic meaning */
  intent?: ChipIntent;

  /** Size of the chip */
  size?: ChipSize;

  /** Icon to display before the label. Can be an icon name (string) or a custom React element */
  icon?: string | React.ReactNode;

  /** Whether the chip can be deleted */
  deletable?: boolean;

  /** Callback when delete button is pressed */
  onDelete?: () => void;

  /** Whether the chip is selectable */
  selectable?: boolean;

  /** Whether the chip is selected (when selectable) */
  selected?: boolean;

  /** Callback when chip is pressed */
  onPress?: () => void;

  /** Whether the chip is disabled */
  disabled?: boolean;

  /** Custom style */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;
}
