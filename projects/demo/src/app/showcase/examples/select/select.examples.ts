import type { DocExample } from '../../shared/doc-models';

import { SelectBasicExampleComponent, selectBasicHtml, selectBasicTs } from './select-basic.example';

export const selectExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Select field',
    component: SelectBasicExampleComponent,
    html: selectBasicHtml,
    ts: selectBasicTs,
  },
];
