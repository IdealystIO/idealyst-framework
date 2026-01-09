import React from 'react';
import { NavigatorParam, ScreenOptions } from '@idealyst/navigation';

// Import page components
import { HomePage } from '../pages/Home';
import { InstallationPage } from '../pages/Installation';
import { ThemeOverviewPage } from '../pages/theme/Overview';
import { StyleDefinitionPage } from '../pages/theme/StyleDefinition';
import { StyleExtensionsPage } from '../pages/theme/StyleExtensions';
import { BabelPluginPage } from '../pages/theme/BabelPlugin';
import { BreakpointsPage } from '../pages/theme/Breakpoints';
import { ComponentsOverviewPage } from '../pages/components/Overview';
import { ButtonPage } from '../pages/components/Button';
import { InputPage } from '../pages/components/Input';
import { ChipPage } from '../pages/components/Chip';
import { CardPage } from '../pages/components/Card';
import { BadgePage } from '../pages/components/Badge';
import { AlertPage } from '../pages/components/Alert';
import { SwitchPage } from '../pages/components/Switch';
import { CheckboxPage } from '../pages/components/Checkbox';
import { SelectPage } from '../pages/components/Select';
import { SliderPage } from '../pages/components/Slider';
import { ProgressPage } from '../pages/components/Progress';
import { TextPage } from '../pages/components/Text';
import { IconPage } from '../pages/components/Icon';
import { AvatarPage } from '../pages/components/Avatar';
import { DividerPage } from '../pages/components/Divider';
import { TextAreaPage } from '../pages/components/TextArea';
import { RadioButtonPage } from '../pages/components/RadioButton';
import { DialogPage } from '../pages/components/Dialog';
import { TooltipPage } from '../pages/components/Tooltip';
import { SkeletonPage } from '../pages/components/Skeleton';
import { TablePage } from '../pages/components/Table';
import { ListPage } from '../pages/components/List';
import { MenuPage } from '../pages/components/Menu';
import { BreadcrumbPage } from '../pages/components/Breadcrumb';
import { AccordionPage } from '../pages/components/Accordion';
import { LinkPage } from '../pages/components/Link';
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
      { label: 'Breakpoints', path: '/theme/breakpoints' },
      { label: 'Babel Plugin', path: '/theme/babel-plugin' },
    ],
  },
  {
    title: 'Components',
    items: [
      { label: 'Overview', path: '/components/overview' },
      { label: 'Text', path: '/components/text' },
      { label: 'Icon', path: '/components/icon' },
      { label: 'Button', path: '/components/button' },
      { label: 'Input', path: '/components/input' },
      { label: 'TextArea', path: '/components/textarea' },
      { label: 'Select', path: '/components/select' },
      { label: 'Checkbox', path: '/components/checkbox' },
      { label: 'RadioButton', path: '/components/radiobutton' },
      { label: 'Switch', path: '/components/switch' },
      { label: 'Slider', path: '/components/slider' },
      { label: 'Card', path: '/components/card' },
      { label: 'Chip', path: '/components/chip' },
      { label: 'Badge', path: '/components/badge' },
      { label: 'Avatar', path: '/components/avatar' },
      { label: 'Alert', path: '/components/alert' },
      { label: 'Dialog', path: '/components/dialog' },
      { label: 'Tooltip', path: '/components/tooltip' },
      { label: 'Menu', path: '/components/menu' },
      { label: 'List', path: '/components/list' },
      { label: 'Table', path: '/components/table' },
      { label: 'Accordion', path: '/components/accordion' },
      { label: 'Breadcrumb', path: '/components/breadcrumb' },
      { label: 'Divider', path: '/components/divider' },
      { label: 'Skeleton', path: '/components/skeleton' },
      { label: 'Progress', path: '/components/progress' },
      { label: 'Link', path: '/components/link' },
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
    { path: 'theme/breakpoints', type: 'screen', component: BreakpointsPage, options: { title: 'Breakpoints' } },
    { path: 'components/overview', type: 'screen', component: ComponentsOverviewPage, options: { title: 'Components Overview' } },
    { path: 'components/text', type: 'screen', component: TextPage, options: { title: 'Text' } },
    { path: 'components/icon', type: 'screen', component: IconPage, options: { title: 'Icon' } },
    { path: 'components/button', type: 'screen', component: ButtonPage, options: { title: 'Button' } },
    { path: 'components/input', type: 'screen', component: InputPage, options: { title: 'Input' } },
    { path: 'components/textarea', type: 'screen', component: TextAreaPage, options: { title: 'TextArea' } },
    { path: 'components/select', type: 'screen', component: SelectPage, options: { title: 'Select' } },
    { path: 'components/checkbox', type: 'screen', component: CheckboxPage, options: { title: 'Checkbox' } },
    { path: 'components/radiobutton', type: 'screen', component: RadioButtonPage, options: { title: 'RadioButton' } },
    { path: 'components/switch', type: 'screen', component: SwitchPage, options: { title: 'Switch' } },
    { path: 'components/slider', type: 'screen', component: SliderPage, options: { title: 'Slider' } },
    { path: 'components/card', type: 'screen', component: CardPage, options: { title: 'Card' } },
    { path: 'components/chip', type: 'screen', component: ChipPage, options: { title: 'Chip' } },
    { path: 'components/badge', type: 'screen', component: BadgePage, options: { title: 'Badge' } },
    { path: 'components/avatar', type: 'screen', component: AvatarPage, options: { title: 'Avatar' } },
    { path: 'components/alert', type: 'screen', component: AlertPage, options: { title: 'Alert' } },
    { path: 'components/dialog', type: 'screen', component: DialogPage, options: { title: 'Dialog' } },
    { path: 'components/tooltip', type: 'screen', component: TooltipPage, options: { title: 'Tooltip' } },
    { path: 'components/menu', type: 'screen', component: MenuPage, options: { title: 'Menu' } },
    { path: 'components/list', type: 'screen', component: ListPage, options: { title: 'List' } },
    { path: 'components/table', type: 'screen', component: TablePage, options: { title: 'Table' } },
    { path: 'components/accordion', type: 'screen', component: AccordionPage, options: { title: 'Accordion' } },
    { path: 'components/breadcrumb', type: 'screen', component: BreadcrumbPage, options: { title: 'Breadcrumb' } },
    { path: 'components/divider', type: 'screen', component: DividerPage, options: { title: 'Divider' } },
    { path: 'components/skeleton', type: 'screen', component: SkeletonPage, options: { title: 'Skeleton' } },
    { path: 'components/progress', type: 'screen', component: ProgressPage, options: { title: 'Progress' } },
    { path: 'components/link', type: 'screen', component: LinkPage, options: { title: 'Link' } },
    { path: 'navigation/overview', type: 'screen', component: NavigationOverviewPage, options: { title: 'Navigation Overview' } },
    { path: 'navigation/routes', type: 'screen', component: NavigationRoutesPage, options: { title: 'Route Configuration' } },
    { path: 'navigation/use-navigator', type: 'screen', component: UseNavigatorPage, options: { title: 'useNavigator Hook' } },
  ],
};

export default DocsRouter;
