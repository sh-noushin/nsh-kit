import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshCardComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-typography-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshCardComponent],
  template: `
    <nsh-card variant="outlined">
      <div nshCardHeader>
        <strong>Typography scale</strong>
      </div>
      <div class="type-stack">
        <h2 class="type-title">Heading</h2>
        <p class="type-body">Body text inherits the base font tokens.</p>
        <p class="type-caption">Caption text uses muted color.</p>
      </div>
    </nsh-card>
  `,
  styles: [
    `
      .type-stack {
        display: grid;
        gap: var(--nsh-space-xs);
      }

      .type-title {
        margin: 0;
        font-size: var(--nsh-font-size-xl);
      }

      .type-body {
        margin: 0;
      }

      .type-caption {
        margin: 0;
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class FoundationTypographyExampleComponent {}

export const foundationTypographyHtml = `<nsh-card variant="outlined">
  <div nshCardHeader>
    <strong>Typography scale</strong>
  </div>
  <div class="type-stack">
    <h2 class="type-title">Heading</h2>
    <p class="type-body">Body text inherits the base font tokens.</p>
    <p class="type-caption">Caption text uses muted color.</p>
  </div>
</nsh-card>`;

export const foundationTypographyTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshCardComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-typography-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshCardComponent],
  templateUrl: './foundation-typography.example.html'
})
export class FoundationTypographyExampleComponent {}`;
