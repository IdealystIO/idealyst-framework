import { isValidElement, forwardRef, ElementType, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { alertStyles } from './Alert.styles';
import type { AlertProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

// Default icons for each intent
const defaultIcons: Record<string, React.ComponentType<any>> = {
  primary: (props: any) => <IconSvg {...props} name="information" aria-label="information" />,
  success: (props: any) => <IconSvg {...props} name="check-circle" aria-label="check-circle" />,
  error: (props: any) => <IconSvg {...props} name="alert-circle" aria-label="alert-circle" />,
  warning: (props: any) => <IconSvg {...props} name="alert" aria-label="alert" />,
  info: (props: any) => <IconSvg {...props} name="information" aria-label="information" />,
  neutral: (props: any) => <IconSvg {...props} name="record-circle" aria-label="record-circle" />,
};

/**
 * Notification banner for displaying important messages, warnings, or status updates.
 * Supports multiple intents, dismissibility, and custom actions.
 */
const Alert = forwardRef<IdealystElement, AlertProps>(({
  title,
  message,
  children,
  intent = 'neutral',
  type = 'soft',
  size = 'md',
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  actions,
  style,
  testID,
  id,
}, ref) => {
  // Apply variants for size, intent, and type
  alertStyles.useVariants({ size, intent, type });

  // Compute dynamic styles with intent, type, and size
  const dynamicProps = { intent, type, size };
  const containerProps = getWebProps([(alertStyles.container as any)(dynamicProps), flattenStyle(style)]);
  const iconContainerProps = getWebProps([(alertStyles.iconContainer as any)(dynamicProps)]);
  const contentProps = getWebProps([(alertStyles.content as any)(dynamicProps)]);
  const titleProps = getWebProps([(alertStyles.title as any)(dynamicProps)]);
  const messageProps = getWebProps([(alertStyles.message as any)(dynamicProps)]);
  const actionsProps = getWebProps([(alertStyles.actions as any)(dynamicProps)]);
  const closeButtonProps = getWebProps([(alertStyles.closeButton as any)(dynamicProps)]);
  const closeIconProps = getWebProps([(alertStyles.closeIcon as any)(dynamicProps)]);

  const Icon = useMemo(() => {
    if (!showIcon) return null;
    if (!icon) {
      const Element = defaultIcons[intent];
      if (Element) {
        return <Element {...iconContainerProps} />;
      }
      return null
    }  else if (typeof icon === 'string') {
      return <IconSvg
          name={icon}
          {...iconContainerProps}
          aria-label={icon}
        />
    } else if (isValidElement(icon)) {
      return icon;
    }
    return null;
  }, [icon, showIcon, intent]);

  const mergedRef = useMergeRefs(ref, containerProps.ref);

  return (
    <div
      {...containerProps}
      ref={mergedRef}
      id={id}
      data-testid={testID}
      role="alert"
    >
      {Icon}

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
