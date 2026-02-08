import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
} from '@angular/core';

import { NshSnackbarService } from './snackbar.service';

@Component({
  selector: 'nsh-snackbar-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-position]': 'position()',
    '[attr.aria-live]': 'ariaLive()',
    '[attr.role]': 'liveRole()',
    'aria-atomic': 'true',
    'aria-relevant': 'additions text',
    '[class.nsh-snackbar-container]': 'true',
  },
  template: `
    @for (snackbar of snackbars(); track snackbar.id) {
      <div class="nsh-snackbar" [attr.data-variant]="snackbar.config.variant">
        <div class="nsh-snackbar__content">
          <div class="nsh-snackbar__message">{{ snackbar.message }}</div>
        </div>

        @if (snackbar.config.actionText; as actionText) {
          <button
            class="nsh-snackbar__action"
            type="button"
            (click)="onAction(snackbar.id)"
          >
            {{ actionText }}
          </button>
        }

        <button
          class="nsh-snackbar__dismiss"
          type="button"
          aria-label="Dismiss snackbar"
          (click)="onDismiss(snackbar.id)"
        >
          Dismiss
        </button>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        gap: var(--nsh-snackbar-gap, var(--nsh-space-sm));
        padding: var(--nsh-snackbar-gap, var(--nsh-space-sm));
        pointer-events: none;
        font-family: var(--nsh-font-family);
        z-index: var(--nsh-z-overlay);
      }

      :host([data-position='bottom-start']) {
        align-items: flex-start;
        justify-content: flex-end;
      }

      :host([data-position='bottom-center']) {
        align-items: center;
        justify-content: flex-end;
      }

      :host([data-position='bottom-end']) {
        align-items: flex-end;
        justify-content: flex-end;
      }

      :host([data-position='top-start']) {
        align-items: flex-start;
        justify-content: flex-start;
      }

      :host([data-position='top-center']) {
        align-items: center;
        justify-content: flex-start;
      }

      :host([data-position='top-end']) {
        align-items: flex-end;
        justify-content: flex-start;
      }

      .nsh-snackbar {
        pointer-events: auto;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        gap: var(--nsh-snackbar-gap, var(--nsh-space-sm));
        padding-inline: var(--nsh-snackbar-padding-x, var(--nsh-space-md));
        padding-block: var(--nsh-snackbar-padding-y, var(--nsh-space-sm));
        border-radius: var(--nsh-snackbar-radius, var(--nsh-radius-md));
        box-shadow: var(--nsh-snackbar-shadow, var(--nsh-elevation-2));
        background: var(--_nsh-snackbar-bg, var(--nsh-snackbar-bg, var(--nsh-color-surface-1)));
        color: var(--_nsh-snackbar-fg, var(--nsh-snackbar-fg, var(--nsh-color-text)));
        max-width: var(--nsh-snackbar-max-width, calc(var(--nsh-space-xl) * 20));
        width: max-content;
        min-width: 0;
      }

      .nsh-snackbar__content {
        display: grid;
        min-width: 0;
      }

      .nsh-snackbar__message {
        font-size: var(--nsh-font-size-sm);
        line-height: var(--nsh-line-height-normal);
        word-break: break-word;
      }

      .nsh-snackbar__action,
      .nsh-snackbar__dismiss {
        font: inherit;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
      }

      .nsh-snackbar__action {
        color: var(--nsh-snackbar-action-color, var(--nsh-color-primary));
        font-weight: var(--nsh-font-weight-medium);
      }

      .nsh-snackbar__dismiss {
        color: var(--nsh-snackbar-dismiss-color, var(--nsh-color-text-muted));
      }

      .nsh-snackbar[data-variant='neutral'] {
        --_nsh-snackbar-bg: var(--nsh-snackbar-bg, var(--nsh-color-surface-1));
        --_nsh-snackbar-fg: var(--nsh-snackbar-fg, var(--nsh-color-text));
      }

      .nsh-snackbar[data-variant='success'] {
        --_nsh-snackbar-bg: var(--nsh-snackbar-success-bg, var(--nsh-color-success));
        --_nsh-snackbar-fg: var(--nsh-snackbar-success-fg, var(--nsh-color-surface));
      }

      .nsh-snackbar[data-variant='warn'] {
        --_nsh-snackbar-bg: var(--nsh-snackbar-warn-bg, var(--nsh-color-warn));
        --_nsh-snackbar-fg: var(--nsh-snackbar-warn-fg, var(--nsh-color-surface));
      }

      .nsh-snackbar[data-variant='danger'] {
        --_nsh-snackbar-bg: var(--nsh-snackbar-danger-bg, var(--nsh-color-danger));
        --_nsh-snackbar-fg: var(--nsh-snackbar-danger-fg, var(--nsh-color-surface));
      }

      .nsh-snackbar__action:focus-visible,
      .nsh-snackbar__dismiss:focus-visible {
        outline: calc(var(--nsh-space-xs) / 2) solid var(--nsh-color-outline);
        outline-offset: calc(var(--nsh-space-xs) / 2);
      }
    `,
  ],
})
export class NshSnackbarContainerComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbarService = inject(NshSnackbarService);

  readonly snackbars = this.snackbarService.snackbars;

  readonly latestConfig = computed(() => {
    const items = this.snackbars();
    return items.length > 0 ? items[items.length - 1].config : null;
  });

  readonly position = computed(() => this.latestConfig()?.position ?? 'bottom-center');
  readonly ariaLive = computed(() => this.latestConfig()?.ariaLive ?? 'polite');
  readonly liveRole = computed(() => (this.ariaLive() === 'assertive' ? 'alert' : 'status'));

  constructor() {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (this.snackbars().length === 0) {
        return;
      }

      event.preventDefault();
      this.snackbarService.closeLatest('dismiss');
    };

    document.addEventListener('keydown', onKeydown, { capture: true });
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('keydown', onKeydown, { capture: true } as AddEventListenerOptions);
    });
  }

  onAction(id: number): void {
    this.snackbarService.closeById(id, 'action');
  }

  onDismiss(id: number): void {
    this.snackbarService.closeById(id, 'dismiss');
  }
}
