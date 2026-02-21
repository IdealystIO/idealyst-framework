import { useReducer, useRef, useCallback, useMemo } from 'react';
import type { UseFormOptions, UseFormReturn, FormValues, FormErrors } from './types';

// Action types for the reducer
type FormAction<T extends FormValues> =
  | { type: 'SET_VALUE'; name: keyof T; value: T[keyof T] }
  | { type: 'SET_VALUES'; values: Partial<T> }
  | { type: 'SET_TOUCHED'; name: keyof T }
  | { type: 'SET_ERROR'; name: keyof T; error: string | undefined }
  | { type: 'SET_ERRORS'; errors: FormErrors<T> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'INCREMENT_SUBMIT_COUNT' }
  | { type: 'RESET'; values: T };

// Form state shape
interface FormState<T extends FormValues> {
  values: T;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  submitCount: number;
}

// Reducer function
function formReducer<T extends FormValues>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value,
        },
      };
    case 'SET_VALUES':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.values,
        },
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.name]: true,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.name]: action.error,
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'INCREMENT_SUBMIT_COUNT':
      return {
        ...state,
        submitCount: state.submitCount + 1,
      };
    case 'RESET':
      return {
        values: action.values,
        errors: {},
        touched: {},
        isSubmitting: false,
        submitCount: 0,
      };
    default:
      return state;
  }
}

// Field registration info
interface FieldRegistration {
  ref: React.RefObject<any>;
  order: number;
}

export function useForm<T extends FormValues = FormValues>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, validate, validateOn = 'onBlur', onSubmit, disabled = false } = options;

  // Store initial values in a ref for dirty detection and reset
  const initialValuesRef = useRef<T>(initialValues);

  // Auto-incrementing order counter for field registration
  const orderCounterRef = useRef<number>(0);

  // Field registration map
  const fieldsRef = useRef<Map<keyof T, FieldRegistration>>(new Map());

  // Initialize reducer with initial state
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    submitCount: 0,
  });

  // Validate a single field
  const validateField = useCallback((name: keyof T): string | undefined => {
    if (!validate) return undefined;
    const result = validate(state.values);
    if (!result) return undefined;
    return result[name];
  }, [validate, state.values]);

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    if (!validate) return true;
    const errors = validate(state.values);
    if (errors && Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return false;
    }
    dispatch({ type: 'SET_ERRORS', errors: {} });
    return true;
  }, [validate, state.values]);

  // Get a single value
  const getValue = useCallback((name: keyof T): T[keyof T] => {
    return state.values[name];
  }, [state.values]);

  // Set a single value
  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    dispatch({ type: 'SET_VALUE', name, value });

    // Validate on change if configured
    if (validateOn === 'onChange' && validate) {
      const result = validate({ ...state.values, [name]: value } as T);
      const error = result ? result[name] : undefined;
      dispatch({ type: 'SET_ERROR', name, error });
    }
  }, [validateOn, validate, state.values]);

  // Set touched state for a field
  const setTouched = useCallback((name: keyof T) => {
    dispatch({ type: 'SET_TOUCHED', name });

    // Validate on blur if configured
    if (validateOn === 'onBlur' && validate) {
      const result = validate(state.values);
      const error = result ? result[name] : undefined;
      dispatch({ type: 'SET_ERROR', name, error });
    }
  }, [validateOn, validate, state.values]);

  // Get error for a field
  const getError = useCallback((name: keyof T): string | undefined => {
    return state.errors[name];
  }, [state.errors]);

  // Set error for a field
  const setError = useCallback((name: keyof T, error: string | undefined) => {
    dispatch({ type: 'SET_ERROR', name, error });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'INCREMENT_SUBMIT_COUNT' });

    const isValid = validateAll();
    if (!isValid) return;

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

    try {
      await onSubmit(state.values);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [validateAll, onSubmit, state.values]);

  // Reset the form
  const reset = useCallback((nextValues?: Partial<T>) => {
    const resetValues = {
      ...initialValuesRef.current,
      ...nextValues,
    } as T;
    dispatch({ type: 'RESET', values: resetValues });
  }, []);

  // Register a field for keyboard flow
  const registerField = useCallback((name: keyof T, ref: React.RefObject<any>, order?: number) => {
    const fieldOrder = order ?? orderCounterRef.current++;
    fieldsRef.current.set(name, { ref, order: fieldOrder });
  }, []);

  // Unregister a field
  const unregisterField = useCallback((name: keyof T) => {
    fieldsRef.current.delete(name);
  }, []);

  // Focus the next field in order
  const focusNextField = useCallback((currentName: keyof T) => {
    const fields = Array.from(fieldsRef.current.entries())
      .sort((a, b) => a[1].order - b[1].order);

    const currentIndex = fields.findIndex(([name]) => name === currentName);
    if (currentIndex === -1 || currentIndex === fields.length - 1) return;

    const nextField = fields[currentIndex + 1];
    if (nextField && nextField[1].ref.current?.focus) {
      nextField[1].ref.current.focus();
    }
  }, []);

  // Check if this is the last text field
  const isLastTextField = useCallback((name: keyof T): boolean => {
    const fields = Array.from(fieldsRef.current.entries())
      .sort((a, b) => a[1].order - b[1].order);

    if (fields.length === 0) return true;

    const lastField = fields[fields.length - 1];
    return lastField[0] === name;
  }, []);

  // Compute isDirty by comparing current values to initial values
  const isDirty = useMemo(() => {
    const initial = initialValuesRef.current;
    for (const key in state.values) {
      if (state.values[key] !== initial[key]) {
        return true;
      }
    }
    return false;
  }, [state.values]);

  // Compute isValid by checking if there are any errors
  const isValid = useMemo(() => {
    return Object.keys(state.errors).length === 0;
  }, [state.errors]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isDirty,
    isValid,
    submitCount: state.submitCount,
    disabled,

    getValue,
    setValue,
    setTouched,
    getError,
    setError,

    handleSubmit,
    reset,

    registerField,
    unregisterField,
    focusNextField,
    isLastTextField,
  };
}
