# @idealyst/dnd

Cross-platform drag-and-drop hooks for React and React Native.

- **Web**: Powered by [dnd-kit](https://dndkit.com/)
- **Native**: Custom implementation using react-native-reanimated + react-native-gesture-handler

## Installation

```bash
yarn add @idealyst/dnd
```

### Native (additional)

```bash
yarn add react-native-reanimated react-native-gesture-handler
```

## Quick Start

```tsx
import { DndProvider, useDraggable, useDroppable } from '@idealyst/dnd';

function App() {
  return (
    <DndProvider onDragEnd={(e) => console.log('Dropped:', e)}>
      <DraggableItem />
      <DropZone />
    </DndProvider>
  );
}

function DraggableItem() {
  const { ref, isDragging } = useDraggable({ id: 'item-1', data: { label: 'Hello' } });
  return <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>Drag me</div>;
}

function DropZone() {
  const { ref, isOver } = useDroppable({ id: 'zone-1' });
  return <div ref={ref} style={{ background: isOver ? '#e0ffe0' : '#f0f0f0' }}>Drop here</div>;
}
```
