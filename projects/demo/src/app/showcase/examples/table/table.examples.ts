import type { DocExample } from '../../shared/doc-models';

import { TableBasicExampleComponent, tableBasicHtml, tableBasicTs } from './table-basic.example';

export const tableExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Basic table',
    component: TableBasicExampleComponent,
    html: tableBasicHtml,
    ts: tableBasicTs,
  },
];
