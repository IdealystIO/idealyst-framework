import { StyleSheet } from 'react-native-unistyles';

export const progressStyles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.xs,
  },

  linearTrack: {
    backgroundColor: theme.palettes.gray[300],
    overflow: 'hidden',
    position: 'relative',

    variants: {
      size: {
        sm: {
          height: 4,
        },
        md: {
          height: 8,
        },
        lg: {
          height: 12,
        },
      },
      rounded: {
        true: {
          borderRadius: theme.borderRadius.full,
        },
        false: {
          borderRadius: 0,
        },
      },
    },
  },

  linearBar: {
    height: '100%',
    transition: 'width 0.3s ease',

    variants: {
      intent: {
        primary: {
          backgroundColor: theme.intents.primary.main,
        },
        success: {
          backgroundColor: theme.intents.success.main,
        },
        error: {
          backgroundColor: theme.intents.error.main,
        },
        warning: {
          backgroundColor: theme.intents.warning.main,
        },
        neutral: {
          backgroundColor: theme.intents.neutral.main,
        },
      },
      rounded: {
        true: {
          borderRadius: theme.borderRadius.full,
        },
        false: {
          borderRadius: 0,
        },
      },
    },
  },

  indeterminateBar: {
    position: 'absolute',
    height: '100%',
    width: '40%',

    variants: {
      intent: {
        primary: {
          backgroundColor: theme.intents.primary.main,
        },
        success: {
          backgroundColor: theme.intents.success.main,
        },
        error: {
          backgroundColor: theme.intents.error.main,
        },
        warning: {
          backgroundColor: theme.intents.warning.main,
        },
        neutral: {
          backgroundColor: theme.intents.neutral.main,
        },
      },
      rounded: {
        true: {
          borderRadius: theme.borderRadius.full,
        },
        false: {
          borderRadius: 0,
        },
      },
    },
  },

  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

    variants: {
      size: {
        sm: {
          width: 32,
          height: 32,
        },
        md: {
          width: 48,
          height: 48,
        },
        lg: {
          width: 64,
          height: 64,
        },
      },
    },
  },

  circularTrack: {
    stroke: theme.palettes.gray[300],
  },

  circularBar: {
    variants: {
      intent: {
        primary: {
          stroke: theme.intents.primary.main,
        },
        success: {
          stroke: theme.intents.success.main,
        },
        error: {
          stroke: theme.intents.error.main,
        },
        warning: {
          stroke: theme.intents.warning.main,
        },
        neutral: {
          stroke: theme.intents.neutral.main,
        },
      },
    },
  },

  label: {
    color: theme.colors.text.primary,
    textAlign: 'center',

    variants: {
      size: {
        sm: {
          fontSize: 12,
        },
        md: {
          fontSize: 14,
        },
        lg: {
          fontSize: 16,
        },
      },
    },
  },

  circularLabel: {
    position: 'absolute',
    fontWeight: '600',
    color: theme.colors.text.primary,

    variants: {
      size: {
        sm: {
          fontSize: 10,
        },
        md: {
          fontSize: 12,
        },
        lg: {
          fontSize: 14,
        },
      },
    },
  },
}));