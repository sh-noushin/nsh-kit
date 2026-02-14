import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';

import { NshBottomSheetRef, NshBottomSheetService, NshButtonComponent } from 'nsh-kit-ui';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <h3 class="sheet-title">Share</h3>
    <p class="sheet-subtitle">Pick an option to continue.</p>

    <div class="sheet-actions">
      <nsh-button variant="text" (click)="pick('Google Keep')">Google Keep</nsh-button>
      <nsh-button variant="text" (click)="pick('Google Docs')">Google Docs</nsh-button>
      <nsh-button variant="text" (click)="pick('Google Hangouts')">Google Hangouts</nsh-button>
    </div>

    <div class="sheet-footer">
      <nsh-button variant="outlined" (click)="close()">Close</nsh-button>
    </div>
  `,
  styles: [
    `
      .sheet-title {
        margin: 0;
        font-size: var(--nsh-font-size-xl);
      }

      .sheet-subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .sheet-actions {
        display: grid;
        gap: var(--nsh-space-sm);
      }

      .sheet-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--nsh-space-sm);
      }
    `,
  ],
})
class BottomSheetContentComponent {
  private readonly sheetRef = inject(NshBottomSheetRef<string>);

  pick(value: string): void {
    this.sheetRef.dismiss(value);
  }

  close(): void {
    this.sheetRef.dismiss();
  }
}

@Component({
  selector: 'app-bottom-sheet-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <div class="bottom-sheet-page">
      <h1 class="bottom-sheet-page__title">Bottom Sheet</h1>
      <p class="bottom-sheet-page__subtitle">Service-driven bottom sheet overlay examples.</p>

      <section class="bottom-sheet-page__card">
        <div class="bottom-sheet-page__card-header">
          <h2 class="bottom-sheet-page__h2">Basic bottom sheet</h2>
          <p class="bottom-sheet-page__hint">Opens from the viewport bottom with backdrop/escape dismiss.</p>
        </div>

        <nsh-button variant="filled" (click)="openBasic()">Open bottom sheet</nsh-button>
      </section>

      <section class="bottom-sheet-page__card">
        <div class="bottom-sheet-page__card-header">
          <h2 class="bottom-sheet-page__h2">Latest result</h2>
          <p class="bottom-sheet-page__hint">Result emitted when the sheet is dismissed.</p>
        </div>

        <div class="bottom-sheet-page__result">{{ lastResult() }}</div>
      </section>
    </div>
  `,
  styles: [
    `
      .bottom-sheet-page {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .bottom-sheet-page__title {
        margin: 0;
      }

      .bottom-sheet-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .bottom-sheet-page__card {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-md);
        border: 1px solid var(--nsh-color-outline);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-0);
      }

      .bottom-sheet-page__card-header {
        display: grid;
        gap: var(--nsh-space-xs);
      }

      .bottom-sheet-page__h2 {
        margin: 0;
        font-size: var(--nsh-font-size-lg);
        font-weight: var(--nsh-font-weight-medium);
      }

      .bottom-sheet-page__hint {
        margin: 0;
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }

      .bottom-sheet-page__result {
        font-size: var(--nsh-font-size-md);
        color: var(--nsh-color-text);
      }
    `,
  ],
})
export class BottomSheetPageComponent {
  private readonly bottomSheet = inject(NshBottomSheetService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  readonly lastResult = signal<string>('No result yet.');

  openBasic(): void {
    const ref = this.bottomSheet.open(BottomSheetContentComponent, {
      ariaLabel: 'Share actions',
      maxWidth: '640px',
    });

    let effectRef: { destroy: () => void } | null = null;
    effectRef = runInInjectionContext(this.injector, () =>
      effect(
        () => {
          const result = ref.afterDismissed();
          if (result === null) {
            return;
          }

          this.lastResult.set(`Selected: ${result}`);
          effectRef?.destroy();
        },
        { allowSignalWrites: true },
      ),
    );

    this.destroyRef.onDestroy(() => effectRef?.destroy());
  }
}
