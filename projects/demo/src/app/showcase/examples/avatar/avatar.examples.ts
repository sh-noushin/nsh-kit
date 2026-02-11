import type { DocExample } from '../../shared/doc-models';

import {
  AvatarBasicExampleComponent,
  avatarBasicHtml,
  avatarBasicTs,
} from './avatar-basic.example';

export const avatarExamples: ReadonlyArray<DocExample> = [
  {
    title: 'Status avatars',
    component: AvatarBasicExampleComponent,
    html: avatarBasicHtml,
    ts: avatarBasicTs,
  },
];
