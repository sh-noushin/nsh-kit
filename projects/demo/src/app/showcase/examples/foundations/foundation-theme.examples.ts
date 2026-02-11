import type { DocExample } from '../../shared/doc-models';

import {
  FoundationThemeExampleComponent,
  foundationThemeHtml,
  foundationThemeTs,
} from './foundation-theme.example';

export const foundationThemeExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Theme surfaces',
    component: FoundationThemeExampleComponent,
    html: foundationThemeHtml,
    ts: foundationThemeTs,
  },
];
