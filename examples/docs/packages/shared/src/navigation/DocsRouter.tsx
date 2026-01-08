import React from 'react';
import { NavigatorParam, ScreenOptions } from '@idealyst/navigation';

// Import page components
import { HomePage } from '../pages/Home';
import { InstallationPage } from '../pages/Installation';
import { ThemeOverviewPage } from '../pages/theme/Overview';
import { StyleDefinitionPage } from '../pages/theme/StyleDefinition';
import { StyleExtensionsPage } from '../pages/theme/StyleExtensions';
import { BabelPluginPage } from '../pages/theme/BabelPlugin';
import { ComponentsOverviewPage } from '../pages/components/Overview';
import { ButtonPage } from '../pages/components/Button';
import { InputPage } from '../pages/components/Input';
import { NavigationOverviewPage } from '../pages/navigation/Overview';
import { NavigationRoutesPage } from '../pages/navigation/Routes';
import { UseNavigatorPage } from '../pages/navigation/UseNavigator';
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
      { label: 'Style Extensions', path: '/theme/style-extensions' },
      { label: 'Babel Plugin', path: '/theme/babel-plugin' },
    ],
  },
  {
    title: 'Components',
    items: [
      { label: 'Overview', path: '/components/overview' },
      { label: 'Button', path: '/components/button' },
      { label: 'Input', path: '/components/input' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { label: 'Overview', path: '/navigation/overview' },
      { label: 'Routes', path: '/navigation/routes' },
      { label: 'useNavigator', path: '/navigation/use-navigator' },
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
    { path: 'theme/style-extensions', type: 'screen', component: StyleExtensionsPage, options: { title: 'Style Extensions' } },
    { path: 'theme/babel-plugin', type: 'screen', component: BabelPluginPage, options: { title: 'Babel Plugin' } },
    { path: 'components/overview', type: 'screen', component: ComponentsOverviewPage, options: { title: 'Components Overview' } },
    { path: 'components/button', type: 'screen', component: ButtonPage, options: { title: 'Button' } },
    { path: 'components/input', type: 'screen', component: InputPage, options: { title: 'Input' } },
    { path: 'navigation/overview', type: 'screen', component: NavigationOverviewPage, options: { title: 'Navigation Overview' } },
    { path: 'navigation/routes', type: 'screen', component: NavigationRoutesPage, options: { title: 'Route Configuration' } },
    { path: 'navigation/use-navigator', type: 'screen', component: UseNavigatorPage, options: { title: 'useNavigator Hook' } },
  ],
};

export default DocsRouter;
