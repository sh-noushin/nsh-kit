import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshDividerComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-divider-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshDividerComponent],
  template: `
    <div class="example-stack">
      <div class="example-text">Overview</div>
      <nsh-divider></nsh-divider>
      <div class="example-text">Details</div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-md);
      }

      .example-text {
        font-size: var(--nsh-font-size-md);
      }
    `,
  ],
})
export class DividerBasicExampleComponent {}

export const dividerBasicHtml = `<div class="example-stack">
  <div class="example-text">Overview</div>
  <nsh-divider></nsh-divider>
  <div class="example-text">Details</div>
</div>`;

export const dividerBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshDividerComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-divider-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshDividerComponent],
  templateUrl: './divider-basic.example.html'
})
export class DividerBasicExampleComponent {}`;
