import { StyleSheet } from 'react-native-unistyles';

export const breadcrumbStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 8,
  },

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
        small: {
          fontSize: 12,
          lineHeight: 16,
        },
        medium: {
          fontSize: 14,
          lineHeight: 20,
        },
        large: {
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
        small: {
          width: 14,
          height: 14,
        },
        medium: {
          width: 16,
          height: 16,
        },
        large: {
          width: 18,
          height: 18,
        },
      },
    },
  },

  separator: {
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,

    variants: {
      size: {
        small: {
          fontSize: 12,
          lineHeight: 16,
        },
        medium: {
          fontSize: 14,
          lineHeight: 20,
        },
        large: {
          fontSize: 16,
          lineHeight: 24,
        },
      },
    },
  },

  ellipsis: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,

    variants: {
      size: {
        small: {
          fontSize: 12,
          lineHeight: 16,
        },
        medium: {
          fontSize: 14,
          lineHeight: 20,
        },
        large: {
          fontSize: 16,
          lineHeight: 24,
        },
      },
    },
  },
}));
