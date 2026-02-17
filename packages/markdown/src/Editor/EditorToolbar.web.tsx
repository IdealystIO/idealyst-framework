import { memo, useState, useEffect, useMemo, useRef } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import Icon from '@mdi/react';
import {
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatUnderline,
  mdiFormatStrikethrough,
  mdiCodeTags,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiFormatHeaderPound,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatListChecks,
  mdiFormatQuoteClose,
  mdiCodeBlockBraces,
  mdiMinus,
  mdiLink,
  mdiImage,
  mdiUndo,
  mdiRedo,
  mdiMenuDown,
} from '@mdi/js';
import type { ToolbarItem } from './types';
import type { Size, Intent, Theme } from '@idealyst/theme';
import type { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
  items: readonly ToolbarItem[];
  disabledItems?: readonly ToolbarItem[];
  onAction: (action: string) => void;
  isActive: (action: string) => boolean;
  size: Size;
  linkIntent: Intent;
}

const TOOLBAR_ICONS: Record<string, string> = {
  bold: mdiFormatBold,
  italic: mdiFormatItalic,
  underline: mdiFormatUnderline,
  strikethrough: mdiFormatStrikethrough,
  code: mdiCodeTags,
  heading: mdiFormatHeaderPound,
  heading1: mdiFormatHeader1,
  heading2: mdiFormatHeader2,
  heading3: mdiFormatHeader3,
  heading4: mdiFormatHeader4,
  heading5: mdiFormatHeader5,
  heading6: mdiFormatHeader6,
  bulletList: mdiFormatListBulleted,
  orderedList: mdiFormatListNumbered,
  taskList: mdiFormatListChecks,
  blockquote: mdiFormatQuoteClose,
  codeBlock: mdiCodeBlockBraces,
  horizontalRule: mdiMinus,
  link: mdiLink,
  image: mdiImage,
  undo: mdiUndo,
  redo: mdiRedo,
};

const TOOLBAR_TITLES: Record<string, string> = {
  bold: 'Bold (Ctrl+B)',
  italic: 'Italic (Ctrl+I)',
  underline: 'Underline (Ctrl+U)',
  strikethrough: 'Strikethrough',
  code: 'Inline Code',
  heading: 'Heading',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  heading4: 'Heading 4',
  heading5: 'Heading 5',
  heading6: 'Heading 6',
  bulletList: 'Bullet List',
  orderedList: 'Numbered List',
  taskList: 'Task List',
  blockquote: 'Blockquote',
  codeBlock: 'Code Block',
  horizontalRule: 'Horizontal Rule',
  link: 'Insert Link',
  image: 'Insert Image',
  undo: 'Undo (Ctrl+Z)',
  redo: 'Redo (Ctrl+Y)',
};

const HEADING_ITEMS = ['heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6'] as const;

export const EditorToolbar = memo<EditorToolbarProps>(
  ({ editor, items, disabledItems = [], onAction, isActive, size, linkIntent }) => {
    // Force re-render when editor state changes
    const [, setUpdateCounter] = useState(0);

    // Access theme directly
    const theme = UnistylesRuntime.getTheme() as Theme;

    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => {
        setUpdateCounter((c) => c + 1);
      };

      editor.on('selectionUpdate', handleUpdate);
      editor.on('transaction', handleUpdate);

      return () => {
        editor.off('selectionUpdate', handleUpdate);
        editor.off('transaction', handleUpdate);
      };
    }, [editor]);

    // Generate toolbar styles from theme
    const toolbarStyle: React.CSSProperties = useMemo(() => ({
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      padding: 8,
      borderBottom: `1px solid ${theme.colors.border.primary}`,
      backgroundColor: theme.colors.surface.secondary,
    }), [theme]);

    // Check if any heading is active
    const activeHeading = HEADING_ITEMS.find((h) => isActive(h));

    return (
      <div
        style={toolbarStyle}
        role="toolbar"
        aria-label="Editor formatting toolbar"
      >
        {items.map((item) => {
          // Render heading dropdown
          if (item === 'heading') {
            const disabled = disabledItems.includes(item);
            return (
              <HeadingDropdown
                key={item}
                activeHeading={activeHeading}
                disabled={disabled}
                onAction={onAction}
                theme={theme}
              />
            );
          }

          // Skip individual heading items if we're using the dropdown
          if (item.startsWith('heading') && items.includes('heading')) {
            return null;
          }

          const active = isActive(item);
          const disabled = disabledItems.includes(item);
          return (
            <ToolbarButton
              key={item}
              item={item}
              active={active}
              disabled={disabled}
              onAction={onAction}
              theme={theme}
            />
          );
        })}
      </div>
    );
  }
);

EditorToolbar.displayName = 'EditorToolbar';

