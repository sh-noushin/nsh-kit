import type { DocExample } from '../../shared/doc-models';

import {
  SidenavBasicExampleComponent,
  sidenavBasicHtml,
  sidenavBasicTs,
} from './sidenav-basic.example';

export const sidenavExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Side layout',
    component: SidenavBasicExampleComponent,
    html: sidenavBasicHtml,
    ts: sidenavBasicTs,
  },
];
