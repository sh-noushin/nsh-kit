import type { DocExample } from '../../shared/doc-models';

import {
  BreadcrumbBasicExampleComponent,
  breadcrumbBasicHtml,
  breadcrumbBasicTs,
} from './breadcrumb-basic.example';

export const breadcrumbExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Basic breadcrumb',
    component: BreadcrumbBasicExampleComponent,
    html: breadcrumbBasicHtml,
    ts: breadcrumbBasicTs,
  },
];
