import type { DocExample } from '../../shared/doc-models';

import {
  AutocompletePanelExampleComponent,
  autocompletePanelHtml,
  autocompletePanelTs,
} from './autocomplete-panel.example';

export const autocompletePanelExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Autocomplete panel',
    component: AutocompletePanelExampleComponent,
    html: autocompletePanelHtml,
    ts: autocompletePanelTs,
  },
];
