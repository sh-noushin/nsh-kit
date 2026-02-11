import type { DocExample } from '../../shared/doc-models';

import {
  FoundationTokensExampleComponent,
  foundationTokensHtml,
  foundationTokensTs,
} from './foundation-tokens.example';

export const foundationTokensExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Token references',
    component: FoundationTokensExampleComponent,
    html: foundationTokensHtml,
    ts: foundationTokensTs,
  },
];
