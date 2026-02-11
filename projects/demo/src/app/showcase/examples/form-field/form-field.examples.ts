import type { DocExample } from '../../shared/doc-models';

import {
  FormFieldBasicExampleComponent,
  formFieldBasicHtml,
  formFieldBasicTs,
} from './form-field-basic.example';

export const formFieldExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Prefix and suffix',
    component: FormFieldBasicExampleComponent,
    html: formFieldBasicHtml,
    ts: formFieldBasicTs,
  },
];
