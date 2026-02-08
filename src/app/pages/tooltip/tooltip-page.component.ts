import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshTooltipDirective } from 'nsh-kit-ui';

type DemoPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshTooltipDirective],
  template: `
    <div class="tooltip-page">
      <h1 class="tooltip-page__title">Tooltip</h1>
      <p class="tooltip-page__subtitle">Non-interactive tooltip (overlay-core) demo.</p>

      <section class="tooltip-page__card">
        <h2 class="tooltip-page__h2">Positions</h2>

        <div class="tooltip-page__row" role="list">
          @for (p of positions(); track p.position) {
            <button
              class="tooltip-page__btn"
              type="button"
              role="listitem"
              [nshTooltip]="p.label"
              [nshTooltipPosition]="p.position"
            >
              {{ p.position }}
            </button>
          }
        </div>

        <div class="tooltip-page__hint">Hover or focus. Escape closes.</div>
      </section>

      <section class="tooltip-page__card">
        <h2 class="tooltip-page__h2">Long text + maxWidth</h2>

        <button
          class="tooltip-page__btn"
          type="button"
          [nshTooltip]="longText()"
          [nshTooltipPosition]="'bottom'"
          [nshTooltipMaxWidth]="'var(--nsh-tooltip-demo-max-width)'"
        >
          Hover for long tooltip
        </button>
      </section>

      <section class="tooltip-page__card">
        <h2 class="tooltip-page__h2">Custom delays</h2>

        <button
          class="tooltip-page__btn"
          type="button"
          [nshTooltip]="'Shows after 800ms, hides after 300ms'"
          [nshTooltipPosition]="'top'"
          [nshTooltipShowDelay]="800"
          [nshTooltipHideDelay]="300"
        >
          Slow show / slow hide
        </button>
      </section>

      <section class="tooltip-page__card">
        <h2 class="tooltip-page__h2">Disabled</h2>

        <button
          class="tooltip-page__btn"
          type="button"
          [nshTooltip]="'You should not see this'"
          [nshTooltipDisabled]="true"
        >
          Tooltip disabled
        </button>
      </section>

      <section class="tooltip-page__card">
        <h2 class="tooltip-page__h2">Empty / null</h2>

        <div class="tooltip-page__row">
          <button class="tooltip-page__btn" type="button" [nshTooltip]="''">Empty text</button>
          <button class="tooltip-page__btn" type="button" [nshTooltip]="null">Null text</button>
        </div>
      </section>

      <section class="tooltip-page__card">
        <h2 class="tooltip-page__h2">ARIA label override</h2>

        <button
          class="tooltip-page__btn"
          type="button"
          [nshTooltip]="'Visible tooltip text'"
          [nshTooltipAriaDescription]="'Accessible tooltip description'"
        >
          Screen reader label differs
        </button>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        --nsh-tooltip-demo-max-width: calc(var(--nsh-space-xl) * 10);
      }

      .tooltip-page {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .tooltip-page__title {
        margin: 0;
      }

      .tooltip-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .tooltip-page__card {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-md);
        border: 1px solid var(--nsh-color-outline);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-0);
      }

      .tooltip-page__h2 {
        margin: 0;
        font-size: var(--nsh-font-size-lg);
        font-weight: var(--nsh-font-weight-medium);
      }

      .tooltip-page__row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--nsh-space-sm);
        align-items: center;
      }

      .tooltip-page__btn {
        font: inherit;
        padding-inline: var(--nsh-space-md);
        padding-block: var(--nsh-space-sm);
        border: 1px solid var(--nsh-color-outline);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-1);
        color: var(--nsh-color-text);
      }

      .tooltip-page__btn:focus-visible {
        outline: calc(var(--nsh-space-xs) / 2) solid var(--nsh-color-primary);
        outline-offset: calc(var(--nsh-space-xs) / 2);
      }

      .tooltip-page__hint {
        color: var(--nsh-color-text-muted);
      }
    `,
  ],
})
export class TooltipPageComponent {
  readonly positions = signal<ReadonlyArray<{ position: DemoPosition; label: string }>>([
    { position: 'top', label: 'Tooltip on top' },
    { position: 'right', label: 'Tooltip on right' },
    { position: 'bottom', label: 'Tooltip on bottom' },
    { position: 'left', label: 'Tooltip on left' },
  ]);

  readonly longText = signal(
    'This is a longer tooltip intended to wrap onto multiple lines to demonstrate max width behavior.',
  );
}
