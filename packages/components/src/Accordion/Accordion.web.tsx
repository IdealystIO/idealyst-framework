import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { accordionStyles } from './Accordion.styles';
import type { AccordionProps, AccordionItem as AccordionItemType } from './types';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath } from '../Icon/icon-resolver';

interface AccordionItemProps {
  item: AccordionItemType;
  isExpanded: boolean;
  onToggle: () => void;
  size: 'small' | 'medium' | 'large';
  testID?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isExpanded,
  onToggle,
  size,
  testID,
}) => {
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const chevronIconPath = resolveIconPath('chevron-down');

  accordionStyles.useVariants({
    size,
  });

  // Note: Variants are applied globally in parent Accordion component
  // We use inline styles for per-item dynamic values (expanded, disabled)
  const itemProps = getWebProps([accordionStyles.item]);
  const headerProps = getWebProps([accordionStyles.header]);
  const titleProps = getWebProps([accordionStyles.title]);
  const iconProps = getWebProps([accordionStyles.icon]);
  const contentProps = getWebProps([accordionStyles.content]);
  const contentInnerProps = getWebProps([accordionStyles.contentInner]);

  useEffect(() => {
    if (isExpanded) {
      setContentHeight(contentInnerRef.current.getBoundingClientRect().height);
    } else {
      setContentHeight(0);
    }
  }, [isExpanded]);

  return (
    <div
      {...itemProps}
      data-testid={testID}
    >
      <button
        {...headerProps}
        style={{
          ...headerProps.style,
          fontWeight: isExpanded ? 600 : 500,
          opacity: item.disabled ? 0.5 : 1,
          cursor: item.disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={onToggle}
        disabled={item.disabled}
        aria-expanded={isExpanded}
        aria-disabled={item.disabled}
      >
        <span {...titleProps}>
          {item.title}
        </span>
        <span
          {...iconProps}
          style={{
            ...iconProps.style,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconSvg
            style={{ width: 12, height: 12 }}
            path={chevronIconPath}
            aria-label="chevron-down"
          />
        </span>
      </button>

      <div
        {...contentProps}
        style={{
          ...contentProps.style,
          height: isExpanded ? contentHeight : 0,
          overflow: 'hidden',
        }}
        aria-hidden={!isExpanded}
      >
        <div ref={contentInnerRef}>
          <div {...contentInnerProps}>
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  variant = 'default',
  intent = 'primary',
  size = 'md',
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

  return (
    <div {...containerProps} data-testid={testID}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isExpanded={expandedItems.includes(item.id)}
          onToggle={() => toggleItem(item.id, item.disabled)}
          size={size}
          intent={intent}
          testID={`${testID}-item-${item.id}`}
        />
      ))}
    </div>
  );
};

export default Accordion;
