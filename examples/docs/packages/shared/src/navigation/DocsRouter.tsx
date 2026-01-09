import React from 'react';
import { NavigatorParam, ScreenOptions, useParams } from '@idealyst/navigation';

// Import page components
import { HomePage } from '../pages/Home';
import { InstallationPage } from '../pages/Installation';
import { ThemeOverviewPage } from '../pages/theme/Overview';
import { StyleDefinitionPage } from '../pages/theme/StyleDefinition';
import { StyleExtensionsPage } from '../pages/theme/StyleExtensions';
import { BabelPluginPage } from '../pages/theme/BabelPlugin';
import { BreakpointsPage } from '../pages/theme/Breakpoints';
import { ComponentsOverviewPage } from '../pages/components/Overview';
import { ComponentDocPage } from '../pages/components/ComponentDocPage';
import { NavigationOverviewPage } from '../pages/navigation/Overview';
import { NavigationRoutesPage } from '../pages/navigation/Routes';
import { UseNavigatorPage } from '../pages/navigation/UseNavigator';
import { DocsLayout } from '../components/DocsLayout';
import { DocsSidebar } from '../components/DocsSidebar';

// Map lowercase URL slugs to actual component names
import { componentRegistry } from '@idealyst/tooling';

/**
 * Wrapper component that extracts the component name from route params
 * and passes it to the ComponentDocPage
 */
function DynamicComponentPage() {
  const params = useParams<{ name: string }>();
  // Find the actual component name by matching lowercase
  const componentName = params.name
    ? Object.keys(componentRegistry).find(
        name => name.toLowerCase() === params.name?.toLowerCase()
      ) || ''
    : '';
  return <ComponentDocPage componentName={componentName} />;
}

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
    { path: 'theme/breakpoints', type: 'screen', component: BreakpointsPage, options: { title: 'Breakpoints' } },
    { path: 'components/overview', type: 'screen', component: ComponentsOverviewPage, options: { title: 'Components Overview' } },
    // Dynamic route for all component pages - uses registry to render documentation
    { path: 'components/:name', type: 'screen', component: DynamicComponentPage, options: { title: 'Component' } },
    { path: 'navigation/overview', type: 'screen', component: NavigationOverviewPage, options: { title: 'Navigation Overview' } },
    { path: 'navigation/routes', type: 'screen', component: NavigationRoutesPage, options: { title: 'Route Configuration' } },
    { path: 'navigation/use-navigator', type: 'screen', component: UseNavigatorPage, options: { title: 'useNavigator Hook' } },
  ],
};

export default DocsRouter;
