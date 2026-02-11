import type { DocExample } from '../../shared/doc-models';

import { SortBasicExampleComponent, sortBasicHtml, sortBasicTs } from './sort-basic.example';

export const sortExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Sortable headers',
    component: SortBasicExampleComponent,
    html: sortBasicHtml,
    ts: sortBasicTs,
  },
];
