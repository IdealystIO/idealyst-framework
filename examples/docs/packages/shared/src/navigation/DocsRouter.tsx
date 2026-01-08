import React from 'react';
import { NavigatorParam, ScreenOptions } from '@idealyst/navigation';

// Import page components
import { HomePage } from '../pages/Home';
import { InstallationPage } from '../pages/Installation';
import { ThemeOverviewPage } from '../pages/theme/Overview';
import { StyleDefinitionPage } from '../pages/theme/StyleDefinition';
import { ComponentsOverviewPage } from '../pages/components/Overview';
import { DocsLayout } from '../components/DocsLayout';
import { DocsSidebar } from '../components/DocsSidebar';

// Navigation sections for sidebar
export const navigationSections = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', path: '/' },
      { label: 'Installation', path: '/installation' },
    ],
  },
  {
    title: 'Theme',
    items: [
      { label: 'Overview', path: '/theme/overview' },
      { label: 'Style Definition', path: '/theme/style-definition' },
    ],
  },
  {
    title: 'Components',
    items: [
      { label: 'Overview', path: '/components/overview' },
    ],
  },
];

/**
 * Documentation site navigation router
 */
export const DocsRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'drawer',
  sidebarComponent: DocsSidebar,
  layoutComponent: DocsLayout,
  options: {
    headerShown: false,
  },
  routes: [
    { path: '/', type: 'screen', component: HomePage, options: { title: 'Introduction' } },
    { path: 'installation', type: 'screen', component: InstallationPage, options: { title: 'Installation' } },
    { path: 'theme/overview', type: 'screen', component: ThemeOverviewPage, options: { title: 'Theme Overview' } },
    { path: 'theme/style-definition', type: 'screen', component: StyleDefinitionPage, options: { title: 'Style Definition' } },
    { path: 'components/overview', type: 'screen', component: ComponentsOverviewPage, options: { title: 'Components Overview' } },
  ],
};

export default DocsRouter;