// Heading dropdown component
const HeadingDropdown = memo<{
  activeHeading: string | undefined;
  disabled: boolean;
  onAction: (action: string) => void;
  theme: any;
}>(({ activeHeading, disabled, onAction, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const primaryColor = theme.intents?.primary?.primary ?? '#6366f1';
  const textColor = theme.colors.text.primary;
  const disabledColor = theme.colors.text.tertiary ?? 'rgba(0, 0, 0, 0.3)';
  const activeBg = theme.colors.surface.tertiary ?? 'rgba(0, 0, 0, 0.08)';
  const hoverBg = theme.colors.surface.tertiary ?? 'rgba(0, 0, 0, 0.05)';
  const surfacePrimary = theme.colors.surface.primary ?? '#ffffff';
  const borderColor = theme.colors.border.primary ?? 'rgba(0, 0, 0, 0.1)';

  const buttonStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      padding: '6px 8px',
      borderRadius: theme.radii?.sm ?? 4,
      backgroundColor: 'transparent',
      color: textColor,
      minWidth: 48,
      height: 32,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      outline: 'none',
    };

    if (disabled) {
      return {
        ...base,
        color: disabledColor,
        cursor: 'not-allowed',
        opacity: 0.5,
      };
    }

    if (activeHeading || isOpen) {
      return {
        ...base,
        backgroundColor: activeBg,
        color: primaryColor,
      };
    }

    if (isHovered) {
      return {
        ...base,
        backgroundColor: hoverBg,
      };
    }

    return base;
  }, [activeHeading, isOpen, disabled, isHovered, theme, primaryColor, textColor, disabledColor, activeBg, hoverBg]);

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    backgroundColor: surfacePrimary,
    border: `1px solid ${borderColor}`,
    borderRadius: theme.radii?.md ?? 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    minWidth: 120,
    overflow: 'hidden',
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (heading: string) => {
    onAction(heading);
    setIsOpen(false);
  };

  // Determine which icon to show - default to H1
  const currentIcon = activeHeading ? TOOLBAR_ICONS[activeHeading] : TOOLBAR_ICONS.heading1;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={handleToggle}
        title={TOOLBAR_TITLES.heading}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon path={currentIcon} size={0.75} />
        <Icon path={mdiMenuDown} size={0.5} />
      </button>
      {isOpen && (
        <div style={dropdownStyle} role="listbox">
          {HEADING_ITEMS.map((heading) => (
            <HeadingOption
              key={heading}
              heading={heading}
              isActive={activeHeading === heading}
              onSelect={handleSelect}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
});

HeadingDropdown.displayName = 'HeadingDropdown';

// Individual heading option in the dropdown
const HeadingOption = memo<{
  heading: string;
  isActive: boolean;
  onSelect: (heading: string) => void;
  theme: any;
}>(({ heading, isActive, onSelect, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryColor = theme.intents?.primary?.primary ?? '#6366f1';
  const textColor = theme.colors.text.primary;
  const hoverBg = theme.colors.surface.secondary ?? 'rgba(0, 0, 0, 0.05)';
  const activeBg = theme.colors.surface.tertiary ?? 'rgba(0, 0, 0, 0.08)';

  const optionStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      backgroundColor: 'transparent',
      color: textColor,
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'background-color 0.15s ease',
    };

    if (isActive) {
      return {
        ...base,
        backgroundColor: activeBg,
        color: primaryColor,
      };
    }

    if (isHovered) {
      return {
        ...base,
        backgroundColor: hoverBg,
      };
    }

    return base;
  }, [isActive, isHovered, primaryColor, textColor, hoverBg, activeBg]);

  return (
    <button
      type="button"
      onClick={() => onSelect(heading)}
      style={optionStyle}
      role="option"
      aria-selected={isActive}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon path={TOOLBAR_ICONS[heading]} size={0.75} />
      <span style={{ fontSize: 14 }}>{TOOLBAR_TITLES[heading]}</span>
    </button>
  );
});

HeadingOption.displayName = 'HeadingOption';

// Separate button component to properly manage styles per button
const ToolbarButton = memo<{
  item: ToolbarItem;
  active: boolean;
  disabled: boolean;
  onAction: (action: string) => void;
  theme: any;
}>(({ item, active, disabled, onAction, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get colors from theme
  const primaryColor = theme.intents?.primary?.primary ?? '#6366f1';
  const textColor = theme.colors.text.primary;
  const disabledColor = theme.colors.text.tertiary ?? 'rgba(0, 0, 0, 0.3)';
  const activeBg = theme.colors.surface.tertiary ?? 'rgba(0, 0, 0, 0.08)';
  const hoverBg = theme.colors.surface.tertiary ?? 'rgba(0, 0, 0, 0.05)';

  // Build button style based on state
  const buttonStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px',
      borderRadius: theme.radii?.sm ?? 4,
      backgroundColor: 'transparent',
      color: textColor,
      minWidth: 32,
      height: 32,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      outline: 'none',
    };

    if (disabled) {
      return {
        ...base,
        color: disabledColor,
        cursor: 'not-allowed',
        opacity: 0.5,
      };
    }

    if (active) {
      return {
        ...base,
        backgroundColor: activeBg,
        color: primaryColor,
      };
    }

    if (isHovered) {
      return {
        ...base,
        backgroundColor: hoverBg,
      };
    }

    return base;
  }, [active, disabled, isHovered, theme, primaryColor, textColor, disabledColor, activeBg, hoverBg]);

  const handleClick = () => {
    if (!disabled) {
      onAction(item);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={TOOLBAR_TITLES[item]}
      aria-pressed={active}
      aria-disabled={disabled}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon path={TOOLBAR_ICONS[item]} size={0.75} />
    </button>
  );
});

ToolbarButton.displayName = 'ToolbarButton';
