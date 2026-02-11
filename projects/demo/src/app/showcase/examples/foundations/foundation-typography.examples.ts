import type { DocExample } from '../../shared/doc-models';

import {
  FoundationTypographyExampleComponent,
  foundationTypographyHtml,
  foundationTypographyTs,
} from './foundation-typography.example';

export const foundationTypographyExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Typography scale',
    component: FoundationTypographyExampleComponent,
    html: foundationTypographyHtml,
    ts: foundationTypographyTs,
  },
];
