import FormComponent from './Form.native';
import FormTextInput from './fields/FormTextInput';
import FormTextArea from './fields/FormTextArea';
import FormSelect from './fields/FormSelect';
import FormCheckbox from './fields/FormCheckbox';
import FormRadioGroup from './fields/FormRadioGroup';
import FormSwitch from './fields/FormSwitch';
import FormSlider from './fields/FormSlider';
import FormField from './fields/FormField';

type FormType = typeof FormComponent & {
  TextInput: typeof FormTextInput;
  TextArea: typeof FormTextArea;
  Select: typeof FormSelect;
  Checkbox: typeof FormCheckbox;
  RadioGroup: typeof FormRadioGroup;
  Switch: typeof FormSwitch;
  Slider: typeof FormSlider;
  Field: typeof FormField;
};

const Form = FormComponent as FormType;
Form.TextInput = FormTextInput;
Form.TextArea = FormTextArea;
Form.Select = FormSelect;
Form.Checkbox = FormCheckbox;
Form.RadioGroup = FormRadioGroup;
Form.Switch = FormSwitch;
Form.Slider = FormSlider;
Form.Field = FormField;

export default Form;
export { Form };
export { useForm } from './useForm';
export * from './types';
