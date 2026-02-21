import React, { forwardRef, useRef, useEffect } from 'react';
import TextInput from '../../TextInput';
import { useFormField } from '../useFormField';
import { useFormContext } from '../FormContext';
import useMergeRefs from '../../hooks/useMergeRefs';
import type { FormTextInputProps } from '../types';
import type { IdealystElement } from '../../utils/refTypes';

const FormTextInput = forwardRef<IdealystElement, FormTextInputProps>(({
  name,
  tabOrder,
  disabled: localDisabled,
  onSubmitEditing: userOnSubmitEditing,
  returnKeyType: userReturnKeyType,
  ...rest
}, ref) => {
  const { form } = useFormContext();
  const field = useFormField(name);
  const inputRef = useRef<any>(null);
  const mergedRef = useMergeRefs(ref, inputRef);

  useEffect(() => {
    form.registerField(name, inputRef, tabOrder);
    return () => form.unregisterField(name);
  }, [name, tabOrder, form]);

  const isLast = form.isLastTextField(name);

  const handleSubmitEditing = () => {
    if (userOnSubmitEditing) {
      userOnSubmitEditing();
    } else if (isLast) {
      form.handleSubmit();
    } else {
      form.focusNextField(name);
    }
  };

  return (
    <TextInput
      ref={mergedRef}
      value={(field.value as string) ?? ''}
      onChangeText={(text) => field.onChange(text)}
      onBlur={field.onBlur}
      error={field.error}
      disabled={field.disabled || localDisabled}
      returnKeyType={userReturnKeyType ?? (isLast ? 'done' : 'next')}
      onSubmitEditing={handleSubmitEditing}
      {...rest}
    />
  );
});

FormTextInput.displayName = 'Form.TextInput';
export default FormTextInput;
