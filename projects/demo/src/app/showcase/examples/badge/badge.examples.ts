import type { DocExample } from '../../shared/doc-models';

import {
  BadgeBasicExampleComponent,
  badgeBasicHtml,
  badgeBasicTs,
} from './badge-basic.example';

export const badgeExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Badges with content',
    component: BadgeBasicExampleComponent,
    html: badgeBasicHtml,
    ts: badgeBasicTs,
  },
];
