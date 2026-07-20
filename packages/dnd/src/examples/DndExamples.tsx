import React, { useState, useCallback } from 'react';
import {
  DndProvider,
  useDraggable,
  useDroppable,
  useSortable,
  DragOverlay,
} from '../index';
import type { DragEndEvent, DndId } from '../types';

// ── Example 1: Free-form Drag and Drop ─────────────────────────────

interface Item {
  id: string;
  label: string;
}

function DraggableItem({ id, label }: { id: string; label: string }) {
  const { ref, isDragging, attributes } = useDraggable({
    id,
    data: { label },
  });

  return (
    <div
      ref={ref}
      {...attributes}
      style={{
        padding: 12,
        marginBottom: 8,
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 8,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {label}
    </div>
  );
}

function DropZone({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: Item[];
}) {
  const { ref, isOver } = useDroppable({ id });

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        padding: 16,
        minHeight: 200,
        background: isOver ? '#e8f5e9' : '#f5f5f5',
        borderRadius: 12,
        border: `2px dashed ${isOver ? '#4caf50' : '#ccc'}`,
        transition: 'all 200ms ease',
      }}
    >
      <h3 style={{ margin: '0 0 12px' }}>{title}</h3>
      {items.map((item) => (
        <DraggableItem key={item.id} id={item.id} label={item.label} />
      ))}
    </div>
  );
}

export function DragDropDemo() {
  const [columns, setColumns] = useState({
    todo: [
      { id: '1', label: 'Design UI mockups' },
      { id: '2', label: 'Write unit tests' },
    ],
    done: [{ id: '3', label: 'Setup project' }],
  });

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || event.canceled) return;

    const targetColumn = over.id as keyof typeof columns;
    if (!['todo', 'done'].includes(targetColumn)) return;

    setColumns((prev) => {
      const sourceColumn = Object.keys(prev).find((key) =>
        prev[key as keyof typeof prev].some((i) => i.id === active.id),
      ) as keyof typeof prev | undefined;

      if (!sourceColumn || sourceColumn === targetColumn) return prev;

      const item = prev[sourceColumn].find((i) => i.id === active.id);
      if (!item) return prev;

      return {
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((i) => i.id !== active.id),
        [targetColumn]: [...prev[targetColumn], item],
      };
    });
  }, []);

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: 16 }}>
        <DropZone id="todo" title="To Do" items={columns.todo} />
        <DropZone id="done" title="Done" items={columns.done} />
      </div>
    </DndProvider>
  );
}

// ── Example 2: Sortable List ───────────────────────────────────────

function SortableItem({ id, index, label }: { id: string; index: number; label: string }) {
  const { ref, isDragging, style } = useSortable({
    id,
    index,
    data: { label },
  });

  return (
    <div
      ref={ref}
      style={{
        ...style,
        padding: 12,
        marginBottom: 8,
        background: isDragging ? '#e3f2fd' : '#fff',
        border: `1px solid ${isDragging ? '#2196f3' : '#ddd'}`,
        borderRadius: 8,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'transform 200ms ease',
      }}
    >
      {label}
    </div>
  );
}

export function SortableDemo() {
  const [items, setItems] = useState([
    { id: 'a', label: 'First item' },
    { id: 'b', label: 'Second item' },
    { id: 'c', label: 'Third item' },
    { id: 'd', label: 'Fourth item' },
  ]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || event.canceled || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const next = [...prev];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return next;
    });
  }, []);

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div style={{ maxWidth: 400 }}>
        {items.map((item, index) => (
          <SortableItem
            key={item.id}
            id={item.id}
            index={index}
            label={item.label}
          />
        ))}
      </div>
    </DndProvider>
  );
}

// ── Example 3: Drag Overlay ────────────────────────────────────────

export function DragOverlayDemo() {
  const [activeId, setActiveId] = useState<DndId | null>(null);

  const items = [
    { id: 'card-1', label: 'Drag me!' },
    { id: 'card-2', label: 'Or me!' },
  ];

  return (
    <DndProvider
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={() => setActiveId(null)}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        {items.map((item) => {
          const Component = () => {
            const { ref, isDragging, attributes } = useDraggable({
              id: item.id,
              data: { label: item.label },
            });
            return (
              <div
                ref={ref}
                {...attributes}
                style={{
                  padding: 24,
                  background: '#fff',
                  border: '2px solid #1976d2',
                  borderRadius: 12,
                  opacity: isDragging ? 0.3 : 1,
                  cursor: 'grab',
                }}
              >
                {item.label}
              </div>
            );
          };
          return <Component key={item.id} />;
        })}
      </div>

      <DragOverlay>
        {(active) =>
          active ? (
            <div
              style={{
                padding: 24,
                background: '#1976d2',
                color: '#fff',
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              {String(active.data.label)}
            </div>
          ) : null
        }
      </DragOverlay>
    </DndProvider>
  );
}

// ── Combined Export ─────────────────────────────────────────────────

export function DndExamples() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, padding: 24 }}>
      <section>
        <h2>Drag and Drop (Kanban)</h2>
        <DragDropDemo />
      </section>

      <section>
        <h2>Sortable List</h2>
        <SortableDemo />
      </section>

      <section>
        <h2>Drag Overlay</h2>
        <DragOverlayDemo />
      </section>
    </div>
  );
}
