import type { DocCategory, DocEntry } from './doc-models';

import { avatarExamples } from '../examples/avatar/avatar.examples';
import { badgeExamples } from '../examples/badge/badge.examples';
import { breadcrumbExamples } from '../examples/breadcrumb/breadcrumb.examples';
import { buttonExamples } from '../examples/button/button.examples';
import { cardExamples } from '../examples/card/card.examples';
import { dividerExamples } from '../examples/divider/divider.examples';
import { emptyStateExamples } from '../examples/empty-state/empty-state.examples';
import { listExamples } from '../examples/list/list.examples';
import { menuExamples } from '../examples/menu/menu.examples';
import { menuPanelExamples } from '../examples/menu-panel/menu-panel.examples';
import { paginatorExamples } from '../examples/paginator/paginator.examples';
import { progressExamples } from '../examples/progress/progress.examples';
import { sidenavExamples } from '../examples/sidenav/sidenav.examples';
import { skeletonExamples } from '../examples/skeleton/skeleton.examples';
import { sortExamples } from '../examples/sort/sort.examples';
import { spinnerExamples } from '../examples/spinner/spinner.examples';
import { stepperExamples } from '../examples/stepper/stepper.examples';
import { tableExamples } from '../examples/table/table.examples';
import { tabsExamples } from '../examples/tabs/tabs.examples';
import { toolbarExamples } from '../examples/toolbar/toolbar.examples';

import { autocompleteExamples } from '../examples/autocomplete/autocomplete.examples';
import { autocompletePanelExamples } from '../examples/autocomplete-panel/autocomplete-panel.examples';
import { checkboxExamples } from '../examples/checkbox/checkbox.examples';
import { chipsExamples } from '../examples/chips/chips.examples';
import { formFieldExamples } from '../examples/form-field/form-field.examples';
import { inputExamples } from '../examples/input/input.examples';
import { radioExamples } from '../examples/radio/radio.examples';
import { selectExamples } from '../examples/select/select.examples';
import { selectPanelExamples } from '../examples/select-panel/select-panel.examples';
import { sliderExamples } from '../examples/slider/slider.examples';
import { switchExamples } from '../examples/switch/switch.examples';
import { textareaExamples } from '../examples/textarea/textarea.examples';

import { dialogExamples } from '../examples/dialog/dialog.examples';
import { snackbarExamples } from '../examples/snackbar/snackbar.examples';
import { tooltipExamples } from '../examples/tooltip/tooltip.examples';

import {
  foundationThemeExamples,
  foundationTokensExamples,
  foundationTypographyExamples,
  foundationIconsExamples,
} from '../examples/foundations';

export const DOC_CATEGORIES: ReadonlyArray<DocCategory> = [
  { id: 'components', title: 'Components' },
  { id: 'forms', title: 'Forms' },
  { id: 'overlays', title: 'Overlays' },
  { id: 'foundations', title: 'Foundations' },
];

