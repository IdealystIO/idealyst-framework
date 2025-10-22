import { StyleSheet } from 'react-native-unistyles';

export const sliderStyles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },

  sliderWrapper: {
    position: 'relative',
    paddingVertical: theme.spacing.xs,
  },

  track: {
    backgroundColor: theme.palettes.gray[300],
    borderRadius: theme.borderRadius.full,
    position: 'relative',
    cursor: 'pointer',

    variants: {
      size: {
        sm: {
          height: 4,
        },
        md: {
          height: 6,
        },
        lg: {
          height: 8,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {
          opacity: 1,
        },
      },
    },
  },

  filledTrack: {
    position: 'absolute',
    height: '100%',
    borderRadius: theme.borderRadius.full,
    top: 0,
    left: 0,

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
    },
  },

  thumb: {
    position: 'absolute',
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.full,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
      size: {
        sm: {
          width: 16,
          height: 16,
        },
        md: {
          width: 20,
          height: 20,
        },
        lg: {
          width: 24,
          height: 24,
        },
      },
      intent: {
        primary: {
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: theme.intents.primary.main,
        },
        success: {
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: theme.intents.success.main,
        },
        error: {
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: theme.intents.error.main,
        },
        warning: {
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: theme.intents.warning.main,
        },
        neutral: {
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: theme.intents.neutral.main,
        },
      },
      disabled: {
        true: {
          cursor: 'not-allowed',
        },
        false: {
          cursor: 'pointer',
        },
      },
    },
  },

  thumbActive: {
    transform: 'translate(-50%, -50%) scale(1.1)',
  },

  thumbIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,

    variants: {
      size: {
        sm: {
          width: 10,
          height: 10,
          minWidth: 10,
          maxWidth: 10,
          minHeight: 10,
          maxHeight: 10,
        },
        md: {
          width: 12,
          height: 12,
          minWidth: 12,
          maxWidth: 12,
          minHeight: 12,
          maxHeight: 12,
        },
        lg: {
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
      },
      intent: {
        primary: {
          color: theme.intents.primary.main,
        },
        success: {
          color: theme.intents.success.main,
        },
        error: {
          color: theme.intents.error.main,
        },
        warning: {
          color: theme.intents.warning.main,
        },
        neutral: {
          color: theme.intents.neutral.main,
        },
      },
    },
  },

  valueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  minMaxLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },

  minMaxLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },

  marks: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },

  mark: {
    position: 'absolute',
    width: 2,
    backgroundColor: theme.palettes.gray[400],
    top: '50%',
    transform: 'translate(-50%, -50%)',

    variants: {
      size: {
        sm: {
          height: 8,
        },
        md: {
          height: 10,
        },
        lg: {
          height: 12,
        },
      },
    },
  },

  markLabel: {
    position: 'absolute',
    fontSize: 10,
    color: theme.colors.text.secondary,
    top: '100%',
    marginTop: 4,
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  },
}));