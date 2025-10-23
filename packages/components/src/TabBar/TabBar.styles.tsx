import { StyleSheet } from 'react-native-unistyles';
import { createTabBarStylesheet } from '@idealyst/theme';

export const tabBarContainerStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet((theme as any).newTheme as any);
  return {
    container: tabBarStyles.container,
  };
});

export const tabBarTabStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet((theme as any).newTheme as any);
  return {
    tab: tabBarStyles.tab,
  };
});

export const tabBarLabelStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet((theme as any).newTheme as any);
  return {
    tabLabel: tabBarStyles.tabLabel,
  };
});

export const tabBarIndicatorStyles = StyleSheet.create((theme) => {
  const tabBarStyles = createTabBarStylesheet((theme as any).newTheme as any);
  return {
    indicator: tabBarStyles.indicator,
  };
});
