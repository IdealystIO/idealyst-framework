import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TextInputProps } from '../TextInput/types';
import type { TextAreaProps } from '../TextArea/types';
import type { SelectProps } from '../Select/types';
import type { CheckboxProps } from '../Checkbox/types';
import type { RadioGroupProps } from '../RadioButton/types';
import type { SwitchProps } from '../Switch/types';
import type { SliderProps } from '../Slider/types';

export type FieldValue = string | number | boolean | undefined;
export type FormValues = Record<string, FieldValue>;
export type FormErrors<T extends FormValues = FormValues> = Partial<Record<keyof T, string>>;

export type ValidateFunction<T extends FormValues = FormValues> = (
  values: T
) => FormErrors<T> | undefined | void;

export interface UseFormOptions<T extends FormValues = FormValues> {
  initialValues: T;
  validate?: ValidateFunction<T>;
  validateOn?: 'onBlur' | 'onChange' | 'onSubmit';
  onSubmit: (values: T) => void | Promise<void>;
  disabled?: boolean;
}

export interface UseFormReturn<T extends FormValues = FormValues> {
  values: T;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  submitCount: number;
  disabled: boolean;

  getValue: (name: keyof T) => T[keyof T];
  setValue: (name: keyof T, value: T[keyof T]) => void;
  setTouched: (name: keyof T) => void;
  getError: (name: keyof T) => string | undefined;
  setError: (name: keyof T, error: string | undefined) => void;

  handleSubmit: () => void | Promise<void>;
  reset: (nextValues?: Partial<T>) => void;

  registerField: (name: keyof T, ref: React.RefObject<any>, order?: number) => void;
  unregisterField: (name: keyof T) => void;
  focusNextField: (currentName: keyof T) => void;
  isLastTextField: (name: keyof T) => boolean;
}

export interface FormContextValue<T extends FormValues = FormValues> {
  form: UseFormReturn<T>;
}

export interface FieldRenderProps {
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  onBlur: () => void;
  error: string | undefined;
  touched: boolean;
  dirty: boolean;
  disabled: boolean;
  name: string;
}

export interface FormProps {
  form: UseFormReturn<any>;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  id?: string;
}

// Form field wrapper props - Omit the props that Form wires automatically
export interface FormFieldBaseProps {
  name: string;
}

export interface FormTextInputProps extends FormFieldBaseProps,
  Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'error' | 'hasError'> {
  tabOrder?: number;
}

export interface FormTextAreaProps extends FormFieldBaseProps,
  Omit<TextAreaProps, 'value' | 'onChange' | 'error'> {}

export interface FormSelectProps extends FormFieldBaseProps,
  Omit<SelectProps, 'value' | 'onChange' | 'error'> {}

export interface FormCheckboxProps extends FormFieldBaseProps,
  Omit<CheckboxProps, 'checked' | 'onChange' | 'error'> {}

export interface FormRadioGroupProps extends FormFieldBaseProps,
  Omit<RadioGroupProps, 'value' | 'onValueChange' | 'error'> {}

export interface FormSwitchProps extends FormFieldBaseProps,
  Omit<SwitchProps, 'checked' | 'onChange' | 'error'> {}

export interface FormSliderProps extends FormFieldBaseProps,
  Omit<SliderProps, 'value' | 'onChange' | 'error'> {}

export interface FormFieldProps extends FormFieldBaseProps {
  children: (field: FieldRenderProps) => ReactNode;
}
