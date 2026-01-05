import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { accordionStyles } from './Accordion.styles';
import type { AccordionProps, AccordionItem as AccordionItemType } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath } from '../Icon/icon-resolver';
import { getWebAriaProps, generateAccessibilityId, ACCORDION_KEYS } from '../utils/accessibility';

interface AccordionItemProps {
  item: AccordionItemType;
  type: AccordionProps['type'];
  isExpanded: boolean;
  onToggle: () => void;
  size: AccordionProps['size'];
  isLast: boolean;
  testID?: string;
  headerId: string;
  panelId: string;
  onKeyDown: (e: React.KeyboardEvent, itemId: string) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isExpanded,
  onToggle,
  type,
  size,
  isLast,
  testID,
  headerId,
  panelId,
  onKeyDown,
}) => {
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const chevronIconPath = resolveIconPath('chevron-down');

  // Apply item-specific variants (for size, expanded, disabled)
  accordionStyles.useVariants({
    size,
    expanded: isExpanded,
    disabled: Boolean(item.disabled),
  });

  // Get dynamic item style with type and isLast props
  const itemStyle = (accordionStyles.item as any)({ type, isLast });
  const itemProps = getWebProps([itemStyle]);
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
        id={headerId}
        onClick={onToggle}
        onKeyDown={(e) => onKeyDown(e, item.id)}
        disabled={item.disabled}
        aria-expanded={isExpanded}
        aria-controls={panelId}
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
        id={panelId}
        role="region"
        aria-labelledby={headerId}
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
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);
  const headerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Generate unique ID for the accordion
  const accordionId = useMemo(() => id || generateAccessibilityId('accordion'), [id]);

  // Generate header and panel IDs for each item
  const getHeaderId = useCallback((itemId: string) => `${accordionId}-header-${itemId}`, [accordionId]);
  const getPanelId = useCallback((itemId: string) => `${accordionId}-panel-${itemId}`, [accordionId]);

  // Get enabled items for keyboard navigation
  const enabledItems = useMemo(() => items.filter(item => !item.disabled), [items]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, itemId: string) => {
    const key = e.key;
    const currentIndex = enabledItems.findIndex(item => item.id === itemId);
    let nextIndex = -1;

    if (ACCORDION_KEYS.next.includes(key)) {
      e.preventDefault();
      nextIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0;
    } else if (ACCORDION_KEYS.prev.includes(key)) {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1;
    } else if (ACCORDION_KEYS.first.includes(key)) {
      e.preventDefault();
      nextIndex = 0;
    } else if (ACCORDION_KEYS.last.includes(key)) {
      e.preventDefault();
      nextIndex = enabledItems.length - 1;
    }

    if (nextIndex >= 0) {
      const nextItem = enabledItems[nextIndex];
      const headerButton = headerRefs.current.get(nextItem.id);
      headerButton?.focus();
    }
  }, [enabledItems]);

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'group',
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole]);

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
    <div {...containerProps} {...ariaProps} id={accordionId} data-testid={testID}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          type={type}
          isExpanded={expandedItems.includes(item.id)}
          onToggle={() => toggleItem(item.id, item.disabled)}
          size={size}
          isLast={index === items.length - 1}
          testID={`${testID}-item-${item.id}`}
          headerId={getHeaderId(item.id)}
          panelId={getPanelId(item.id)}
          onKeyDown={handleKeyDown}
        />
      ))}
    </div>
  );
};

export default Accordion;
