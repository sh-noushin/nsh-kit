import type { DocExample } from '../../shared/doc-models';

import {
  MenuPanelExampleComponent,
  menuPanelHtml,
  menuPanelTs,
} from './menu-panel.example';

export const menuPanelExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Menu panel',
    component: MenuPanelExampleComponent,
    html: menuPanelHtml,
    ts: menuPanelTs,
  },
];
