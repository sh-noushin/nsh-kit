import type { DocExample } from '../../shared/doc-models';

import {
  SelectPanelExampleComponent,
  selectPanelHtml,
  selectPanelTs,
} from './select-panel.example';

export const selectPanelExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Select panel',
    component: SelectPanelExampleComponent,
    html: selectPanelHtml,
    ts: selectPanelTs,
  },
];
