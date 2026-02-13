import type { DocExample } from '../../shared/doc-models';

import {
  BreadcrumbBasicExampleComponent,
  breadcrumbBasicHtml,
  breadcrumbBasicTs,
} from './breadcrumb-basic.example';
import {
  BreadcrumbStylesExampleComponent,
  breadcrumbStylesHtml,
  breadcrumbStylesTs,
} from './breadcrumb-styles.example';
import {
  BreadcrumbIconCustomizeExampleComponent,
  breadcrumbIconCustomizeHtml,
  breadcrumbIconCustomizeTs,
} from './breadcrumb-icon-customize.example';
import {
  BreadcrumbCheckoutExampleComponent,
  breadcrumbCheckoutHtml,
  breadcrumbCheckoutTs,
} from './breadcrumb-checkout.example';

export const breadcrumbExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Basic breadcrumb with steps',
    component: BreadcrumbBasicExampleComponent,
    html: breadcrumbBasicHtml,
    ts: breadcrumbBasicTs,
  },
  {
    title: 'Checkout flow (Segmented)',
    component: BreadcrumbCheckoutExampleComponent,
    html: breadcrumbCheckoutHtml,
    ts: breadcrumbCheckoutTs,
  },
  {
    title: 'Breadcrumb style variants',
    component: BreadcrumbStylesExampleComponent,
    html: breadcrumbStylesHtml,
    ts: breadcrumbStylesTs,
  },
  {
    title: 'Segmented with custom icons',
    component: BreadcrumbIconCustomizeExampleComponent,
    html: breadcrumbIconCustomizeHtml,
    ts: breadcrumbIconCustomizeTs,
  },
];
