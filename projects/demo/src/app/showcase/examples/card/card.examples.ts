import type { DocExample } from '../../shared/doc-models';

import { CardBasicExampleComponent, cardBasicHtml, cardBasicTs } from './card-basic.example';

export const cardExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Outlined card',
    component: CardBasicExampleComponent,
    html: cardBasicHtml,
    ts: cardBasicTs,
  },
];
