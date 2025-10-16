import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { alertStyles } from './Alert.styles';
import type { AlertProps } from './types';

// Default icons for each intent
const defaultIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  neutral: '●',
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

  const displayIcon = icon !== undefined ? icon : (showIcon ? defaultIcons[intent] : null);

  return (
    <div
      className={containerProps.className}
      style={containerProps.style}
      data-testid={testID}
      role="alert"
    >
      {displayIcon && (
        <div className={iconContainerProps.className} style={iconContainerProps.style}>
          {typeof displayIcon === 'string' ? (
            <span style={{ fontSize: 20, lineHeight: '24px' }}>{displayIcon}</span>
          ) : (
            displayIcon
          )}
        </div>
      )}

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
          <span style={{ fontSize: 16 }}>✕</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
