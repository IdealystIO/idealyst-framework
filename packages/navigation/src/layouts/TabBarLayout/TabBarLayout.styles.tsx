import { StyleSheet } from 'react-native-unistyles';

export const tabBarLayoutStyles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing?.md,
    zIndex: 10,
    web: {
      backgroundColor: '#ffffff', // Light background for web
      borderBottomColor: '#e0e0e0', // Light border for web
    },
  },
  
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing?.sm,
  },
  
  headerTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing?.xs,
  },
  
  bodyContainer: {
    flex: 1,
    position: 'relative',
  },
  
  mainContent: {
    flex: 1,
  },
  
  contentArea: {
    flex: 1,
  },
  
  tabBarBottom: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 6,
    paddingHorizontal: 0,
    web: {
      backgroundColor: '#ffffff', // Light background for web
      borderTopColor: '#e0e0e0', // Light border for web
    },
  },
  
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 49,
  },
  
  tabButtonHeader: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing?.xs,
    paddingHorizontal: theme.spacing?.md,
    borderRadius: theme.radius?.md,
    minHeight: 36,
  },
  
  tabButtonActive: {
    // Let native platform handle active state styling
  },
  
  tabButtonDisabled: {
    opacity: 0.5,
  },
  
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  tabIcon: {
    width: 24,
    height: 24,
  },
  
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  
  tabLabelHeader: {
    fontSize: 14,
    marginLeft: theme.spacing?.xs,
    color: theme.colors.onSurface,
  },
  
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  
  tabBadgeText: {
    color: theme.colors.onError,
    fontSize: 10,
    fontWeight: 'bold',
  },
}));