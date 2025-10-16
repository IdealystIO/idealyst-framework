import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { alertStyles } from './Alert.styles';
import type { AlertProps } from './types';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';

// Default icons for each intent
const defaultIcons = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert',
  info: 'information',
  neutral: 'record-circle',
};

const Alert: React.FC<AlertProps> = ({
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
}) => {
  alertStyles.useVariants({
    variant,
    intent,
  });

  const containerProps = getWebProps([alertStyles.container, style]);
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

  return (
    <div
      className={containerProps.className}
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
};

export default Alert;
