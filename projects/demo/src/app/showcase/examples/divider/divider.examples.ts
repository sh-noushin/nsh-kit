import type { DocExample } from '../../shared/doc-models';

import {
  DividerBasicExampleComponent,
  dividerBasicHtml,
  dividerBasicTs,
} from './divider-basic.example';

export const dividerExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Horizontal divider',
    component: DividerBasicExampleComponent,
    html: dividerBasicHtml,
    ts: dividerBasicTs,
  },
];
