import type { DocExample } from '../../shared/doc-models';

import {
  PaginatorBasicExampleComponent,
  paginatorBasicHtml,
  paginatorBasicTs,
} from './paginator-basic.example';

export const paginatorExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Page controls',
    component: PaginatorBasicExampleComponent,
    html: paginatorBasicHtml,
    ts: paginatorBasicTs,
  },
];
