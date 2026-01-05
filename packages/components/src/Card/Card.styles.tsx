import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent } from '@idealyst/theme';
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

type CardDynamicProps = {
  intent?: CardIntent;
  type?: CardType;
};

/**
 * Get the border color based on intent (only used for outlined type)
 */
function getBorderColor(theme: Theme, intent: CardIntent): string {
  if (intent === 'info' || intent === 'neutral') {
    return theme.colors.border.secondary;
  }
  if (intent in theme.intents) {
    return theme.intents[intent as Intent].primary;
  }
  return theme.colors.border.secondary;
}

/**
 * Get type-specific styles
 */
function getTypeStyles(theme: Theme, type: CardType, intent: CardIntent) {
  switch (type) {
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: getBorderColor(theme, intent),
      };
    case 'elevated':
      return {
        backgroundColor: theme.colors.surface.primary,
        borderWidth: 0,
        ...theme.shadows.md,
      };
    case 'filled':
      return {
        backgroundColor: theme.colors.surface.secondary,
        borderWidth: 0,
      };
    default:
      return {};
  }
}

/**
 * Create dynamic card styles
 */
function createCardStyles(theme: Theme) {
  return ({ intent = 'neutral', type = 'elevated' }: CardDynamicProps) => {
    const typeStyles = getTypeStyles(theme, type, intent);
    return {
      ...typeStyles,
      position: 'relative',
      overflow: 'hidden',
      variants: {
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
      _web: {
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      },
    } as const;
  };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const cardStyles = StyleSheet.create((theme: Theme) => {
  return {
    card: createCardStyles(theme),
  };
});
