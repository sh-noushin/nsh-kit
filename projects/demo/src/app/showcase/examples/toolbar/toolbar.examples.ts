import type { DocExample } from '../../shared/doc-models';

import { ToolbarBasicExampleComponent, toolbarBasicHtml, toolbarBasicTs } from './toolbar-basic.example';

export const toolbarExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Dense toolbar',
    component: ToolbarBasicExampleComponent,
    html: toolbarBasicHtml,
    ts: toolbarBasicTs,
  },
];
