import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshSkeletonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-skeleton-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSkeletonComponent],
  template: `
    <div class="example-stack">
      <nsh-skeleton variant="text" [lines]="3"></nsh-skeleton>
      <nsh-skeleton variant="rect" [style.--nsh-skeleton-height]="'120px'"></nsh-skeleton>
      <nsh-skeleton variant="circle" [style.--nsh-skeleton-width]="'48px'" [style.--nsh-skeleton-height]="'48px'"></nsh-skeleton>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-md);
        max-width: 320px;
      }
    `,
  ],
})
export class SkeletonBasicExampleComponent {}

export const skeletonBasicHtml = `<nsh-skeleton variant="text" [lines]="3"></nsh-skeleton>
<nsh-skeleton variant="rect" [style.--nsh-skeleton-height]="'120px'"></nsh-skeleton>
<nsh-skeleton variant="circle" [style.--nsh-skeleton-width]="'48px'" [style.--nsh-skeleton-height]="'48px'"></nsh-skeleton>`;

export const skeletonBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshSkeletonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-skeleton-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSkeletonComponent],
  templateUrl: './skeleton-basic.example.html'
})
export class SkeletonBasicExampleComponent {}`;
