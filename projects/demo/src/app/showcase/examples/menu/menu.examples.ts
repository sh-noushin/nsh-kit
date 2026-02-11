import type { DocExample } from '../../shared/doc-models';

import { MenuBasicExampleComponent, menuBasicHtml, menuBasicTs } from './menu-basic.example';

export const menuExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Basic menu',
    component: MenuBasicExampleComponent,
    html: menuBasicHtml,
    ts: menuBasicTs,
  },
];
