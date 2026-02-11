import type { DocExample } from '../../shared/doc-models';

import {
  SpinnerBasicExampleComponent,
  spinnerBasicHtml,
  spinnerBasicTs,
} from './spinner-basic.example';

export const spinnerExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Spinner sizes',
    component: SpinnerBasicExampleComponent,
    html: spinnerBasicHtml,
    ts: spinnerBasicTs,
  },
];
