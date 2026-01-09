import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { alertStyles } from './Alert.styles';
import type { AlertProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
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
  id,
}, ref) => {
  // Compute dynamic styles with intent and type
  const dynamicProps = { intent, type };
  const containerProps = getWebProps([(alertStyles.container as any)(dynamicProps), style as any]);
  const iconContainerProps = getWebProps([(alertStyles.iconContainer as any)(dynamicProps)]);
  const contentProps = getWebProps([alertStyles.content]);
  const titleProps = getWebProps([(alertStyles.title as any)(dynamicProps)]);
  const messageProps = getWebProps([(alertStyles.message as any)(dynamicProps)]);
  const actionsProps = getWebProps([alertStyles.actions]);
  const closeButtonProps = getWebProps([alertStyles.closeButton]);
  const closeIconProps = getWebProps([alertStyles.closeIcon]);

  const displayIcon = icon !== undefined ? icon : (showIcon ? defaultIcons[intent] : null);

  // Helper to render icon
  const renderIcon = (iconProp: typeof displayIcon) => {
    if (!iconProp) return null;

    if (isIconName(iconProp)) {
      return (
        <IconSvg
          name={iconProp}
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
      id={id}
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
            name="close"
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
