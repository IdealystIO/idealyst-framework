import type { ReactNode, RefCallback } from 'react';
import type { ViewStyle } from 'react-native';

// ── Core Identifiers ───────────────────────────────────────────────

export type DndId = string | number;

/**
 * Base type for drag data payloads. Extend for type-safe drag data.
 *
 * @example
 * interface TaskData extends DragData {
 *   title: string;
 *   priority: 'low' | 'medium' | 'high';
 * }
 *
 * const { ref } = useDraggable<TaskData>({
 *   id: 'task-1',
 *   data: { title: 'Fix bug', priority: 'high' },
 * });
 */
export interface DragData {
  [key: string]: unknown;
}

// ── Event Types ────────────────────────────────────────────────────

export interface DragStartEvent<T extends DragData = DragData> {
  active: { id: DndId; data: T };
}

export interface DragMoveEvent<T extends DragData = DragData> {
  active: { id: DndId; data: T };
  over: { id: DndId; data: DragData } | null;
  delta: { x: number; y: number };
}

export interface DragEndEvent<T extends DragData = DragData> {
  active: { id: DndId; data: T };
  over: { id: DndId; data: DragData } | null;
  canceled: boolean;
}

export interface DragCancelEvent<T extends DragData = DragData> {
  active: { id: DndId; data: T };
}

// ── Provider Props ─────────────────────────────────────────────────

export interface DndProviderProps {
  children: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragMove?: (event: DragMoveEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragCancel?: (event: DragCancelEvent) => void;
  collisionDetection?: CollisionDetector;
}

// ── Hook Options ───────────────────────────────────────────────────

export interface UseDraggableOptions<T extends DragData = DragData> {
  id: DndId;
  data?: T;
  type?: string;
  disabled?: boolean;
  activationDelay?: number;
  activationTolerance?: number;
}

export interface UseDroppableOptions<T extends DragData = DragData> {
  id: DndId;
  data?: T;
  accept?: string | string[];
  disabled?: boolean;
  collisionDetector?: CollisionDetector;
}

export interface UseSortableOptions<T extends DragData = DragData> {
  id: DndId;
  index: number;
  data?: T;
  type?: string;
  group?: string;
  disabled?: boolean;
  animateLayoutChanges?: boolean;
}

// ── Hook Results ───────────────────────────────────────────────────

export interface UseDraggableResult {
  ref: RefCallback<any>;
  handleRef: RefCallback<any>;
  isDragging: boolean;
  isDragSource: boolean;
  attributes: Record<string, any>;
}

export interface UseDroppableResult<T extends DragData = DragData> {
  ref: RefCallback<any>;
  isOver: boolean;
  isActive: boolean;
  activeItem: { id: DndId; data: T } | null;
}

export interface UseSortableResult {
  ref: RefCallback<any>;
  handleRef: RefCallback<any>;
  isDragging: boolean;
  isSorting: boolean;
  isOver: boolean;
  style: ViewStyle;
}

// ── Drag Overlay ───────────────────────────────────────────────────

export interface DragOverlayProps {
  children?:
    | ReactNode
    | ((activeItem: { id: DndId; data: DragData } | null) => ReactNode);
  dropAnimation?: { duration?: number; easing?: string } | null;
  style?: ViewStyle;
}

// ── Collision Detection ────────────────────────────────────────────

export interface CollisionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CollisionDetector = (args: {
  active: CollisionRect;
  droppables: Array<{ id: DndId; rect: CollisionRect }>;
}) => DndId | null;
