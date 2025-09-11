import { StyleSheet } from 'react-native-unistyles';

export const dateInputStyles = StyleSheet.create((theme) => ({
  container: {
    width: '100%',
  },
  
  label: {
    fontSize: theme.typography?.sizes?.small || 14,
    color: theme.colors?.text?.primary || '#1f2937',
    marginBottom: theme.spacing?.xs || 4,
    fontWeight: '500',
  },
  
  helperText: {
    fontSize: theme.typography?.sizes?.small || 12,
    color: theme.colors?.text?.secondary || '#6b7280',
    marginTop: theme.spacing?.xs || 4,
  },
  
  errorText: {
    fontSize: theme.typography?.sizes?.small || 12,
    color: theme.colors?.text?.error || '#dc2626',
    marginTop: theme.spacing?.xs || 4,
  },
}));