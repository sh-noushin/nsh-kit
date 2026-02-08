import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';

import { NshSnackbarService } from 'nsh-kit-ui';
import type { NshSnackbarConfig } from 'nsh-kit-ui';

type DemoKey =
  | 'neutral'
  | 'success'
  | 'warn'
  | 'danger'
  | 'action'
  | 'sticky';

interface DemoCase {
  key: DemoKey;
  title: string;
  message: string;
  hint: string;
  config?: NshSnackbarConfig;
}

@Component({
  selector: 'app-snackbar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="snackbar-page">
      <h1 class="snackbar-page__title">Snackbar</h1>
      <p class="snackbar-page__subtitle">Service-driven overlay notifications.</p>

      @for (demo of demos(); track demo.key) {
        <section class="snackbar-page__card">
          <div class="snackbar-page__card-header">
            <h2 class="snackbar-page__h2">{{ demo.title }}</h2>
            <p class="snackbar-page__hint">{{ demo.hint }}</p>
          </div>

          <button class="snackbar-page__btn" type="button" (click)="openDemo(demo)">
            Show snackbar
          </button>
        </section>
      }
    </div>
  `,
  styles: [
    `
      .snackbar-page {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .snackbar-page__title {
        margin: 0;
      }

      .snackbar-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .snackbar-page__card {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-md);
        border: 1px solid var(--nsh-color-outline);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-0);
      }

      .snackbar-page__card-header {
        display: grid;
        gap: var(--nsh-space-xs);
      }

      .snackbar-page__h2 {
        margin: 0;
        font-size: var(--nsh-font-size-lg);
        font-weight: var(--nsh-font-weight-medium);
      }

      .snackbar-page__hint {
        margin: 0;
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }

      .snackbar-page__btn {
        justify-self: start;
        font: inherit;
        padding-inline: var(--nsh-space-md);
        padding-block: var(--nsh-space-sm);
        border: 1px solid var(--nsh-color-outline);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-1);
        color: var(--nsh-color-text);
        cursor: pointer;
      }

      .snackbar-page__btn:focus-visible {
        outline: calc(var(--nsh-space-xs) / 2) solid var(--nsh-color-outline);
        outline-offset: calc(var(--nsh-space-xs) / 2);
      }
    `,
  ],
})
export class SnackbarPageComponent {
  private readonly snackbar = inject(NshSnackbarService);

  readonly demos = signal<ReadonlyArray<DemoCase>>([
    {
      key: 'neutral',
      title: 'Neutral (default)',
      message: 'Saved as draft.',
      hint: 'Uses default config and variant.',
    },
    {
      key: 'success',
      title: 'Success',
      message: 'Profile updated successfully.',
      hint: 'Success variant with default duration.',
      config: { variant: 'success' },
    },
    {
      key: 'warn',
      title: 'Warn',
      message: 'Your trial ends in 3 days.',
      hint: 'Warn variant with default duration.',
      config: { variant: 'warn' },
    },
    {
      key: 'danger',
      title: 'Danger',
      message: 'Payment failed. Please try again.',
      hint: 'Danger variant with assertive live region.',
      config: { variant: 'danger', ariaLive: 'assertive' },
    },
    {
      key: 'action',
      title: 'With action',
      message: 'Message archived.',
      hint: 'Includes action button text.',
      config: { actionText: 'Undo' },
    },
    {
      key: 'sticky',
      title: 'Sticky (manual dismiss)',
      message: 'Background sync paused.',
      hint: 'durationMs=null keeps it open until dismissed.',
      config: { durationMs: null },
    },
  ]);

  openDemo(demo: DemoCase): void {
    this.snackbar.open(demo.message, demo.config);
  }
}
