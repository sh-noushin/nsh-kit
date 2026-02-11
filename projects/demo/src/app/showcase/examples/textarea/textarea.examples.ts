import type { DocExample } from '../../shared/doc-models';

import {
  TextareaBasicExampleComponent,
  textareaBasicHtml,
  textareaBasicTs,
} from './textarea-basic.example';

export const textareaExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Textarea',
    component: TextareaBasicExampleComponent,
    html: textareaBasicHtml,
    ts: textareaBasicTs,
  },
];
