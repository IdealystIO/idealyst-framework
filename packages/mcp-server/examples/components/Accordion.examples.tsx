/**
 * Accordion Component Examples
 *
 * These examples are type-checked against the actual AccordionProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Accordion, Text } from '@idealyst/components';
import type { AccordionItem } from '@idealyst/components';

// Example 1: Basic Accordion
export function BasicAccordion() {
  const items: AccordionItem[] = [
    {
      id: '1',
      title: 'What is React?',
      content: 'React is a JavaScript library for building user interfaces.',
    },
    {
      id: '2',
      title: 'What is TypeScript?',
      content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
    },
    {
      id: '3',
      title: 'What is Idealyst?',
      content: 'Idealyst is a cross-platform component framework for React and React Native.',
    },
  ];

  return <Accordion items={items} />;
}

// Example 2: Accordion Types
export function AccordionTypes() {
  const items: AccordionItem[] = [
    {
      id: '1',
      title: 'Item 1',
      content: 'Content for item 1',
    },
    {
      id: '2',
      title: 'Item 2',
      content: 'Content for item 2',
    },
  ];

  return (
    <>
      <Accordion items={items} type="standard" />
      <Accordion items={items} type="separated" />
      <Accordion items={items} type="bordered" />
    </>
  );
}

// Example 3: Accordion with Default Expanded Items
export function AccordionDefaultExpanded() {
  const items: AccordionItem[] = [
    {
      id: '1',
      title: 'Expanded by Default',
      content: 'This item is expanded by default.',
    },
    {
      id: '2',
      title: 'Collapsed by Default',
      content: 'This item is collapsed by default.',
    },
  ];

  return <Accordion items={items} defaultExpanded={['1']} />;
}

// Example 4: Accordion Sizes
export function AccordionSizes() {
  const items: AccordionItem[] = [
    {
      id: '1',
      title: 'Item',
      content: 'Content',
    },
  ];

  return (
    <>
      <Accordion items={items} size="xs" />
      <Accordion items={items} size="sm" />
      <Accordion items={items} size="md" />
      <Accordion items={items} size="lg" />
      <Accordion items={items} size="xl" />
    </>
  );
}

// Example 5: Single Expand Mode
export function SingleExpandAccordion() {
  const items: AccordionItem[] = [
    {
      id: '1',
      title: 'Item 1',
      content: 'Only one item can be expanded at a time.',
    },
    {
      id: '2',
      title: 'Item 2',
      content: 'Opening this will close others.',
    },
    {
      id: '3',
      title: 'Item 3',
      content: 'Single expand mode.',
    },
  ];

  return <Accordion items={items} allowMultiple={false} />;
}

// Example 6: Accordion with Default Expanded
export function AccordionWithDefaultExpanded() {
  const items: AccordionItem[] = [
    {
      id: '1',
      title: 'Default Expanded Item',
      content: 'This item starts expanded by default.',
    },
    {
      id: '2',
      title: 'Collapsed Item',
      content: 'This item starts collapsed.',
    },
    {
      id: '3',
      title: 'Another Item',
      content: 'This item also starts collapsed.',
    },
  ];

  return (
    <Accordion
      items={items}
      defaultExpanded={['1']}
    />
  );
}
