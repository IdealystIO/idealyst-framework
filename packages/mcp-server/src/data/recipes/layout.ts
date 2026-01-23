/**
 * Layout Recipes - Modals, animations, toasts, and visual patterns
 */

import { Recipe } from "./types.js";

export const layoutRecipes: Record<string, Recipe> = {
  "modal-animation": {
    name: "Animated Modal",
    description: "Modal with fade and scale animation using usePresence",
    category: "layout",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/animate"],
    code: `import React, { useState } from 'react';
import { View, Text, Button, Pressable } from '@idealyst/components';
import { withAnimated, usePresence } from '@idealyst/animate';

const AnimatedView = withAnimated(View);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AnimatedModal({ isOpen, onClose, children }: ModalProps) {
  const backdrop = usePresence(isOpen, {
    enter: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 'fast',
  });

  const content = usePresence(isOpen, {
    enter: { opacity: 1, transform: { scale: 1, y: 0 } },
    exit: { opacity: 0, transform: { scale: 0.95, y: -20 } },
    duration: 'normal',
    easing: 'easeOut',
  });

  if (!backdrop.isPresent) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Pressable onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <AnimatedView style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, backdrop.style]} />
      </Pressable>

      <AnimatedView style={[{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxWidth: 400,
      }, content.style]}>
        {children}
      </AnimatedView>
    </View>
  );
}

// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Button onPress={() => setIsOpen(true)}>Open Modal</Button>

      <AnimatedModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Text variant="title">Modal Title</Text>
        <Text>Modal content goes here.</Text>
        <Button onPress={() => setIsOpen(false)}>Close</Button>
      </AnimatedModal>
    </View>
  );
}`,
    explanation: `Animated modal with:
- Fade backdrop animation
- Scale and slide content animation
- usePresence handles mount/unmount
- Tap backdrop to dismiss`,
    tips: [
      "Use 'fast' duration for backdrop, 'normal' for content",
      "Add keyboard dismiss for mobile",
      "Consider focus trap for accessibility",
    ],
    relatedRecipes: ["slide-up-sheet", "toast-notification"],
  },

  "slide-up-sheet": {
    name: "Slide-up Sheet",
    description: "Bottom sheet that slides up with gesture support",
    category: "layout",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/animate"],
    code: `import React from 'react';
import { View, Text, Pressable } from '@idealyst/components';
import { withAnimated, usePresence } from '@idealyst/animate';
import { Dimensions } from 'react-native';

const AnimatedView = withAnimated(View);
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SlideUpSheet({ isOpen, onClose, children }: SheetProps) {
  const backdrop = usePresence(isOpen, {
    enter: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 'fast',
  });

  const sheet = usePresence(isOpen, {
    enter: { transform: { y: 0 } },
    exit: { transform: { y: SCREEN_HEIGHT * 0.6 } },
    duration: 'normal',
    easing: 'easeOut',
  });

  if (!backdrop.isPresent) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Pressable onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <AnimatedView style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, backdrop.style]} />
      </Pressable>

      <AnimatedView style={[{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        maxHeight: '60%',
      }, sheet.style]}>
        <View style={{ width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 2, alignSelf: 'center', marginBottom: 16 }} />
        {children}
      </AnimatedView>
    </View>
  );
}`,
    explanation: `Bottom sheet with:
- Slide-up animation from bottom
- Backdrop fade
- Drag handle indicator
- Tap backdrop to dismiss`,
    tips: [
      "Add pan gesture for drag-to-dismiss",
      "Use different sheet heights for different content",
      "Consider snap points for multi-height sheets",
    ],
    relatedRecipes: ["modal-animation", "toast-notification"],
  },

  "skeleton-loading": {
    name: "Skeleton Loading",
    description: "Placeholder skeleton UI while content loads",
    category: "layout",
    difficulty: "beginner",
    packages: ["@idealyst/components"],
    code: `import React, { useEffect, useRef } from 'react';
import { Animated, View as RNView, StyleSheet } from 'react-native';
import { View, Text } from '@idealyst/components';

function Skeleton({ width, height, style }: { width: number | string; height: number; style?: any }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <RNView style={[{ width, height, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#f3f4f6', transform: [{ translateX }] }]} />
    </RNView>
  );
}

export function CardSkeleton() {
  return (
    <View style={{ padding: 16, gap: 12, backgroundColor: '#fff', borderRadius: 8 }}>
      <Skeleton width="60%" height={20} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="80%" height={14} />
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

// Usage
function DataScreen() {
  const { data, isLoading } = useData();

  if (isLoading) {
    return <ListSkeleton count={3} />;
  }

  return <ActualContent data={data} />;
}`,
    explanation: `Skeleton loading with:
- Shimmer animation effect
- Composable skeleton components
- Matches actual content dimensions`,
    tips: [
      "Match skeleton dimensions to actual content",
      "Use subtle gray colors (#e5e7eb background, #f3f4f6 shimmer)",
      "Show multiple skeletons to indicate list",
    ],
    relatedRecipes: ["data-list", "fade-in-component"],
  },

  "shadow-card": {
    name: "Shadow Card",
    description: "Cross-platform card with consistent shadows on web, iOS, and Android",
    category: "layout",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme"],
    code: `import { View, Text } from '@idealyst/components';
import { shadow } from '@idealyst/theme';

// Basic shadowed card
export function ShadowCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={[
      { backgroundColor: '#ffffff', borderRadius: 12, padding: 16 },
      shadow({ radius: 10, y: 4, opacity: 0.15 }),
    ]}>
      {children}
    </View>
  );
}

// Elevated card with larger shadow
export function ElevatedCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={[
      { backgroundColor: '#ffffff', borderRadius: 16, padding: 20 },
      shadow({ radius: 20, y: 8, opacity: 0.2 }),
    ]}>
      {children}
    </View>
  );
}

// Colored shadow (brand accent)
export function AccentCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={[
      { backgroundColor: '#3b82f6', borderRadius: 12, padding: 16 },
      shadow({ radius: 16, y: 6, color: '#3b82f6', opacity: 0.4 }),
    ]}>
      <Text style={{ color: '#ffffff' }}>{children}</Text>
    </View>
  );
}`,
    explanation: `The shadow() utility creates consistent shadows across all platforms:

**Parameters:**
- radius - Shadow size/blur (default: 10)
- x - Horizontal offset (default: 0)
- y - Vertical offset (default: 4)
- color - Shadow color (default: '#000000')
- opacity - Shadow opacity 0-1 (default: 0.15)

**Platform handling:**
- Web: CSS boxShadow with blur and spread
- iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
- Android: elevation + shadowColor with alpha`,
    tips: [
      "Use subtle shadows (opacity 0.1-0.2) for most UI elements",
      "Increase radius and y offset together for more 'elevation'",
      "Colored shadows work great for accent/brand elements",
      "Android elevation is approximated from radius (elevation = radius / 3)",
    ],
    relatedRecipes: ["modal-animation"],
  },

  "toast-notification": {
    name: "Toast Notification",
    description: "Auto-dismissing toast messages with animations",
    category: "layout",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/animate"],
    code: `import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, Icon, Pressable } from '@idealyst/components';
import { withAnimated, usePresence } from '@idealyst/animate';

const AnimatedView = withAnimated(View);

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={{ position: 'absolute', top: 50, left: 16, right: 16, gap: 8 }}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { style, isPresent } = usePresence(true, {
    enter: { opacity: 1, transform: { y: 0 } },
    exit: { opacity: 0, transform: { y: -20 } },
    duration: 'fast',
  });

  const icons = { success: 'check-circle', error: 'alert-circle', info: 'information', warning: 'alert' };
  const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };

  return (
    <AnimatedView style={[{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors[toast.type],
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }, style]}>
      <Icon name={icons[toast.type]} size={20} color={colors[toast.type]} />
      <Text style={{ flex: 1, marginLeft: 12 }}>{toast.message}</Text>
      <Pressable onPress={onDismiss}>
        <Icon name="close" size={16} />
      </Pressable>
    </AnimatedView>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}`,
    explanation: `Toast notification system with:
- Context-based toast management
- Auto-dismiss after 3 seconds
- Multiple toast types with colors
- Slide-in animation`,
    tips: [
      "Position at top for mobile, bottom-right for desktop",
      "Limit to 3-5 visible toasts",
      "Allow manual dismiss",
    ],
    relatedRecipes: ["modal-animation", "slide-up-sheet"],
  },
};
