import { TouchableOpacityProps } from 'react-native';
import { IntentVariant, ButtonSize } from '../theme';

// Component-specific type aliases for future extensibility
export type ButtonIntentVariant = IntentVariant;
export type ButtonSizeVariant = ButtonSize;
export type ButtonVariant = 'contained' | 'outlined' | 'text';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'disabled'> {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  intent?: ButtonIntentVariant;
  size?: ButtonSizeVariant;
  disabled?: boolean;
  loading?: boolean;
} 