import type { DocExample } from '../../shared/doc-models';

import {
  ButtonBasicExampleComponent,
  buttonBasicHtml,
  buttonBasicTs,
} from './button-basic.example';
import {
  ButtonLoadingExampleComponent,
  buttonLoadingHtml,
  buttonLoadingTs,
} from './button-loading.example';

export const buttonExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Basic variants',
    component: ButtonBasicExampleComponent,
    html: buttonBasicHtml,
    ts: buttonBasicTs,
  },
  {
    title: 'Loading state',
    component: ButtonLoadingExampleComponent,
    html: buttonLoadingHtml,
    ts: buttonLoadingTs,
  },
];
