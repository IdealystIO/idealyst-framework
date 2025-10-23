import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import {
  alertContainerStyles,
  alertIconStyles,
  alertContentStyles,
  alertTitleStyles,
  alertMessageStyles,
  alertActionsStyles,
  alertCloseButtonStyles,
} from './Alert.styles';
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
  variant = 'soft',
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  actions,
  style,
  testID,
}, ref) => {
  // Apply variants to stylesheets that don't use dynamic styles
  alertContentStyles.useVariants({});
  alertActionsStyles.useVariants({});
  alertCloseButtonStyles.useVariants({});

  const containerProps = getWebProps([alertContainerStyles.container({ type: variant, intent }), style]);
  const iconContainerProps = getWebProps([alertIconStyles.iconContainer({ type: variant, intent })]);
  const contentProps = getWebProps([alertContentStyles.content]);
  const titleProps = getWebProps([alertTitleStyles.title({ type: variant, intent })]);
  const messageProps = getWebProps([alertMessageStyles.message({ type: variant, intent })]);
  const actionsProps = getWebProps([alertActionsStyles.actions]);
  const closeButtonProps = getWebProps([alertCloseButtonStyles.closeButton]);
  const closeIconProps = getWebProps([alertCloseButtonStyles.closeIcon]);

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
      className={containerProps.className}
      ref={mergedRef}
      style={containerProps.style}
      data-testid={testID}
      role="alert"
    >
      {displayIcon && renderIcon(displayIcon)}

      <div className={contentProps.className} style={contentProps.style}>
        {title && (
          <div className={titleProps.className} style={titleProps.style}>
            {title}
          </div>
        )}

        {message && (
          <div className={messageProps.className} style={messageProps.style}>
            {message}
          </div>
        )}

        {children}

        {actions && (
          <div className={actionsProps.className} style={actionsProps.style}>
            {actions}
          </div>
        )}
      </div>

      {dismissible && onDismiss && (
        <button
          className={closeButtonProps.className}
          style={closeButtonProps.style}
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
