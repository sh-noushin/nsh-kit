import type { DocExample } from '../../shared/doc-models';

import {
  SnackbarBasicExampleComponent,
  snackbarBasicHtml,
  snackbarBasicTs,
} from './snackbar-basic.example';

export const snackbarExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Snackbar service',
    component: SnackbarBasicExampleComponent,
    html: snackbarBasicHtml,
    ts: snackbarBasicTs,
  },
];
