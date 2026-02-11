import type { DocExample } from '../../shared/doc-models';

import { ListBasicExampleComponent, listBasicHtml, listBasicTs } from './list-basic.example';

export const listExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Navigation list',
    component: ListBasicExampleComponent,
    html: listBasicHtml,
    ts: listBasicTs,
  },
];
