import { StyleSheet } from 'react-native-unistyles';
import { createTabBarStylesheet } from '@idealyst/theme';

export const tabBarContainerStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet(theme.newTheme);
  return {
    container: tabBarStyles.container,
  };
});

export const tabBarTabStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet(theme.newTheme);
  return {
    tab: tabBarStyles.tab,
  };
});

export const tabBarLabelStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet(theme.newTheme);
  return {
    tabLabel: tabBarStyles.tabLabel,
  };
});

export const tabBarIndicatorStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet(theme.newTheme);
  return {
    indicator: tabBarStyles.indicator,
  };
});
