import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tooltipStyles } from './Tooltip.styles';
import type { TooltipProps } from './types';
import { PositionedPortal } from '../internal/PositionedPortal';

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  intent = 'neutral',
  size = 'md',
  style,
  testID,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Apply variants - PositionedPortal handles positioning and visibility
  tooltipStyles.useVariants({
    size,
    intent,
  });

  const containerProps = getWebProps([tooltipStyles.container, style as any]);
  const tooltipContentProps = getWebProps(tooltipStyles.tooltip);

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
    <>
      <div
        ref={anchorRef}
        {...containerProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid={testID}
      >
        {children}
      </div>

      <PositionedPortal
        open={visible}
        anchor={anchorRef}
        placement={placement}
        offset={8}
        zIndex={1000}
      >
        <div
          {...tooltipContentProps}
          role="tooltip"
          data-testid={`${testID}-tooltip`}
        >
          {content}
        </div>
      </PositionedPortal>
    </>
  );
};

export default Tooltip;
