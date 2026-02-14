import type { DocExample } from '../../shared/doc-models';

import {
  BottomSheetBasicExampleComponent,
  bottomSheetBasicHtml,
  bottomSheetBasicTs,
} from './bottom-sheet-basic.example';

export const bottomSheetExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Share workflow bottom sheet',
    component: BottomSheetBasicExampleComponent,
    html: bottomSheetBasicHtml,
    ts: bottomSheetBasicTs,
  },
];
