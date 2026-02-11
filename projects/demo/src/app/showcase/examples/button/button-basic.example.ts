import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <div class="example-row">
      <nsh-button variant="filled">Primary</nsh-button>
      <nsh-button variant="outlined">Secondary</nsh-button>
      <nsh-button variant="text">Ghost</nsh-button>
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
export class ButtonBasicExampleComponent {}

export const buttonBasicHtml = `<div class="example-row">
  <nsh-button variant="filled">Primary</nsh-button>
  <nsh-button variant="outlined">Secondary</nsh-button>
  <nsh-button variant="text">Ghost</nsh-button>
</div>`;

export const buttonBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './button-basic.example.html'
})
export class ButtonBasicExampleComponent {}`;
