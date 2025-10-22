import { StyleSheet } from 'react-native-unistyles';

// Container stylesheet
export const tabBarContainerStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 0,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colors.border.primary,

    variants: {
      variant: {
        default: {},
        pills: {
          borderBottomWidth: 0,
          padding: 4,
          gap: 4,
          backgroundColor: theme.colors.surface.secondary,
          overflow: 'hidden',
          alignSelf: 'flex-start',
        },
        underline: {},
      },
      size: {
        sm: {},
        md: {},
        lg: {},
      },
      pillMode: {
        light: {},
        dark: {},
      },
    },

    compoundVariants: [
      // Pills on light backgrounds - use light surface background
      {
        variant: 'pills',
        pillMode: 'light',
        styles: {
          backgroundColor: theme.colors.surface.secondary,
        },
      },
      // Pills on dark backgrounds - use darker surface background
      {
        variant: 'pills',
        pillMode: 'dark',
        styles: {
          backgroundColor: theme.colors.surface.inverse
        },
      },
    ],
  },
}));

// Tab stylesheet
export const tabBarTabStyles = StyleSheet.create((theme) => ({
  tab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'color 0.2s ease',
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'transparent',

    variants: {
      size: {
        sm: {
          fontSize: 14,
          padding: 8,
          lineHeight: 20,
        },
        md: {
          fontSize: 16,
          padding: 12,
          lineHeight: 24,
        },
        lg: {
          fontSize: 18,
          padding: 16,
          lineHeight: 28,
        },
      },
      variant: {
        default: {},
        pills: {
          borderRadius: theme.borderRadius.full,
          marginRight: 0,
          backgroundColor: 'transparent',
        },
        underline: {},
      },
      active: {
        true: {
          color: theme.colors.text.primary,
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {
          ':hover': {
            color: theme.colors.text.primary,
          },
        },
      },
      pillMode: {
        light: {},
        dark: {},
      },
    },

    compoundVariants: [
      // Pills variant - compact padding for all sizes
      {
        variant: 'pills',
        size: 'sm',
        styles: {
          paddingVertical: 4,
          paddingHorizontal: 12,
        },
      },
      {
        variant: 'pills',
        size: 'md',
        styles: {
          paddingVertical: 6,
          paddingHorizontal: 16,
        },
      },
      {
        variant: 'pills',
        size: 'lg',
        styles: {
          paddingVertical: 8,
          paddingHorizontal: 20,
        },
      },

      // Pills variant - active text color
      {
        variant: 'pills',
        active: true,
        styles: {
          color: theme.intents.primary.on,
        },
      },

      // Underline variant - active text color
      {
        variant: 'underline',
        active: true,
        styles: {
          color: theme.intents.primary.main,
        },
      },
    ],
  },
}));

// Tab label stylesheet
export const tabBarLabelStyles = StyleSheet.create((theme) => ({
  tabLabel: {
    position: 'relative',
    zIndex: 3,
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,

    variants: {
      size: {
        sm: {
          fontSize: 14,
          lineHeight: 20,
        },
        md: {
          fontSize: 16,
          lineHeight: 24,
        },
        lg: {
          fontSize: 18,
          lineHeight: 28,
        },
      },
      variant: {
        default: {},
        pills: {},
        underline: {},
      },
      active: {
        true: {
          color: theme.colors.text.primary,
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
        false: {},
      },
      pillMode: {
        light: {},
        dark: {},
      },
    },

    compoundVariants: [
      // Pills light mode - light text on active (dark pill)
      {
        variant: 'pills',
        pillMode: 'light',
        active: true,
        styles: {
          color: theme.colors.text.primary,
        },
      },
      // Pills dark mode - dark text on active (light pill)
      {
        variant: 'pills',
        pillMode: 'dark',
        active: true,
        styles: {
          color: theme.colors.text.primary,
        },
      },
      // Underline variant - active text color
      {
        variant: 'underline',
        active: true,
        styles: {
          color: theme.intents.primary.main,
        },
      },
    ],
  },
}));


// Indicator stylesheet
export const tabBarIndicatorStyles = StyleSheet.create((theme) => ({
  indicator: {
    position: 'absolute',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    zIndex: 1,

    variants: {
      variant: {
        default: {
          bottom: -1,
          height: 2,
          backgroundColor: theme.intents.primary.main,
        },
        pills: {
          borderRadius: theme.borderRadius.full,
          bottom: 4,
          top: 4,
          left: 0,
        },
        underline: {
          bottom: -1,
          height: 2,
          backgroundColor: theme.intents.primary.main,
        },
      },
      pillMode: {
        light: {},
        dark: {},
      },
    },

    compoundVariants: [
      // Pills light mode - darker pill
      {
        variant: 'pills',
        pillMode: 'light',
        styles: {
          backgroundColor: theme.colors.surface.tertiary,
        },
      },
      // Pills dark mode - lighter pill
      {
        variant: 'pills',
        pillMode: 'dark',
        styles: {
          backgroundColor: theme.colors.surface.secondary,
        },
      },
    ],
  },
}));
