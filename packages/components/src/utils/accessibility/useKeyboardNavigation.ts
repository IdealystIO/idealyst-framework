import { useCallback, useRef } from 'react';

/**
 * Options for the useKeyboardNavigation hook.
 */
export interface UseKeyboardNavigationOptions {
  /** Refs to the navigable items */
  itemRefs: React.RefObject<(HTMLElement | null)[]>;
  /** Currently focused item index */
  focusedIndex: number;
  /** Callback to update the focused index */
  setFocusedIndex: (index: number) => void;
  /** Total number of items */
  itemCount: number;
  /** Navigation orientation - determines which arrow keys are used */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** Whether navigation wraps from last to first and vice versa */
  wrap?: boolean;
  /** Callback when an item is selected (Enter/Space pressed) */
  onSelect?: (index: number) => void;
  /** Callback when Escape is pressed */
  onEscape?: () => void;
  /** Function to get the text label of an item for type-ahead search */
  getItemLabel?: (index: number) => string;
  /** Whether navigation is disabled */
  disabled?: boolean;
  /** Whether to auto-select on navigation (like tabs with automatic activation) */
  autoSelect?: boolean;
}

/**
 * Return type for the useKeyboardNavigation hook.
 */
export interface UseKeyboardNavigationReturn {
  /** Keyboard event handler to attach to the container or items */
  handleKeyDown: (event: React.KeyboardEvent) => void;
  /** Programmatically focus an item by index */
  focusItem: (index: number) => void;
  /** Navigate to the next item */
  navigateNext: () => void;
  /** Navigate to the previous item */
  navigatePrevious: () => void;
  /** Navigate to the first item */
  navigateFirst: () => void;
  /** Navigate to the last item */
  navigateLast: () => void;
}

/**
 * Hook for implementing WCAG-compliant keyboard navigation in lists, menus, tabs, etc.
 *
 * Features:
 * - Arrow key navigation (horizontal, vertical, or both)
 * - Home/End for first/last item
 * - Enter/Space for selection
 * - Escape for closing/canceling
 * - Type-ahead search for quick navigation
 * - Optional wrap-around navigation
 * - Auto-select on navigation (for tabs)
 *
 * @example
 * ```tsx
 * const itemRefs = useRef<(HTMLElement | null)[]>([]);
 * const [focusedIndex, setFocusedIndex] = useState(0);
 *
 * const { handleKeyDown, focusItem } = useKeyboardNavigation({
 *   itemRefs,
 *   focusedIndex,
 *   setFocusedIndex,
 *   itemCount: items.length,
 *   orientation: 'vertical',
 *   onSelect: (index) => handleItemSelect(items[index]),
 * });
 *
 * return (
 *   <div role="listbox" onKeyDown={handleKeyDown}>
 *     {items.map((item, i) => (
 *       <div
 *         key={i}
 *         ref={(el) => { itemRefs.current[i] = el; }}
 *         role="option"
 *         tabIndex={i === focusedIndex ? 0 : -1}
 *       >
 *         {item}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useKeyboardNavigation({
  itemRefs,
  focusedIndex,
  setFocusedIndex,
  itemCount,
  orientation = 'vertical',
  wrap = true,
  onSelect,
  onEscape,
  getItemLabel,
  disabled = false,
  autoSelect = false,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  // Buffer for type-ahead search
  const searchBuffer = useRef('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Focus a specific item by index.
   */
  const focusItem = useCallback(
    (index: number) => {
      const items = itemRefs.current;
      if (items && items[index]) {
        items[index]?.focus();
        setFocusedIndex(index);
        if (autoSelect) {
          onSelect?.(index);
        }
      }
    },
    [itemRefs, setFocusedIndex, autoSelect, onSelect]
  );

  /**
   * Navigate to the next item.
   */
  const navigateNext = useCallback(() => {
    if (disabled || itemCount === 0) return;
    const nextIndex = focusedIndex + 1;
    if (nextIndex >= itemCount) {
      if (wrap) focusItem(0);
    } else {
      focusItem(nextIndex);
    }
  }, [disabled, itemCount, focusedIndex, wrap, focusItem]);

  /**
   * Navigate to the previous item.
   */
  const navigatePrevious = useCallback(() => {
    if (disabled || itemCount === 0) return;
    const prevIndex = focusedIndex - 1;
    if (prevIndex < 0) {
      if (wrap) focusItem(itemCount - 1);
    } else {
      focusItem(prevIndex);
    }
  }, [disabled, itemCount, focusedIndex, wrap, focusItem]);

  /**
   * Navigate to the first item.
   */
  const navigateFirst = useCallback(() => {
    if (disabled || itemCount === 0) return;
    focusItem(0);
  }, [disabled, itemCount, focusItem]);

  /**
   * Navigate to the last item.
   */
  const navigateLast = useCallback(() => {
    if (disabled || itemCount === 0) return;
    focusItem(itemCount - 1);
  }, [disabled, itemCount, focusItem]);

  /**
   * Handle type-ahead search - jump to item starting with typed character(s).
   */
  const handleTypeAhead = useCallback(
    (char: string) => {
      if (!getItemLabel || disabled) return;

      // Clear existing timeout
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      // Append character to search buffer
      searchBuffer.current += char.toLowerCase();

      // Find matching item starting from current index + 1
      for (let i = 0; i < itemCount; i++) {
        const index = (focusedIndex + i + 1) % itemCount;
        const label = getItemLabel(index).toLowerCase();
        if (label.startsWith(searchBuffer.current)) {
          focusItem(index);
          break;
        }
      }

      // Clear buffer after 500ms of inactivity (standard type-ahead delay)
      searchTimeout.current = setTimeout(() => {
        searchBuffer.current = '';
      }, 500);
    },
    [getItemLabel, disabled, itemCount, focusedIndex, focusItem]
  );

  /**
   * Main keyboard event handler.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      const { key } = event;

      // Handle arrow keys based on orientation
      if (orientation === 'vertical' || orientation === 'both') {
        if (key === 'ArrowDown') {
          event.preventDefault();
          navigateNext();
          return;
        }
        if (key === 'ArrowUp') {
          event.preventDefault();
          navigatePrevious();
          return;
        }
      }

      if (orientation === 'horizontal' || orientation === 'both') {
        if (key === 'ArrowRight') {
          event.preventDefault();
          navigateNext();
          return;
        }
        if (key === 'ArrowLeft') {
          event.preventDefault();
          navigatePrevious();
          return;
        }
      }

      // Common navigation keys
      switch (key) {
        case 'Home':
          event.preventDefault();
          navigateFirst();
          break;

        case 'End':
          event.preventDefault();
          navigateLast();
          break;

        case 'Enter':
        case ' ':
          // Space should only select if we're not in a text input
          if (key === ' ' && event.target instanceof HTMLInputElement) {
            return; // Let the input handle the space
          }
          event.preventDefault();
          onSelect?.(focusedIndex);
          break;

        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;

        default:
          // Type-ahead for printable characters
          if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
            handleTypeAhead(key);
          }
      }
    },
    [
      disabled,
      orientation,
      navigateNext,
      navigatePrevious,
      navigateFirst,
      navigateLast,
      onSelect,
      onEscape,
      focusedIndex,
      handleTypeAhead,
    ]
  );

  return {
    handleKeyDown,
    focusItem,
    navigateNext,
    navigatePrevious,
    navigateFirst,
    navigateLast,
  };
}
