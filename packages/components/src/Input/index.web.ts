/**
 * @ignore
 * @deprecated Use TextInput instead. Input is maintained for backwards compatibility only.
 */
import InputComponent from './Input.web';

// Re-export deprecated Input component
export default InputComponent;
export { InputComponent as Input };

// Re-export types from TextInput for backwards compatibility
export * from '../TextInput/types';
