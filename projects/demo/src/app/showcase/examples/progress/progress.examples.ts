import type { DocExample } from '../../shared/doc-models';

import {
  ProgressBasicExampleComponent,
  progressBasicHtml,
  progressBasicTs,
} from './progress-basic.example';

export const progressExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Determinate progress',
    component: ProgressBasicExampleComponent,
    html: progressBasicHtml,
    ts: progressBasicTs,
  },
];
