import type { DocExample } from '../../shared/doc-models';

import {
  FoundationIconsExampleComponent,
  foundationIconsHtml,
  foundationIconsTs,
} from './foundation-icons.example';

export const foundationIconsExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Icon registry',
    component: FoundationIconsExampleComponent,
    html: foundationIconsHtml,
    ts: foundationIconsTs,
  },
];
