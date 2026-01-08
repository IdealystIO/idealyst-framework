import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CheckboxProps } from './types';
import { checkboxStyles } from './Checkbox.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebSelectionAriaProps, generateAccessibilityId, combineIds } from '../utils/accessibility';

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
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  required = false,
  error,
  helperText,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
  accessibilityLabelledBy,
  accessibilityDescribedBy,
  accessibilityControls,
  accessibilityExpanded,
  accessibilityPressed,
  accessibilityOwns,
  accessibilityHasPopup,
  accessibilityChecked,
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

  // Generate unique IDs for accessibility
  const checkboxId = useMemo(() => id || generateAccessibilityId('checkbox'), [id]);
  const errorId = useMemo(() => `${checkboxId}-error`, [checkboxId]);
  const helperId = useMemo(() => `${checkboxId}-helper`, [checkboxId]);

  // Generate ARIA props for the input element
  const ariaProps = useMemo(() => {
    const labelContent = children || label;
    const computedLabel = accessibilityLabel ?? (typeof labelContent === 'string' ? labelContent : undefined);
    const computedChecked = accessibilityChecked ?? (indeterminate ? 'mixed' : internalChecked);
    const describedByIds = combineIds(
      accessibilityDescribedBy,
      error ? errorId : helperText ? helperId : undefined
    );

    return getWebSelectionAriaProps({
      accessibilityLabel: computedLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'checkbox',
      accessibilityLabelledBy,
      accessibilityDescribedBy: describedByIds,
      accessibilityControls,
      accessibilityExpanded,
      accessibilityPressed,
      accessibilityOwns,
      accessibilityHasPopup,
      accessibilityChecked: computedChecked,
    });
  }, [
    accessibilityLabel,
    children,
    label,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    error,
    errorId,
    helperText,
    helperId,
    accessibilityControls,
    accessibilityExpanded,
    accessibilityPressed,
    accessibilityOwns,
    accessibilityHasPopup,
    accessibilityChecked,
    indeterminate,
    internalChecked,
  ]);

  // Apply variants
  checkboxStyles.useVariants({
    size,
    type: variant as any,
    checked: internalChecked,
    disabled,
    visible: internalChecked || indeterminate,
    error: Boolean(error),
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Create style arrays - call as functions with required props for theme reactivity
  const wrapperStyleArray = [(checkboxStyles.wrapper as any)({}), style as any];
  const containerStyleArray = [(checkboxStyles.container as any)({})];
  const checkboxStyleArray = [(checkboxStyles.checkbox as any)({ intent, checked: internalChecked, disabled, type: variant })];
  const labelStyleArray = [(checkboxStyles.label as any)({ disabled })];
  const helperTextStyleArray = [(checkboxStyles.helperText as any)({ error: !!error })];
  const checkmarkStyleArray = [(checkboxStyles.checkmark as any)({ checked: internalChecked })];

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
    <div {...wrapperProps} ref={mergedRef} id={id}>
      <label {...containerProps}>
        <div style={{ position: 'relative' }}>
          <input
            type="checkbox"
            id={checkboxId}
            checked={internalChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            data-testid={testID}
            {...ariaProps}
            aria-required={required}
            aria-invalid={Boolean(error)}
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
        <div
          {...helperTextProps}
          id={error ? errorId : helperId}
          role={error ? 'alert' : undefined}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 