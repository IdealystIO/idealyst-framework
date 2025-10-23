import { StyleSheet } from 'react-native-unistyles';
import { createBreadcrumbStylesheet } from '@idealyst/theme';

export const breadcrumbContainerStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet((theme as any).newTheme as any);
  return {
    container: breadcrumbStyles.container,
  };
});

export const breadcrumbItemStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet((theme as any).newTheme as any);
  return {
    item: breadcrumbStyles.item,
    itemText: breadcrumbStyles.itemText,
    icon: breadcrumbStyles.icon,
  };
});

export const breadcrumbSeparatorStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet((theme as any).newTheme as any);
  return {
    separator: breadcrumbStyles.separator,
  };
});

export const breadcrumbEllipsisStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet((theme as any).newTheme as any);
  return {
    ellipsis: breadcrumbStyles.ellipsis,
    icon: breadcrumbStyles.ellipsisIcon,
  };
});

export const breadcrumbMenuButtonStyles = StyleSheet.create((theme) => {
  const breadcrumbStyles = createBreadcrumbStylesheet((theme as any).newTheme as any);
  return {
    button: breadcrumbStyles.menuButton,
    icon: breadcrumbStyles.menuButtonIcon,
  };
});
