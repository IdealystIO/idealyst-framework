import { StyleSheet } from 'react-native-unistyles';
import { createAlertStylesheet } from '@idealyst/theme';

export const alertContainerStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet((theme as any).newTheme as any);
  return {
    container: styles.container,
  };
});

export const alertIconStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet((theme as any).newTheme as any);
  return {
    iconContainer: styles.iconContainer,
  };
});

export const alertContentStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet((theme as any).newTheme as any);
  return {
    content: styles.content,
  };
});

export const alertTitleStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet((theme as any).newTheme as any);
  return {
    title: styles.title,
  };
});

export const alertMessageStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet((theme as any).newTheme as any);
  return {
    message: styles.message,
  };
});

export const alertActionsStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet((theme as any).newTheme as any);
  return {
    actions: styles.actions,
  };
});

export const alertCloseButtonStyles = StyleSheet.create((theme) => {
  const styles = createAlertStylesheet((theme as any).newTheme as any);
  return {
    closeButton: styles.closeButton,
    closeIcon: styles.closeIcon,
  };
});
