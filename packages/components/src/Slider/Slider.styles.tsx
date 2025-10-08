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
        small: {
          height: 4,
        },
        medium: {
          height: 6,
        },
        large: {
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

    variants: {
      size: {
        small: {
          width: 16,
          height: 16,
        },
        medium: {
          width: 20,
          height: 20,
        },
        large: {
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
        small: {
          height: 8,
        },
        medium: {
          height: 10,
        },
        large: {
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