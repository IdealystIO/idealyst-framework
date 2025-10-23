import { StyleSheet } from 'react-native-unistyles';
import { createBreadcrumbStylesheet } from '@idealyst/theme';

export const breadcrumbContainerStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet(theme.newTheme);
  return {
    container: breadcrumbStyles.container,
  };
});

export const breadcrumbItemStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet(theme.newTheme);
  return {
    item: breadcrumbStyles.item,
    itemText: breadcrumbStyles.itemText,
    icon: breadcrumbStyles.icon,
  };
});

export const breadcrumbSeparatorStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet(theme.newTheme);
  return {
    separator: breadcrumbStyles.separator,
  };
});

export const breadcrumbEllipsisStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet(theme.newTheme);
  return {
    ellipsis: breadcrumbStyles.ellipsis,
    icon: breadcrumbStyles.ellipsisIcon,
  };
});

export const breadcrumbMenuButtonStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet(theme.newTheme);
  return {
    button: breadcrumbStyles.menuButton,
    icon: breadcrumbStyles.menuButtonIcon,
  };
});
