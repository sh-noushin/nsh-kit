import type { DocExample } from '../../shared/doc-models';

import {
  EmptyStateBasicExampleComponent,
  emptyStateBasicHtml,
  emptyStateBasicTs,
} from './empty-state-basic.example';

export const emptyStateExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Centered empty state',
    component: EmptyStateBasicExampleComponent,
    html: emptyStateBasicHtml,
    ts: emptyStateBasicTs,
  },
];
