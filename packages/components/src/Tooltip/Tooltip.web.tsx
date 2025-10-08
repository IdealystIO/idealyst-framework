import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tooltipStyles } from './Tooltip.styles';
import type { TooltipProps } from './types';

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  intent = 'neutral',
  size = 'medium',
  style,
  testID,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Apply variants
  tooltipStyles.useVariants({
    size,
    intent,
    placement,
    visible,
  });

  const containerProps = getWebProps([tooltipStyles.container, style]);
  const tooltipProps = getWebProps([tooltipStyles.tooltip]);
  const arrowProps = getWebProps([tooltipStyles.arrow]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      {...containerProps}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={testID}
    >
      {children}

      {visible && (
        <div
          className={tooltipProps.className}
          style={tooltipProps.style}
          role="tooltip"
          data-testid={`${testID}-tooltip`}
        >
          {content}
          <div
            className={arrowProps.className}
            style={arrowProps.style}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
