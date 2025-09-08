import { StyleSheet } from 'react-native-unistyles';

export const webTabLayoutStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 16,
    variants: {
      _web: {
        backgroundColor: '#ffffff',
        borderBottomColor: '#e0e0e0',
      },
    },
  },

  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Content area styles
  bodyContainer: {
    flex: 1,
  },

  mainContent: {
    flex: 1,
  },

  contentArea: {
    flex: 1,
    padding: 16,
  },

  // Tab bar styles
  headerTabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tabBarBottom: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    variants: {
      _web: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e0e0e0',
      },
    },
  },

  tabBarBottomContainer: {
    variants: {
      _web: {
        backgroundColor: '#ffffff',
      },
    },
  },

  // Tab button styles
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },

  tabButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 40,
    marginRight: 4,
  },

  // Simple header tab button (for router usage)
  simpleHeaderTabButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    variants: {
      _web: {
        display: 'flex',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.2s ease',
        _hover: {
          opacity: 0.8,
        },
      },
    },
  },

  tabButtonActive: {
    backgroundColor: theme.colors.primaryContainer,
    variants: {
      _web: {
        backgroundColor: '#e3f2fd',
      },
    },
  },

  // Simple header tab button active state
  simpleHeaderTabButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    variants: {
      _web: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
    },
  },

  tabButtonDisabled: {
    opacity: 0.5,
  },

  // Tab icon and content styles
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  tabBadgeText: {
    color: theme.colors.onError,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));