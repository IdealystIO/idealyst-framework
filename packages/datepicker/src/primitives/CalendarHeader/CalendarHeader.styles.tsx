import { StyleSheet } from 'react-native-unistyles';

export const calendarHeaderStyles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    minWidth: 32,
    minHeight: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  titleButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
}));