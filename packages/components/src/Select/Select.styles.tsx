import { StyleSheet } from 'react-native-unistyles';

export const selectStyles = StyleSheet.create((theme) => ({
  container: {
    position: 'relative',
  },

  label: {
    fontSize: theme.typography?.sm?.fontSize || 14,
    fontWeight: theme.typography?.sm?.fontWeight || '500',
    color: theme.colors?.text?.primary || theme.palettes?.gray?.[700] || '#374151',
    marginBottom: theme.spacing?.xs || 4,
  },

  trigger: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing?.sm || 12,
    borderRadius: theme.borderRadius?.md || 8,
    borderWidth: 1,
    minHeight: 44,
    cursor: 'pointer',

    variants: {
      variant: {
        outlined: {
          backgroundColor: 'transparent',
          borderColor: theme.colors?.border?.primary || theme.palettes?.gray?.[300] || '#d1d5db',
          _web: {
            border: `1px solid ${theme.colors?.border?.primary || theme.palettes?.gray?.[300] || '#d1d5db'}`,
          },
        },
        filled: {
          backgroundColor: theme.colors?.surface?.secondary || theme.palettes?.gray?.[50] || '#f9fafb',
          borderColor: 'transparent',
          _web: {
            border: '1px solid transparent',
          },
        },
      },
      size: {
        small: {
          paddingHorizontal: theme.spacing?.xs || 8,
          minHeight: 36,
        },
        medium: {
          paddingHorizontal: theme.spacing?.sm || 12,
          minHeight: 44,
        },
        large: {
          paddingHorizontal: theme.spacing?.md || 16,
          minHeight: 52,
        },
      },
      intent: {
        neutral: {},
        primary: {},
        success: {},
        error: {},
        warning: {},
        info: {},
      },
      disabled: {
        true: {
          opacity: 0.6,
          cursor: 'not-allowed',
        },
        false: {},
      },
      error: {
        true: {
          borderColor: theme.intents?.error?.main || '#ef4444',
          _web: {
            border: `1px solid ${theme.intents?.error?.main || '#ef4444'}`,
          },
        },
        false: {},
      },
      focused: {
        true: {
          borderColor: theme.intents?.primary?.main || '#3b82f6',
          _web: {
            border: `2px solid ${theme.intents?.primary?.main || '#3b82f6'}`,
            outline: 'none',
          },
        },
        false: {},
      },
    },

    compoundVariants: [
      {
        variant: 'outlined',
        intent: 'primary',
        styles: {
          borderColor: theme.intents?.primary?.main || '#3b82f6',
          _web: {
            border: `1px solid ${theme.intents?.primary?.main || '#3b82f6'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        styles: {
          borderColor: theme.intents?.success?.main || '#22c55e',
          _web: {
            border: `1px solid ${theme.intents?.success?.main || '#22c55e'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: {
          borderColor: theme.intents?.error?.main || '#ef4444',
          _web: {
            border: `1px solid ${theme.intents?.error?.main || '#ef4444'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: {
          borderColor: theme.intents?.warning?.main || '#f59e0b',
          _web: {
            border: `1px solid ${theme.intents?.warning?.main || '#f59e0b'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: {
          borderColor: theme.intents?.info?.main || '#06b6d4',
          _web: {
            border: `1px solid ${theme.intents?.info?.main || '#06b6d4'}`,
          },
        },
      },
    ],

    _web: {
      display: 'flex',
      boxSizing: 'border-box',
      _focus: {
        outline: 'none',
      },
      _hover: {
        borderColor: theme.intents?.primary?.main || '#3b82f6',
      },
    },
  },

  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  triggerText: {
    fontSize: theme.typography?.base?.fontSize || 16,
    color: theme.colors?.text?.primary || theme.palettes?.gray?.[900] || '#111827',
    flex: 1,
  },

  placeholder: {
    fontSize: theme.typography?.base?.fontSize || 16,
    color: theme.colors?.text?.disabled || theme.palettes?.gray?.[500] || '#6b7280',
  },

  icon: {
    marginLeft: theme.spacing?.xs || 4,
    color: theme.colors?.text?.secondary || theme.palettes?.gray?.[600] || '#4b5563',
  },

  chevron: {
    marginLeft: theme.spacing?.xs || 4,
    color: theme.colors?.text?.secondary || theme.palettes?.gray?.[600] || '#4b5563',
    transition: 'transform 0.2s ease',
  },

  chevronOpen: {
    transform: 'rotate(180deg)',
  },

  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    borderRadius: theme.borderRadius?.md || 8,
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || theme.palettes?.gray?.[200] || '#e5e7eb',
    shadowColor: theme.shadows?.lg?.shadowColor || '#000',
    shadowOffset: theme.shadows?.lg?.shadowOffset || { width: 0, height: 8 },
    shadowOpacity: theme.shadows?.lg?.shadowOpacity || 0.15,
    shadowRadius: theme.shadows?.lg?.shadowRadius || 12,
    elevation: theme.shadows?.lg?.elevation || 8,
    zIndex: 9999, // Higher z-index to float above other content
    maxHeight: 240,
    overflow: 'hidden',

    _web: {
      border: `1px solid ${theme.colors?.border?.primary || theme.palettes?.gray?.[200] || '#e5e7eb'}`,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
      overflowY: 'auto',
    },
  },

  searchContainer: {
    padding: theme.spacing?.sm || 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors?.border?.primary || theme.palettes?.gray?.[200] || '#e5e7eb',

    _web: {
      borderBottom: `1px solid ${theme.colors?.border?.primary || theme.palettes?.gray?.[200] || '#e5e7eb'}`,
    },
  },

  searchInput: {
    padding: theme.spacing?.xs || 8,
    borderRadius: theme.borderRadius?.sm || 4,
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || theme.palettes?.gray?.[300] || '#d1d5db',
    fontSize: theme.typography?.sm?.fontSize || 14,
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',

    _web: {
      border: `1px solid ${theme.colors?.border?.primary || theme.palettes?.gray?.[300] || '#d1d5db'}`,
      outline: 'none',
      _focus: {
        borderColor: theme.intents?.primary?.main || '#3b82f6',
      },
    },
  },

  optionsList: {
    paddingVertical: theme.spacing?.xs || 4,
  },

  option: {
    paddingHorizontal: theme.spacing?.sm || 12,
    paddingVertical: theme.spacing?.sm || 12,
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    minHeight: 44,

    variants: {
      selected: {
        true: {
          backgroundColor: theme.intents?.primary?.container || theme.palettes?.blue?.[50] || '#eff6ff',
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {},
      },
    },

    _web: {
      display: 'flex',
      _hover: {
        backgroundColor: theme.colors?.surface?.secondary || theme.palettes?.gray?.[50] || '#f9fafb',
      },
    },
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  optionIcon: {
    marginRight: theme.spacing?.xs || 8,
  },

  optionText: {
    fontSize: theme.typography?.base?.fontSize || 16,
    color: theme.colors?.text?.primary || theme.palettes?.gray?.[900] || '#111827',
    flex: 1,
  },

  optionTextDisabled: {
    color: theme.colors?.text?.disabled || theme.palettes?.gray?.[500] || '#6b7280',
  },

  helperText: {
    fontSize: theme.typography?.xs?.fontSize || 12,
    marginTop: theme.spacing?.xs || 4,
    color: theme.colors?.text?.secondary || theme.palettes?.gray?.[600] || '#4b5563',

    variants: {
      error: {
        true: {
          color: theme.intents?.error?.main || '#ef4444',
        },
        false: {},
      },
    },
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,

    _web: {
      position: 'fixed',
    },
  },
}));