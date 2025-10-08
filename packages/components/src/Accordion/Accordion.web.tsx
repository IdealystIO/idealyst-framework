import React, { useState } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { accordionStyles } from './Accordion.styles';
import type { AccordionProps } from './types';

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  variant = 'default',
  intent = 'primary',
  size = 'medium',
  style,
  testID,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  // Apply variants
  accordionStyles.useVariants({
    variant,
    intent,
    size,
  });

  const containerProps = getWebProps([accordionStyles.container, style]);

  const toggleItem = (itemId: string, disabled?: boolean) => {
    if (disabled) return;

    setExpandedItems((prev) => {
      const isExpanded = prev.includes(itemId);

      if (allowMultiple) {
        return isExpanded
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId];
      } else {
        return isExpanded ? [] : [itemId];
      }
    });
  };

  const ChevronIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.427 5.927l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 5.5H4.604a.25.25 0 00-.177.427z" />
    </svg>
  );

  return (
    <div {...containerProps} data-testid={testID}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.id);
        const isLast = index === items.length - 1;

        // Apply item-specific variants
        const itemStylesheet = accordionStyles;
        itemStylesheet.useVariants({
          variant,
          isLast,
          size,
          expanded: isExpanded,
          disabled: Boolean(item.disabled),
          intent,
        });

        const itemProps = getWebProps([accordionStyles.item]);
        const headerProps = getWebProps([accordionStyles.header]);
        const titleProps = getWebProps([accordionStyles.title]);
        const iconProps = getWebProps([accordionStyles.icon]);
        const contentProps = getWebProps([accordionStyles.content]);
        const contentInnerProps = getWebProps([accordionStyles.contentInner]);

        return (
          <div
            key={item.id}
            className={itemProps.className}
            style={itemProps.style}
            data-testid={`${testID}-item-${item.id}`}
          >
            <button
              className={headerProps.className}
              style={headerProps.style}
              onClick={() => toggleItem(item.id, item.disabled)}
              disabled={item.disabled}
              aria-expanded={isExpanded}
              aria-disabled={item.disabled}
            >
              <span className={titleProps.className}>
                {item.title}
              </span>
              <span className={iconProps.className} style={iconProps.style}>
                <ChevronIcon />
              </span>
            </button>

            <div
              className={contentProps.className}
              style={contentProps.style}
              aria-hidden={!isExpanded}
            >
              <div
                className={contentInnerProps.className}
                style={contentInnerProps.style}
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
