import type { DocExample } from '../../shared/doc-models';

import { ChipsBasicExampleComponent, chipsBasicHtml, chipsBasicTs } from './chips-basic.example';

export const chipsExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Chips set',
    component: ChipsBasicExampleComponent,
    html: chipsBasicHtml,
    ts: chipsBasicTs,
  },
];
