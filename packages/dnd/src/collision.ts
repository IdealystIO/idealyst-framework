import type { CollisionDetector, CollisionRect, DndId } from './types';

function intersects(a: CollisionRect, b: CollisionRect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function centerOf(rect: CollisionRect): { x: number; y: number } {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

function distanceBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function cornersOf(
  rect: CollisionRect,
): [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }] {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x, y: rect.y + rect.height },
    { x: rect.x + rect.width, y: rect.y + rect.height },
  ];
}

/** Returns the first droppable whose rect overlaps with the active rect. */
export const rectIntersection: CollisionDetector = ({ active, droppables }) => {
  for (const droppable of droppables) {
    if (intersects(active, droppable.rect)) {
      return droppable.id;
    }
  }
  return null;
};

/** Returns the droppable whose center is closest to the active rect's center. */
export const closestCenter: CollisionDetector = ({ active, droppables }) => {
  const ac = centerOf(active);
  let closestId: DndId | null = null;
  let minDist = Infinity;

  for (const droppable of droppables) {
    const dist = distanceBetween(ac, centerOf(droppable.rect));
    if (dist < minDist) {
      minDist = dist;
      closestId = droppable.id;
    }
  }

  return closestId;
};

/** Returns the droppable with the nearest corner to any corner of the active rect. */
export const closestCorners: CollisionDetector = ({ active, droppables }) => {
  const activeCorners = cornersOf(active);
  let closestId: DndId | null = null;
  let minDist = Infinity;

  for (const droppable of droppables) {
    const dropCorners = cornersOf(droppable.rect);
    for (const ac of activeCorners) {
      for (const dc of dropCorners) {
        const dist = distanceBetween(ac, dc);
        if (dist < minDist) {
          minDist = dist;
          closestId = droppable.id;
        }
      }
    }
  }

  return closestId;
};
