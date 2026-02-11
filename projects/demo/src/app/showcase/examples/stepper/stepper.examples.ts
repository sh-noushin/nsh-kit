import type { DocExample } from '../../shared/doc-models';

import {
  StepperBasicExampleComponent,
  stepperBasicHtml,
  stepperBasicTs,
} from './stepper-basic.example';

export const stepperExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Linear stepper',
    component: StepperBasicExampleComponent,
    html: stepperBasicHtml,
    ts: stepperBasicTs,
  },
];
