import type { DocExample } from '../../shared/doc-models';

import {
  CheckboxBasicExampleComponent,
  checkboxBasicHtml,
  checkboxBasicTs,
} from './checkbox-basic.example';

export const checkboxExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Checkbox control',
    component: CheckboxBasicExampleComponent,
    html: checkboxBasicHtml,
    ts: checkboxBasicTs,
  },
];
