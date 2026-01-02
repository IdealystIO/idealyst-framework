import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent, CompoundVariants } from '@idealyst/theme';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { ViewStyleSize } from '../utils/viewStyleProps';

type CardType = 'outlined' | 'elevated' | 'filled';
type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xs' | 'xl';
type CardIntent = Intent | 'info' | 'neutral';

export type CardVariants = {
  type: CardType;
  radius: CardRadius;
  intent: CardIntent;
  clickable: boolean;
  disabled: boolean;
  // Spacing variants from ContainerStyleProps
  gap: ViewStyleSize;
  padding: ViewStyleSize;
  paddingVertical: ViewStyleSize;
  paddingHorizontal: ViewStyleSize;
  margin: ViewStyleSize;
  marginVertical: ViewStyleSize;
  marginHorizontal: ViewStyleSize;
};

/**
 * Create type variants (structure only, colors handled by compound variants)
 */
function createTypeVariants(theme: Theme) {
  return {
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid' as const,
    },
    elevated: {
      backgroundColor: theme.colors.surface.primary,
      borderWidth: 0,
      ...theme.shadows.md,
    },
    filled: {
      backgroundColor: theme.colors.surface.secondary,
      borderWidth: 0,
    },
  } as const;
}

/**
 * Create compound variants for type + intent combinations
 */
function createCardCompoundVariants(theme: Theme) {
  const compoundVariants: CompoundVariants<keyof CardVariants> = [];

  // Add intent-based border colors for outlined type
  for (const intent in theme.intents) {
    const intentValue = theme.intents[intent as Intent];

    compoundVariants.push({
      intent,
      type: 'outlined',
      styles: {
        borderColor: intentValue.primary,
      },
    });
  }

  // Add special intents (info, neutral) for outlined type
  compoundVariants.push({
    intent: 'info',
    type: 'outlined',
    styles: {
      borderColor: theme.colors.border.secondary,
    },
  });
  compoundVariants.push({
    intent: 'neutral',
    type: 'outlined',
    styles: {
      borderColor: theme.colors.border.secondary,
    },
  });

  return compoundVariants;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const cardStyles = StyleSheet.create((theme: Theme) => {
  return {
    card: {
      backgroundColor: theme.colors.surface.primary,
      position: 'relative',
      overflow: 'hidden',
      variants: {
        type: createTypeVariants(theme),
        radius: {
          none: { borderRadius: 0 },
          xs: { borderRadius: 2 },
          sm: { borderRadius: 4 },
          md: { borderRadius: 8 },
          lg: { borderRadius: 12 },
          xl: { borderRadius: 16 },
        },
        clickable: {
          true: {
            _web: {
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              _hover: {
                transform: 'translateY(-2px)',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          false: {
            _web: {
              cursor: 'default',
            },
          },
        },
        disabled: {
          true: {
            opacity: 0.6,
            _web: {
              cursor: 'not-allowed',
            },
          },
          false: {
            opacity: 1,
          },
        },
        // Spacing variants from ContainerStyleProps
        gap: buildGapVariants(theme),
        padding: buildPaddingVariants(theme),
        paddingVertical: buildPaddingVerticalVariants(theme),
        paddingHorizontal: buildPaddingHorizontalVariants(theme),
        margin: buildMarginVariants(theme),
        marginVertical: buildMarginVerticalVariants(theme),
        marginHorizontal: buildMarginHorizontalVariants(theme),
      },
      compoundVariants: createCardCompoundVariants(theme),
      _web: {
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      },
    } as const,
  };
});
