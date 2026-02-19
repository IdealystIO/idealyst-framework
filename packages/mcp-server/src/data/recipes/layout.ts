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
        <Text typography="h5" weight="bold">Modal Title</Text>
        <Text typography="body1" style={{ marginTop: 8 }}>Modal content goes here.</Text>
        <Button onPress={() => setIsOpen(false)} style={{ marginTop: 16 }}>Close</Button>
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

const AnimatedView = withAnimated(View);

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
    exit: { transform: { y: 400 } },
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
    code: `import React from 'react';
import { View, Skeleton } from '@idealyst/components';

// Card-shaped skeleton placeholder
export function CardSkeleton() {
  return (
    <View style={{ padding: 16, gap: 12, backgroundColor: '#fff', borderRadius: 8 }}>
      <Skeleton width="60%" height={20} animation="pulse" />
      <Skeleton width="100%" height={14} animation="pulse" />
      <Skeleton width="80%" height={14} animation="pulse" />
    </View>
  );
}

// List of skeleton cards
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

// Profile-style skeleton with avatar
export function ProfileSkeleton() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Skeleton width={48} height={48} shape="circle" />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton width="50%" height={16} />
        <Skeleton width="30%" height={12} />
      </View>
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
    explanation: `Skeleton loading using @idealyst/components Skeleton:
- Built-in pulse/wave animations (no manual Animated API needed)
- shape: 'rectangle' | 'circle' | 'rounded'
- animation: 'pulse' | 'wave' | 'none'
- Composable for any layout pattern`,
    tips: [
      "Match skeleton dimensions to actual content for seamless transition",
      "Use shape='circle' for avatar placeholders",
      "Use animation='wave' for a shimmer effect, 'pulse' for fade",
      "Wrap multiple skeletons in a View with gap for consistent spacing",
    ],
    relatedRecipes: ["data-list"],
  },

  "shadow-card": {
    name: "Shadow Card",
    description: "Cross-platform card with consistent shadows on web, iOS, and Android",
    category: "layout",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme"],
    code: `import React from 'react';
import { View, Text } from '@idealyst/components';
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
      <Text color="inverse">{children}</Text>
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
import type { IconName } from '@idealyst/components';
import { withAnimated, usePresence } from '@idealyst/animate';
import { shadow } from '@idealyst/theme';

const AnimatedView = withAnimated(View);

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const toastConfig: Record<ToastType, { icon: IconName; color: string }> = {
  success: { icon: 'check-circle', color: '#22c55e' },
  error: { icon: 'alert-circle', color: '#ef4444' },
  info: { icon: 'information', color: '#3b82f6' },
  warning: { icon: 'alert', color: '#f59e0b' },
};

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

  const config = toastConfig[toast.type];

  return (
    <AnimatedView style={[{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: config.color,
    }, shadow({ radius: 8, y: 2, opacity: 0.1 }), style]}>
      <Icon name={config.icon} size={20} />
      <Text typography="body2" style={{ flex: 1, marginLeft: 12 }}>{toast.message}</Text>
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
- Multiple toast types with colors and icons
- Slide-in animation
- Uses IconName type for type-safe icon references`,
    tips: [
      "Position at top for mobile, bottom-right for desktop",
      "Limit to 3-5 visible toasts",
      "Allow manual dismiss",
      "Type icon props as IconName, never as string",
    ],
    relatedRecipes: ["modal-animation", "slide-up-sheet"],
  },
};
