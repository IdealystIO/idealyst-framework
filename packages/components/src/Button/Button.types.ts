import { TouchableOpacityProps } from 'react-native';
import { IntentNames } from '../theme';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'disabled'> {
  title: string;
  onPress: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  intent?: IntentNames;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
} 