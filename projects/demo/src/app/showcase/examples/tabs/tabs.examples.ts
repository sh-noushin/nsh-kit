import type { DocExample } from '../../shared/doc-models';

import { TabsBasicExampleComponent, tabsBasicHtml, tabsBasicTs } from './tabs-basic.example';

export const tabsExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Underline tabs',
    component: TabsBasicExampleComponent,
    html: tabsBasicHtml,
    ts: tabsBasicTs,
  },
];
