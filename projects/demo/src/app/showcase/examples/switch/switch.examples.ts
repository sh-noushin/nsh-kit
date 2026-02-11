import type { DocExample } from '../../shared/doc-models';

import { SwitchBasicExampleComponent, switchBasicHtml, switchBasicTs } from './switch-basic.example';

export const switchExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Switch control',
    component: SwitchBasicExampleComponent,
    html: switchBasicHtml,
    ts: switchBasicTs,
  },
];
