import type { DocExample } from '../../shared/doc-models';

import {
  AutocompleteBasicExampleComponent,
  autocompleteBasicHtml,
  autocompleteBasicTs,
} from './autocomplete-basic.example';

export const autocompleteExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Autocomplete input',
    component: AutocompleteBasicExampleComponent,
    html: autocompleteBasicHtml,
    ts: autocompleteBasicTs,
  },
];
