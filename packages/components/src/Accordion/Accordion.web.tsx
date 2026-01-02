import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { accordionStyles } from './Accordion.styles';
import type { AccordionProps, AccordionItem as AccordionItemType } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath } from '../Icon/icon-resolver';

interface AccordionItemProps {
  item: AccordionItemType;
  type: AccordionProps['type'];
  isExpanded: boolean;
  onToggle: () => void;
  size: AccordionProps['size'];
  testID?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isExpanded,
  onToggle,
  type,
  size,
  testID,
}) => {
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const chevronIconPath = resolveIconPath('chevron-down');

  accordionStyles.useVariants({
    size,
    type,
    expanded: isExpanded,
    disabled: Boolean(item.disabled),
  });

  const itemProps = getWebProps([accordionStyles.item]);
  const headerProps = getWebProps([accordionStyles.header]);
  const titleProps = getWebProps([accordionStyles.title]);
  const iconProps = getWebProps([accordionStyles.icon]);
  const contentProps = getWebProps([
    accordionStyles.content,
    {
      height: isExpanded ? contentHeight : 0,
      overflow: 'hidden' as const,
    }
  ]);
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
        onClick={onToggle}
        disabled={item.disabled}
        aria-expanded={isExpanded}
        aria-disabled={item.disabled}
      >
        <span {...titleProps}>
          {item.title}
        </span>
        <span {...iconProps}>
          <IconSvg
            style={{ width: 12, height: 12 }}
            path={chevronIconPath}
            aria-label="chevron-down"
          />
        </span>
      </button>

      <div
        {...contentProps}
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
  type = 'standard',
  size = 'md',
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  // Apply variants
  accordionStyles.useVariants({
    type,
    size,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  const containerProps = getWebProps([accordionStyles.container, style as any]);

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
          type={type}
          isExpanded={expandedItems.includes(item.id)}
          onToggle={() => toggleItem(item.id, item.disabled)}
          size={size}
          testID={`${testID}-item-${item.id}`}
        />
      ))}
    </div>
  );
};

export default Accordion;
