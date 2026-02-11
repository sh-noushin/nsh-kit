import type { DocExample } from '../../shared/doc-models';

import { RadioBasicExampleComponent, radioBasicHtml, radioBasicTs } from './radio-basic.example';

export const radioExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Radio group',
    component: RadioBasicExampleComponent,
    html: radioBasicHtml,
    ts: radioBasicTs,
  },
];
