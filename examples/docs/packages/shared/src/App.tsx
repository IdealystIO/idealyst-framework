import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { TranslateProvider } from '@idealyst/translate';
import { DocsRouter } from './navigation/DocsRouter';
import { translateConfig } from './translate';

export function DocsApp() {
  return (
    <TranslateProvider config={translateConfig}>
      <NavigatorProvider route={DocsRouter} />
    </TranslateProvider>
  );
}
