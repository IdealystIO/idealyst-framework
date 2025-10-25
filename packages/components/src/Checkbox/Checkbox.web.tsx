import React, { useState, useEffect, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CheckboxProps } from './types';
import { checkboxStyles } from './Checkbox.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(({
  checked = false,
  indeterminate = false,
  disabled = false,
  onCheckedChange,
  size = 'md',
  intent = 'primary',
  variant = 'default',
  label,
  children,
  style,
  testID,
  accessibilityLabel,
  required = false,
  error,
  helperText,
}, ref) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newChecked = event.target.checked;
    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  // Apply variants
  checkboxStyles.useVariants({
    size,
    type: variant as any,
    checked: internalChecked,
    disabled,
    visible: internalChecked || indeterminate,
    error: Boolean(error),
  });

  // Create style arrays
  const wrapperStyleArray = [checkboxStyles.wrapper, style as any];
  const containerStyleArray = [checkboxStyles.container];
  const checkboxStyleArray = [checkboxStyles.checkbox({ intent })];
  const labelStyleArray = [checkboxStyles.label];
  const helperTextStyleArray = [checkboxStyles.helperText];
  const checkmarkStyleArray = [checkboxStyles.checkmark];

  // Generate web props
  const wrapperProps = getWebProps(wrapperStyleArray);
  const containerProps = getWebProps(containerStyleArray);
  const checkboxProps = getWebProps(checkboxStyleArray);
  const labelProps = getWebProps(labelStyleArray);
  const helperTextProps = getWebProps(helperTextStyleArray);
  const checkmarkProps = getWebProps(checkmarkStyleArray);

  const labelContent = children || label;
  const displayHelperText = error || helperText;

  const mergedRef = useMergeRefs(ref, wrapperProps.ref);

  return (
    <div {...wrapperProps} ref={mergedRef}>
      <label {...containerProps}>
        <div style={{ position: 'relative' }}>
          <input
            type="checkbox"
            checked={internalChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            data-testid={testID}
            aria-label={accessibilityLabel}
            ref={(ref) => {
              if (ref) {
                ref.indeterminate = indeterminate;
              }
            }}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
          <div {...checkboxProps}>
            {(internalChecked || indeterminate) && (
              <IconSvg
                path={resolveIconPath(indeterminate ? 'minus' : 'check')}
                {...checkmarkProps}
                aria-label={indeterminate ? 'minus' : 'check'}
              />
            )}
          </div>
        </div>
        {labelContent && (
          <span {...labelProps}>
            {labelContent}
          </span>
        )}
      </label>
      {displayHelperText && (
        <div {...helperTextProps}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 