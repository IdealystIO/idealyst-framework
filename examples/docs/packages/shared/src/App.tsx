import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { DocsRouter } from './navigation/DocsRouter';

export function DocsApp() {
  return (
    <NavigatorProvider route={DocsRouter} />
  );
}
