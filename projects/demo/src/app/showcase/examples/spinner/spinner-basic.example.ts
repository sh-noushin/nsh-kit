import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshSpinnerComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-spinner-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSpinnerComponent],
  template: `
    <div class="example-row">
      <nsh-spinner size="sm"></nsh-spinner>
      <nsh-spinner size="md"></nsh-spinner>
      <nsh-spinner size="lg"></nsh-spinner>
    </div>
  `,
  styles: [
    `
      .example-row {
        display: flex;
        align-items: center;
        gap: var(--nsh-space-md);
      }
    `,
  ],
})
export class SpinnerBasicExampleComponent {}

export const spinnerBasicHtml = `<div class="example-row">
  <nsh-spinner size="sm"></nsh-spinner>
  <nsh-spinner size="md"></nsh-spinner>
  <nsh-spinner size="lg"></nsh-spinner>
</div>`;

export const spinnerBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshSpinnerComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-spinner-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSpinnerComponent],
  templateUrl: './spinner-basic.example.html'
})
export class SpinnerBasicExampleComponent {}`;
