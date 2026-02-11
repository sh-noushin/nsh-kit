import type { DocExample } from '../../shared/doc-models';

import { SliderBasicExampleComponent, sliderBasicHtml, sliderBasicTs } from './slider-basic.example';

export const sliderExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Range slider',
    component: SliderBasicExampleComponent,
    html: sliderBasicHtml,
    ts: sliderBasicTs,
  },
];
