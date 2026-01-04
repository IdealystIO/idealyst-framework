import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../Icon/icon-types';
import { Intent, Size } from '@idealyst/theme';
import { BaseProps } from '../utils/viewStyleProps';

export type ChipSize = Size;
export type ChipType = 'filled' | 'outlined' | 'soft';
export type ChipIntent = Intent;

export interface ChipProps extends BaseProps {
  /** The text content of the chip */
  label: string;

  /** Visual style variant */
  type?: ChipType;

  /** Color intent/semantic meaning */
  intent?: ChipIntent;

  /** Size of the chip */
  size?: ChipSize;

  /** Icon to display before the label. Can be an icon name (string) or a custom React element */
  icon?: IconName | React.ReactNode;

  /** Whether the chip can be deleted */
  deletable?: boolean;

  /** Callback when delete button is pressed */
  onDelete?: () => void;

  /** Icon to display in the delete button. Defaults to 'close' */
  deleteIcon?: IconName | React.ReactNode;

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
