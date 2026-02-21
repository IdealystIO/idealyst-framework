import React, { forwardRef, useCallback } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { formStyles } from './Form.styles';
import { FormContext } from './FormContext';
import useMergeRefs from '../hooks/useMergeRefs';
import type { FormProps } from './types';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Form component for managing form state and validation.
 * Wraps children in a context provider and renders a semantic <form> element on web.
 */
const Form = forwardRef<IdealystElement, FormProps>(({
  form,
  children,
  style,
  testID,
  id,
}, ref) => {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  }, [form]);

  const containerProps = getWebProps([
    formStyles.container,
    style as any,
  ]);

  const mergedRef = useMergeRefs(ref, containerProps.ref);

  return (
    <FormContext.Provider value={{ form }}>
      <form
        {...containerProps}
        ref={mergedRef}
        onSubmit={handleSubmit}
        noValidate
        id={id}
        data-testid={testID}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

Form.displayName = 'Form';

export default Form;
