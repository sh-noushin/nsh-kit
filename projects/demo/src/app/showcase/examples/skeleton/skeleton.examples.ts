import type { DocExample } from '../../shared/doc-models';

import {
  SkeletonBasicExampleComponent,
  skeletonBasicHtml,
  skeletonBasicTs,
} from './skeleton-basic.example';

export const skeletonExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Skeleton surfaces',
    component: SkeletonBasicExampleComponent,
    html: skeletonBasicHtml,
    ts: skeletonBasicTs,
  },
];
