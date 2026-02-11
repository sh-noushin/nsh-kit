import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshProgressComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-progress-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshProgressComponent],
  template: `
    <div class="example-stack">
      <nsh-progress [value]="value()" size="md"></nsh-progress>
      <div class="example-meta">{{ value() }}% complete</div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-sm);
        max-width: 320px;
      }

      .example-meta {
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class ProgressBasicExampleComponent {
  readonly value = signal(62);
}

export const progressBasicHtml = `<nsh-progress [value]="62" size="md"></nsh-progress>`;

export const progressBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshProgressComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-progress-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshProgressComponent],
  templateUrl: './progress-basic.example.html'
})
export class ProgressBasicExampleComponent {}`;
