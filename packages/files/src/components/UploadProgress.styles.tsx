/**
 * UploadProgress styles using defineStyle.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type UploadProgressVariants = {
  size: Size;
  intent: Intent;
};

export type UploadProgressDynamicProps = {
  intent?: Intent;
  size?: Size;
};

export const uploadProgressStyles = defineStyle('UploadProgress', (theme: Theme) => ({
  container: (_props: UploadProgressDynamicProps) => ({
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  }),
  infoRow: (_props: UploadProgressDynamicProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  }),
  fileName: (_props: UploadProgressDynamicProps) => ({
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  }),
  stateIcon: ({ intent = 'primary' }: UploadProgressDynamicProps) => ({
    fontSize: 20,
    color: theme.intents[intent].primary,
  }),
  progressContainer: (_props: UploadProgressDynamicProps) => ({
    height: 8,
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  }),
  progressBar: ({ intent = 'primary' }: UploadProgressDynamicProps) => ({
    height: '100%',
    backgroundColor: theme.intents[intent].primary,
    borderRadius: 4,
  }),
  detailsRow: (_props: UploadProgressDynamicProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  }),
  detail: (_props: UploadProgressDynamicProps) => ({
    fontSize: 12,
    color: theme.colors.text.secondary,
  }),
  actions: (_props: UploadProgressDynamicProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }),
  actionButton: (_props: UploadProgressDynamicProps) => ({
    padding: 4,
    borderRadius: 4,
    _web: {
      cursor: 'pointer',
    },
  }),
  actionIcon: ({ intent = 'neutral' }: UploadProgressDynamicProps) => ({
    fontSize: 20,
    color: theme.intents[intent].primary,
  }),
  errorText: (_props: UploadProgressDynamicProps) => ({
    fontSize: 12,
    color: theme.intents.danger.primary,
    marginTop: 4,
  }),
}));
