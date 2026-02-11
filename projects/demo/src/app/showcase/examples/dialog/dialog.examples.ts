import type { DocExample } from '../../shared/doc-models';

import { DialogBasicExampleComponent, dialogBasicHtml, dialogBasicTs } from './dialog-basic.example';

export const dialogExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Service-driven dialog',
    component: DialogBasicExampleComponent,
    html: dialogBasicHtml,
    ts: dialogBasicTs,
  },
];
