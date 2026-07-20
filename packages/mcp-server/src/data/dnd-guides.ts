/**
 * DnD Package Guides
 *
 * Comprehensive documentation for @idealyst/dnd.
 */

export const dndGuides: Record<string, string> = {
  "idealyst://dnd/overview": `# @idealyst/dnd

Cross-platform drag-and-drop hooks using dnd-kit (web) and Reanimated + Gesture Handler (native).

## Installation

\`\`\`bash
yarn add @idealyst/dnd
\`\`\`

### Native (additional)

\`\`\`bash
yarn add react-native-reanimated react-native-gesture-handler
\`\`\`

## Platform Support

| Platform | Status | Backend |
|----------|--------|---------|
| Web      | \u2705 | @dnd-kit/core + @dnd-kit/sortable |
| iOS      | \u2705 | react-native-reanimated + gesture-handler |
| Android  | \u2705 | react-native-reanimated + gesture-handler |

## Key Exports

\`\`\`typescript
import {
  DndProvider,       // Context provider for drag-and-drop
  useDraggable,      // Make elements draggable
  useDroppable,      // Create drop zones
  useSortable,       // Sortable list items
  DragOverlay,       // Custom drag preview
  rectIntersection,  // Collision detection
  closestCenter,     // Collision detection
  closestCorners,    // Collision detection
} from '@idealyst/dnd';
\`\`\`

## Quick Start

\`\`\`typescript
import { DndProvider, useDraggable, useDroppable } from '@idealyst/dnd';

function App() {
  return (
    <DndProvider onDragEnd={(e) => {
      if (e.over) {
        console.log(\`Dropped \${e.active.id} on \${e.over.id}\`);
      }
    }}>
      <DraggableItem />
      <DropZone />
    </DndProvider>
  );
}

function DraggableItem() {
  const { ref, isDragging, attributes } = useDraggable({
    id: 'item-1',
    data: { label: 'Hello' },
  });
  return <div ref={ref} {...attributes} style={{ opacity: isDragging ? 0.5 : 1 }}>Drag me</div>;
}

function DropZone() {
  const { ref, isOver } = useDroppable({ id: 'zone-1' });
  return <div ref={ref} style={{ background: isOver ? '#e0ffe0' : '#f0f0f0' }}>Drop here</div>;
}
\`\`\`
`,

  "idealyst://dnd/api": `# @idealyst/dnd \u2014 API Reference

## DndProvider

Context provider that enables drag-and-drop. Wrap your app or subtree.

\`\`\`typescript
interface DndProviderProps {
  children: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragMove?: (event: DragMoveEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragCancel?: (event: DragCancelEvent) => void;
  collisionDetection?: CollisionDetector;
}
\`\`\`

## useDraggable(options)

Makes an element draggable. Returns ref, state, and accessibility attributes.

\`\`\`typescript
interface UseDraggableOptions<T extends DragData = DragData> {
  id: DndId;                    // Required: unique identifier
  data?: T;                     // Type-safe payload
  type?: string;                // Type constraint for accept filtering
  disabled?: boolean;           // Disable dragging
  activationDelay?: number;     // ms before drag starts (useful for touch)
  activationTolerance?: number; // px tolerance before abort
}

interface UseDraggableResult {
  ref: RefCallback<any>;           // Attach to draggable element
  handleRef: RefCallback<any>;     // Attach to drag handle (optional)
  isDragging: boolean;             // Currently being dragged
  isDragSource: boolean;           // Is the source of current drag
  attributes: Record<string, any>; // ARIA + event handlers
}
\`\`\`

### Usage

\`\`\`typescript
function DraggableCard({ id, title }: { id: string; title: string }) {
  const { ref, isDragging, attributes } = useDraggable({
    id,
    data: { title },
    type: 'card',
  });

  return (
    <div ref={ref} {...attributes} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {title}
    </div>
  );
}
\`\`\`

## useDroppable(options)

Creates a drop zone. Returns ref and hover state.

\`\`\`typescript
interface UseDroppableOptions<T extends DragData = DragData> {
  id: DndId;                         // Required: unique identifier
  data?: T;                          // Payload for this drop zone
  accept?: string | string[];        // Only accept these types
  disabled?: boolean;                // Disable dropping
  collisionDetector?: CollisionDetector; // Override collision detection
}

interface UseDroppableResult<T extends DragData = DragData> {
  ref: RefCallback<any>;                       // Attach to droppable element
  isOver: boolean;                             // Draggable hovering over
  isActive: boolean;                           // Any drag in progress
  activeItem: { id: DndId; data: T } | null;   // Item being dragged over
}
\`\`\`

### Usage

\`\`\`typescript
function DropZone({ id }: { id: string }) {
  const { ref, isOver, activeItem } = useDroppable({
    id,
    accept: 'card',
  });

  return (
    <div ref={ref} style={{
      background: isOver ? '#e8f5e9' : '#f5f5f5',
      border: isOver ? '2px solid green' : '2px dashed #ccc',
    }}>
      {isOver && activeItem ? \`Dropping: \${activeItem.data.title}\` : 'Drop here'}
    </div>
  );
}
\`\`\`

## useSortable(options)

Combines draggable + droppable for sortable list items.

\`\`\`typescript
interface UseSortableOptions<T extends DragData = DragData> {
  id: DndId;                    // Required: unique identifier
  index: number;                // Required: position in list
  data?: T;                     // Payload
  type?: string;                // Type constraint
  group?: string;               // Group for cross-list sorting
  disabled?: boolean;           // Disable this item
  animateLayoutChanges?: boolean; // Animate position changes (default: true)
}

interface UseSortableResult {
  ref: RefCallback<any>;        // Attach to sortable element
  handleRef: RefCallback<any>;  // Attach to sort handle (optional)
  isDragging: boolean;          // This item is being dragged
  isSorting: boolean;           // A sort is in progress in this list
  isOver: boolean;              // Another item is over this position
  style: ViewStyle;             // Transform style for repositioning
}
\`\`\`

### Usage

\`\`\`typescript
function SortableItem({ id, index, label }: Props) {
  const { ref, isDragging, style } = useSortable({
    id,
    index,
    data: { label },
  });

  return (
    <div ref={ref} style={{
      ...style,
      opacity: isDragging ? 0.5 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    }}>
      {label}
    </div>
  );
}
\`\`\`

## DragOverlay

Custom drag preview that follows the pointer during drag.

\`\`\`typescript
interface DragOverlayProps {
  children?: ReactNode | ((activeItem: { id: DndId; data: DragData } | null) => ReactNode);
  dropAnimation?: { duration?: number; easing?: string } | null;
  style?: ViewStyle;
}
\`\`\`

### Usage

\`\`\`typescript
<DragOverlay>
  {(active) => active ? <Card>{String(active.data.title)}</Card> : null}
</DragOverlay>
\`\`\`

## Event Types

\`\`\`typescript
type DndId = string | number;

interface DragData {
  [key: string]: unknown;
}

interface DragStartEvent<T extends DragData = DragData> {
  active: { id: DndId; data: T };
}

interface DragMoveEvent<T extends DragData = DragData> {
  active: { id: DndId; data: T };
  over: { id: DndId; data: DragData } | null;
  delta: { x: number; y: number };
}

interface DragEndEvent<T extends DragData = DragData> {
  active: { id: DndId; data: T };
  over: { id: DndId; data: DragData } | null;
  canceled: boolean;
}
\`\`\`

## Collision Detection

Three built-in collision detectors:

\`\`\`typescript
import { rectIntersection, closestCenter, closestCorners } from '@idealyst/dnd';

// Use on provider (global) or per-droppable
<DndProvider collisionDetection={closestCenter}>

// Or per-droppable
const { ref } = useDroppable({
  id: 'zone',
  collisionDetector: closestCorners,
});
\`\`\`

- **rectIntersection** \u2014 First droppable whose rect overlaps (default)
- **closestCenter** \u2014 Droppable with nearest center point
- **closestCorners** \u2014 Droppable with nearest corner
`,

  "idealyst://dnd/examples": `# @idealyst/dnd \u2014 Examples

## Kanban Board (Free-form Drag and Drop)

\`\`\`typescript
import { DndProvider, useDraggable, useDroppable } from '@idealyst/dnd';
import type { DragEndEvent } from '@idealyst/dnd';

interface Task { id: string; title: string }

function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: [{ id: '1', title: 'Design UI' }, { id: '2', title: 'Write tests' }],
    done: [{ id: '3', title: 'Setup project' }],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || event.canceled) return;

    const target = over.id as 'todo' | 'done';
    setColumns((prev) => {
      const source = Object.keys(prev).find((key) =>
        prev[key as keyof typeof prev].some((t) => t.id === active.id)
      ) as keyof typeof prev;

      if (!source || source === target) return prev;
      const task = prev[source].find((t) => t.id === active.id)!;

      return {
        ...prev,
        [source]: prev[source].filter((t) => t.id !== active.id),
        [target]: [...prev[target], task],
      };
    });
  };

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <View direction="row" gap="md">
        <Column id="todo" title="To Do" tasks={columns.todo} />
        <Column id="done" title="Done" tasks={columns.done} />
      </View>
    </DndProvider>
  );
}

function TaskCard({ id, title }: Task) {
  const { ref, isDragging, attributes } = useDraggable({ id, data: { title } });
  return (
    <Card ref={ref} {...attributes} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Text>{title}</Text>
    </Card>
  );
}

function Column({ id, title, tasks }: { id: string; title: string; tasks: Task[] }) {
  const { ref, isOver } = useDroppable({ id });
  return (
    <View ref={ref} style={{ background: isOver ? '#e8f5e9' : '#f5f5f5' }}>
      <Text typography="h6">{title}</Text>
      {tasks.map((task) => <TaskCard key={task.id} {...task} />)}
    </View>
  );
}
\`\`\`

## Sortable List

\`\`\`typescript
import { DndProvider, useSortable } from '@idealyst/dnd';
import type { DragEndEvent } from '@idealyst/dnd';

function SortableList() {
  const [items, setItems] = useState([
    { id: 'a', label: 'First' },
    { id: 'b', label: 'Second' },
    { id: 'c', label: 'Third' },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const next = [...prev];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return next;
    });
  };

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      {items.map((item, index) => (
        <SortableItem key={item.id} id={item.id} index={index} label={item.label} />
      ))}
    </DndProvider>
  );
}

function SortableItem({ id, index, label }: { id: string; index: number; label: string }) {
  const { ref, isDragging, style } = useSortable({ id, index, data: { label } });

  return (
    <View ref={ref} style={[style, { opacity: isDragging ? 0.5 : 1 }]}>
      <Text>{label}</Text>
    </View>
  );
}
\`\`\`

## Drag Overlay (Custom Preview)

\`\`\`typescript
import { DndProvider, useDraggable, DragOverlay } from '@idealyst/dnd';

function DragOverlayExample() {
  const [activeId, setActiveId] = useState<DndId | null>(null);

  return (
    <DndProvider
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={() => setActiveId(null)}
    >
      <DraggableCard id="card-1" title="Drag me" />
      <DraggableCard id="card-2" title="Or me" />

      <DragOverlay>
        {(active) => active ? (
          <Card intent="primary" elevation="lg">
            <Text color="onPrimary">{String(active.data.title)}</Text>
          </Card>
        ) : null}
      </DragOverlay>
    </DndProvider>
  );
}
\`\`\`

## Type-Safe Drag Data

\`\`\`typescript
import { useDraggable, useDroppable } from '@idealyst/dnd';
import type { DragData } from '@idealyst/dnd';

interface FileData extends DragData {
  name: string;
  size: number;
  type: 'image' | 'document' | 'video';
}

function DraggableFile({ file }: { file: FileData }) {
  const { ref, isDragging, attributes } = useDraggable<FileData>({
    id: file.name,
    data: file,
    type: file.type, // Only drops on zones that accept this type
  });
  // ...
}

function ImageDropZone() {
  const { ref, isOver, activeItem } = useDroppable<FileData>({
    id: 'image-zone',
    accept: 'image', // Only accepts type='image'
  });
  // activeItem?.data.name is type-safe!
}
\`\`\`
`,
};
