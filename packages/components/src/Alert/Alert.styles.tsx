import { StyleSheet } from 'react-native-unistyles';
import { createAlertStylesheet } from '@idealyst/theme';

export const alertContainerStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet(theme.newTheme);
  return {
    container: styles.container,
  };
});

export const alertIconStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet(theme.newTheme);
  return {
    iconContainer: styles.iconContainer,
  };
});

export const alertContentStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet(theme.newTheme);
  return {
    content: styles.content,
  };
});

export const alertTitleStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet(theme.newTheme);
  return {
    title: styles.title,
  };
});

export const alertMessageStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet(theme.newTheme);
  return {
    message: styles.message,
  };
});

export const alertActionsStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet(theme.newTheme);
  return {
    actions: styles.actions,
  };
});

export const alertCloseButtonStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet(theme.newTheme);
  return {
    closeButton: styles.closeButton,
    closeIcon: styles.closeIcon,
  };
});
