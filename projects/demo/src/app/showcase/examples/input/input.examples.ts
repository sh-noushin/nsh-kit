import type { DocExample } from '../../shared/doc-models';

import { InputBasicExampleComponent, inputBasicHtml, inputBasicTs } from './input-basic.example';

export const inputExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Basic input',
    component: InputBasicExampleComponent,
    html: inputBasicHtml,
    ts: inputBasicTs,
  },
];
