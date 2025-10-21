import { StyleSheet } from 'react-native-unistyles';

// Container stylesheet (no variants needed)
export const breadcrumbContainerStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
}));

// Item stylesheet
export const breadcrumbItemStyles = StyleSheet.create((theme) => ({
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  itemText: {
    fontFamily: theme.typography.fontFamily.medium,

    variants: {
      size: {
        sm: {
          fontSize: 12,
          lineHeight: 16,
        },
        md: {
          fontSize: 14,
          lineHeight: 20,
        },
        lg: {
          fontSize: 16,
          lineHeight: 24,
        },
      },
      intent: {
        primary: {},
        neutral: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          color: theme.colors.text.secondary,
        },
        false: {},
      },
      isLast: {
        true: {
          color: theme.colors.text.primary,
        },
        false: {},
      },
      clickable: {
        true: {},
        false: {},
      },
    },

    compoundVariants: [
      {
        clickable: true,
        intent: 'primary',
        isLast: false,
        disabled: false,
        styles: {
          color: theme.intents.primary.main,
        },
      },
      {
        clickable: true,
        intent: 'neutral',
        isLast: false,
        disabled: false,
        styles: {
          color: theme.colors.text.secondary,
        },
      },
      {
        clickable: false,
        isLast: false,
        disabled: false,
        styles: {
          color: theme.colors.text.secondary,
        },
      },
    ],
  },

  icon: {
    variants: {
      size: {
        sm: {
          width: 14,
          height: 14,
        },
        md: {
          width: 16,
          height: 16,
        },
        lg: {
          width: 18,
          height: 18,
        },
      },
    },
  },
}));

// Separator stylesheet
export const breadcrumbSeparatorStyles = StyleSheet.create((theme) => ({
  separator: {
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,

    variants: {
      size: {
        sm: {
          fontSize: 12,
          lineHeight: 16,
        },
        md: {
          fontSize: 14,
          lineHeight: 20,
        },
        lg: {
          fontSize: 16,
          lineHeight: 24,
        },
      },
    },
  },
}));

// Ellipsis stylesheet
export const breadcrumbEllipsisStyles = StyleSheet.create((theme) => ({
  ellipsis: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    variants: {
      size: {
        sm: {
          width: 14,
          height: 14,
        },
        md: {
          width: 16,
          height: 16,
        },
        lg: {
          width: 18,
          height: 18,
        },
      },
      intent: {
        primary: {
          color: theme.intents.primary.main,
        },
        neutral: {
          color: theme.colors.text.secondary,
        },
      },
    },
  },
}));

// Menu button stylesheet
export const breadcrumbMenuButtonStyles = StyleSheet.create((theme) => ({
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  icon: {
    variants: {
      size: {
        sm: {
          width: 14,
          height: 14,
        },
        md: {
          width: 16,
          height: 16,
        },
        lg: {
          width: 18,
          height: 18,
        },
      },
      intent: {
        primary: {
          color: theme.intents.primary.main,
        },
        neutral: {
          color: theme.colors.text.secondary,
        },
      },
    },
  },
}));
