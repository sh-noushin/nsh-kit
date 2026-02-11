import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-loading-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <div class="example-row">
      <nsh-button variant="filled" [loading]="true">Saving</nsh-button>
      <nsh-button variant="tonal" [loading]="true">Processing</nsh-button>
    </div>
  `,
  styles: [
    `
      .example-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--nsh-space-sm);
      }
    `,
  ],
})
export class ButtonLoadingExampleComponent {}

export const buttonLoadingHtml = `<div class="example-row">
  <nsh-button variant="filled" [loading]="true">Saving</nsh-button>
  <nsh-button variant="tonal" [loading]="true">Processing</nsh-button>
</div>`;

export const buttonLoadingTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-loading-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './button-loading.example.html'
})
export class ButtonLoadingExampleComponent {}`;
