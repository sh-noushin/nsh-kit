import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';

import {
  NSH_BOTTOM_SHEET_DATA,
  NshBottomSheetRef,
  NshBottomSheetService,
  NshButtonComponent,
} from 'nsh-kit-ui';

interface ShareTarget {
  id: string;
  title: string;
  subtitle: string;
}

interface ShareSheetData {
  fileName: string;
  targets: ReadonlyArray<ShareTarget>;
}

const SHARE_TARGETS: ReadonlyArray<ShareTarget> = [
  { id: 'keep', title: 'Google Keep', subtitle: 'Add to note' },
  { id: 'docs', title: 'Google Docs', subtitle: 'Embed in a document' },
  { id: 'chat', title: 'Google Chat', subtitle: 'Send to a teammate' },
  { id: 'mail', title: 'Gmail', subtitle: 'Send as attachment' },
];

@Component({
  selector: 'demo-bottom-sheet-basic-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sheet">
      <header class="sheet__header">
        <h3 class="sheet__title">Share File</h3>
        <p class="sheet__subtitle">Choose where you want to send "{{ fileName }}".</p>
      </header>

      <div class="sheet__actions" role="list">
        @for (target of shareTargets; track target.id) {
          <button type="button" class="sheet__action" role="listitem" (click)="select(target.title)">
            <span class="sheet__action-title">{{ target.title }}</span>
            <span class="sheet__action-subtitle">{{ target.subtitle }}</span>
          </button>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .sheet {
        display: grid;
        gap: 14px;
      }

      .sheet__header {
        display: grid;
        gap: 6px;
      }

      .sheet__title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1f2533;
      }

      .sheet__subtitle {
        margin: 0;
        color: #556177;
        font-size: 0.92rem;
        line-height: 1.45;
      }

      .sheet__actions {
        display: grid;
        gap: 4px;
      }

      .sheet__action {
        display: grid;
        gap: 2px;
        width: 100%;
        border: none;
        border-radius: 10px;
        padding: 10px 12px;
        background: transparent;
        text-align: left;
        color: inherit;
        cursor: pointer;
      }

      .sheet__action:hover {
        background: #f3f6fc;
      }

      .sheet__action-title {
        font-size: 1rem;
        color: #1f2533;
        font-weight: 600;
      }

      .sheet__action-subtitle {
        font-size: 0.86rem;
        color: #5f6b81;
      }

    `,
  ],
})
class BottomSheetBasicContentComponent {
  private readonly bottomSheetRef = inject(NshBottomSheetRef<string>);
  private readonly data = inject(NSH_BOTTOM_SHEET_DATA, { optional: true }) as ShareSheetData | null;

  readonly shareTargets = this.data?.targets?.length ? this.data.targets : SHARE_TARGETS;
  readonly fileName = this.data?.fileName ?? 'cat-picture.jpg';

  select(target: string): void {
    this.bottomSheetRef.dismiss(target);
  }
}

@Component({
  selector: 'demo-bottom-sheet-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <div class="preview-card">
      <div class="preview-card__header">Bottom Sheet Overview</div>
      <p class="preview-card__body">You have received a file called "cat-picture.jpg".</p>
      <div class="preview-card__actions">
        <nsh-button variant="outlined" (click)="open()">Open file</nsh-button>
      </div>
      @if (lastAction(); as action) {
        <p class="preview-card__result">Last action: {{ action }}</p>
      }
    </div>
  `,
  styles: [
    `
      .preview-card {
        display: grid;
        gap: 16px;
        border-radius: 14px;
        border: 1px solid #d3dae7;
        background: linear-gradient(180deg, #fff 0%, #f9fbff 100%);
        padding: 16px;
      }

      .preview-card__header {
        font-size: 1.24rem;
        font-weight: 700;
        color: #1d2433;
      }

      .preview-card__body {
        margin: 0;
        font-size: 0.95rem;
        color: #556177;
      }

      .preview-card__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .preview-card__result {
        margin: 0;
        font-size: 0.88rem;
        color: #0f4ea9;
        font-weight: 600;
      }
    `,
  ],
})
export class BottomSheetBasicExampleComponent {
  private readonly bottomSheet = inject(NshBottomSheetService);
  private readonly activeSheetRef = signal<NshBottomSheetRef<string> | null>(null);

  readonly lastAction = signal<string | null>(null);

  constructor() {
    effect(
      () => {
        const ref = this.activeSheetRef();
        const result = ref?.afterDismissed() ?? null;
        if (result) {
          this.lastAction.set(result);
        }
      },
      { allowSignalWrites: true },
    );
  }

  open(): void {
    const ref = this.bottomSheet.open(BottomSheetBasicContentComponent, {
      ariaLabel: 'Share actions',
      closeOnBackdropClick: true,
      maxWidth: '560px',
      maxHeight: '70vh',
      data: {
        fileName: 'cat-picture.jpg',
        targets: SHARE_TARGETS,
      } satisfies ShareSheetData,
    });
    this.activeSheetRef.set(ref);
  }
}

export const bottomSheetBasicHtml = `<div class="preview-card">
  <div class="preview-card__header">Bottom Sheet Overview</div>
  <p class="preview-card__body">You have received a file called "cat-picture.jpg".</p>
  <div class="preview-card__actions">
    <nsh-button variant="outlined" (click)="open()">Open file</nsh-button>
  </div>
</div>`;

export const bottomSheetBasicTs = `import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NshBottomSheetRef, NshBottomSheetService, NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-bottom-sheet-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './bottom-sheet-basic.example.html'
})
export class BottomSheetBasicExampleComponent {
  private readonly bottomSheet = inject(NshBottomSheetService);
  private readonly activeSheetRef = signal<NshBottomSheetRef<string> | null>(null);
  readonly lastAction = signal<string | null>(null);

  constructor() {
    effect(() => {
      const ref = this.activeSheetRef();
      const result = ref?.afterDismissed() ?? null;
      if (result) {
        this.lastAction.set(result);
      }
    }, { allowSignalWrites: true });
  }

  open(): void {
    const ref = this.bottomSheet.open(BottomSheetBasicContentComponent, {
      ariaLabel: 'Share actions',
      closeOnBackdropClick: true,
      maxWidth: '560px',
      maxHeight: '70vh',
      data: {
        fileName: 'cat-picture.jpg',
        targets: [
          { id: 'keep', title: 'Google Keep', subtitle: 'Add to note' },
          { id: 'docs', title: 'Google Docs', subtitle: 'Embed in a document' }
        ]
      }
    });
    this.activeSheetRef.set(ref);
  }
}`;
