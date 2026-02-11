import type { DocExample } from '../../shared/doc-models';

import { TooltipBasicExampleComponent, tooltipBasicHtml, tooltipBasicTs } from './tooltip-basic.example';

export const tooltipExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Tooltip directive',
    component: TooltipBasicExampleComponent,
    html: tooltipBasicHtml,
    ts: tooltipBasicTs,
  },
];