export const DOC_ENTRIES: ReadonlyArray<DocEntry> = [
  {
    id: 'avatar',
    title: 'Avatar',
    description: 'Identity chips for people, teams, and status in compact UI areas.',
    usage: [
      'Provide a full name so initials and accessibility labels are derived automatically.',
      'Use status for presence and reserve rounded shapes for compact lists or cards.',
      'Prefer real images for people; fall back to initials for system users or groups.',
    ],
    route: '/showcase/avatar',
    category: 'components',
    exampleProvider: () => avatarExamples,
  },
  {
    id: 'badge',
    title: 'Badge',
    description: 'Counts and status badges for UI elements.',
    route: '/showcase/badge',
    category: 'components',
    exampleProvider: () => badgeExamples,
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumb',
    description: 'Navigation breadcrumbs with separators.',
    route: '/showcase/breadcrumb',
    category: 'components',
    exampleProvider: () => breadcrumbExamples,
  },
  {
    id: 'button',
    title: 'Button',
    description: 'Primary and secondary actions.',
    route: '/showcase/button',
    category: 'components',
    exampleProvider: () => buttonExamples,
  },
  {
    id: 'card',
    title: 'Card',
    description: 'Surface container for grouped content.',
    route: '/showcase/card',
    category: 'components',
    exampleProvider: () => cardExamples,
  },
  {
    id: 'divider',
    title: 'Divider',
    description: 'Lightweight separation between sections.',
    route: '/showcase/divider',
    category: 'components',
    exampleProvider: () => dividerExamples,
  },
  {
    id: 'empty-state',
    title: 'Empty state',
    description: 'Guidance when no content is available.',
    route: '/showcase/empty-state',
    category: 'components',
    exampleProvider: () => emptyStateExamples,
  },
  {
    id: 'list',
    title: 'List',
    description: 'Dense and navigation-ready lists.',
    route: '/showcase/list',
    category: 'components',
    exampleProvider: () => listExamples,
  },
  {
    id: 'menu',
    title: 'Menu',
    description: 'Contextual overlay menus.',
    route: '/showcase/menu',
    category: 'components',
    exampleProvider: () => menuExamples,
  },
  {
    id: 'menu-panel',
    title: 'Menu panel',
    description: 'Low-level menu panel surface.',
    route: '/showcase/menu-panel',
    category: 'overlays',
    exampleProvider: () => menuPanelExamples,
  },
  {
    id: 'paginator',
    title: 'Paginator',
    description: 'Pagination controls for lists and tables.',
    route: '/showcase/paginator',
    category: 'components',
    exampleProvider: () => paginatorExamples,
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'Linear progress indicators.',
    route: '/showcase/progress',
    category: 'components',
    exampleProvider: () => progressExamples,
  },
  {
    id: 'sidenav',
    title: 'Sidenav',
    description: 'Layouts with side navigation.',
    route: '/showcase/sidenav',
    category: 'components',
    exampleProvider: () => sidenavExamples,
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    description: 'Loading placeholders and shimmer.',
    route: '/showcase/skeleton',
    category: 'components',
    exampleProvider: () => skeletonExamples,
  },
  {
    id: 'sort',
    title: 'Sort',
    description: 'Sorting interactions for tables.',
    route: '/showcase/sort',
    category: 'components',
    exampleProvider: () => sortExamples,
  },
  {
    id: 'spinner',
    title: 'Spinner',
    description: 'Indeterminate progress indicator.',
    route: '/showcase/spinner',
    category: 'components',
    exampleProvider: () => spinnerExamples,
  },
  {
    id: 'stepper',
    title: 'Stepper',
    description: 'Multi-step flows with status.',
    route: '/showcase/stepper',
    category: 'components',
    exampleProvider: () => stepperExamples,
  },
  {
    id: 'table',
    title: 'Table',
    description: 'Data tables with sorting and pagination.',
    route: '/showcase/table',
    category: 'components',
    exampleProvider: () => tableExamples,
  },
  {
    id: 'tabs',
    title: 'Tabs',
    description: 'Tabbed navigation and content panes.',
    route: '/showcase/tabs',
    category: 'components',
    exampleProvider: () => tabsExamples,
  },
  {
    id: 'toolbar',
    title: 'Toolbar',
    description: 'Top app bars with slots.',
    route: '/showcase/toolbar',
    category: 'components',
    exampleProvider: () => toolbarExamples,
  },
  {
    id: 'input',
    title: 'Input',
    description: 'Text fields with CVA support.',
    route: '/showcase/input',
    category: 'forms',
    exampleProvider: () => inputExamples,
  },
  {
    id: 'textarea',
    title: 'Textarea',
    description: 'Multi-line text input.',
    route: '/showcase/textarea',
    category: 'forms',
    exampleProvider: () => textareaExamples,
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    description: 'Binary choice controls.',
    route: '/showcase/checkbox',
    category: 'forms',
    exampleProvider: () => checkboxExamples,
  },
  {
    id: 'radio',
    title: 'Radio',
    description: 'Exclusive selection groups.',
    route: '/showcase/radio',
    category: 'forms',
    exampleProvider: () => radioExamples,
  },
  {
    id: 'switch',
    title: 'Switch',
    description: 'Toggle controls with labels.',
    route: '/showcase/switch',
    category: 'forms',
    exampleProvider: () => switchExamples,
  },
  {
    id: 'slider',
    title: 'Slider',
    description: 'Range input for numeric values.',
    route: '/showcase/slider',
    category: 'forms',
    exampleProvider: () => sliderExamples,
  },
  {
    id: 'select',
    title: 'Select',
    description: 'Overlay select with options.',
    route: '/showcase/select',
    category: 'forms',
    exampleProvider: () => selectExamples,
  },
  {
    id: 'select-panel',
    title: 'Select panel',
    description: 'Lower-level select list panel.',
    route: '/showcase/select-panel',
    category: 'overlays',
    exampleProvider: () => selectPanelExamples,
  },
  {
    id: 'autocomplete',
    title: 'Autocomplete',
    description: 'Typeahead suggestions.',
    route: '/showcase/autocomplete',
    category: 'forms',
    exampleProvider: () => autocompleteExamples,
  },
  {
    id: 'autocomplete-panel',
    title: 'Autocomplete panel',
    description: 'Raw panel used by autocomplete.',
    route: '/showcase/autocomplete-panel',
    category: 'overlays',
    exampleProvider: () => autocompletePanelExamples,
  },
  {
    id: 'chips',
    title: 'Chips',
    description: 'Selectable chip tokens.',
    route: '/showcase/chips',
    category: 'forms',
    exampleProvider: () => chipsExamples,
  },
  {
    id: 'form-field',
    title: 'Form field',
    description: 'Labels, hints, and validation.',
    route: '/showcase/form-field',
    category: 'forms',
    exampleProvider: () => formFieldExamples,
  },
  {
    id: 'dialog',
    title: 'Dialog',
    description: 'Service-driven modal dialogs.',
    route: '/showcase/dialog',
    category: 'overlays',
    exampleProvider: () => dialogExamples,
  },
  {
    id: 'snackbar',
    title: 'Snackbar',
    description: 'Transient notification toasts.',
    route: '/showcase/snackbar',
    category: 'overlays',
    exampleProvider: () => snackbarExamples,
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    description: 'Non-interactive helper text.',
    route: '/showcase/tooltip',
    category: 'overlays',
    exampleProvider: () => tooltipExamples,
  },
  {
    id: 'theme',
    title: 'Theme',
    description: 'CSS variable theming surfaces.',
    route: '/showcase/theme',
    category: 'foundations',
    exampleProvider: () => foundationThemeExamples,
  },
  {
    id: 'tokens',
    title: 'Tokens',
    description: 'Design tokens and scales.',
    route: '/showcase/tokens',
    category: 'foundations',
    exampleProvider: () => foundationTokensExamples,
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Type styles and hierarchy.',
    route: '/showcase/typography',
    category: 'foundations',
    exampleProvider: () => foundationTypographyExamples,
  },
  {
    id: 'icons',
    title: 'Icon registry',
    description: 'Icon registration and usage.',
    route: '/showcase/icons',
    category: 'foundations',
    exampleProvider: () => foundationIconsExamples,
  },
];

export interface DocSection {
  category: DocCategory;
  entries: ReadonlyArray<DocEntry>;
}

export const DOC_SECTIONS: ReadonlyArray<DocSection> = DOC_CATEGORIES.map((category) => ({
  category,
  entries: DOC_ENTRIES.filter((entry) => entry.category === category.id),
}));

export function getDocEntry(id: string | null): DocEntry | null {
  if (!id) {
    return null;
  }
  return DOC_ENTRIES.find((entry) => entry.id === id) ?? null;
}
