import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { alertStyles } from './Alert.styles';
import type { AlertProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';

// Default icons for each intent
const defaultIcons = {
  primary: 'information',
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert',
  info: 'information',
  neutral: 'record-circle',
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  title,
  message,
  children,
  intent = 'neutral',
  type = 'soft',
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  actions,
  style,
  testID,
}, ref) => {
  // Apply variants to stylesheet
  alertStyles.useVariants({
    type,
    intent,
  });

  const containerProps = getWebProps([alertStyles.container, style as any]);
  const iconContainerProps = getWebProps([alertStyles.iconContainer]);
  const contentProps = getWebProps([alertStyles.content]);
  const titleProps = getWebProps([alertStyles.title]);
  const messageProps = getWebProps([alertStyles.message]);
  const actionsProps = getWebProps([alertStyles.actions]);
  const closeButtonProps = getWebProps([alertStyles.closeButton]);
  const closeIconProps = getWebProps([alertStyles.closeIcon]);

  const displayIcon = icon !== undefined ? icon : (showIcon ? defaultIcons[intent] : null);

  // Helper to render icon
  const renderIcon = (iconProp: typeof displayIcon) => {
    if (!iconProp) return null;

    if (isIconName(iconProp)) {
      const iconPath = resolveIconPath(iconProp);
      return (
        <IconSvg
          path={iconPath}
          {...iconContainerProps}
          aria-label={iconProp}
        />
      );
    } else if (isValidElement(iconProp)) {
      return iconProp;
    }

    return null;
  };

  const mergedRef = useMergeRefs(ref, containerProps.ref);

  return (
    <div
      {...containerProps}
      ref={mergedRef}
      data-testid={testID}
      role="alert"
    >
      {displayIcon && renderIcon(displayIcon)}

      <div {...contentProps}>
        {title && (
          <div {...titleProps}>
            {title}
          </div>
        )}

        {message && (
          <div {...messageProps}>
            {message}
          </div>
        )}

        {children}

        {actions && (
          <div {...actionsProps}>
            {actions}
          </div>
        )}
      </div>

      {dismissible && onDismiss && (
        <button
          {...closeButtonProps}
          onClick={onDismiss}
          aria-label="Dismiss alert"
          type="button"
        >
          <IconSvg
            path={resolveIconPath('close')}
            {...closeIconProps}
            aria-label="close"
          />
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

export default Alert;
