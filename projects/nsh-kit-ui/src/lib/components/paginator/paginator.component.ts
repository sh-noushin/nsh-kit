import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';

export interface NshPageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

let nextPaginatorId = 0;

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(Math.max(Math.floor(value), min), max);
}

@Component({
  selector: 'nsh-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-paginator-host]': 'true',
    '[class.nsh-paginator-host--disabled]': 'disabled()',
  },
  template: `
    <nav class="nsh-paginator" role="navigation" [attr.aria-label]="ariaLabel()">
      <div class="nsh-paginator__left">
        <label class="nsh-paginator__label" [attr.for]="pageSizeSelectId">Items per page</label>
        <select
          class="nsh-paginator__select"
          [id]="pageSizeSelectId"
          [disabled]="disabled()"
          [value]="pageSize()"
          (change)="onPageSizeChange($event)"
        >
          @for (opt of pageSizeOptions(); track opt) {
            <option [value]="opt">{{ opt }}</option>
          }
        </select>
      </div>

      <div class="nsh-paginator__range">{{ rangeText() }}</div>

      <div class="nsh-paginator__buttons">
        @if (showFirstLast()) {
          <button
            type="button"
            class="nsh-paginator__btn"
            [disabled]="isAtStart()"
            aria-label="First page"
            (click)="goFirst()"
          >
            <span aria-hidden="true">«</span>
          </button>
        }

        <button
          type="button"
          class="nsh-paginator__btn"
          [disabled]="isAtStart()"
          aria-label="Previous page"
          (click)="goPrev()"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <button
          type="button"
          class="nsh-paginator__btn"
          [disabled]="isAtEnd()"
          aria-label="Next page"
          (click)="goNext()"
        >
          <span aria-hidden="true">›</span>
        </button>

        @if (showFirstLast()) {
          <button
            type="button"
            class="nsh-paginator__btn"
            [disabled]="isAtEnd()"
            aria-label="Last page"
            (click)="goLast()"
          >
            <span aria-hidden="true">»</span>
          </button>
        }
      </div>
    </nav>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-paginator-height: var(--nsh-paginator-height, unset);
      --nsh-paginator-gap: var(--nsh-paginator-gap, unset);
      --nsh-paginator-padding-x: var(--nsh-paginator-padding-x, unset);
      --nsh-paginator-text-color: var(--nsh-paginator-text-color, unset);
      --nsh-paginator-muted-color: var(--nsh-paginator-muted-color, unset);
      --nsh-paginator-btn-bg: var(--nsh-paginator-btn-bg, unset);
      --nsh-paginator-btn-bg-hover: var(--nsh-paginator-btn-bg-hover, unset);
      --nsh-paginator-btn-fg: var(--nsh-paginator-btn-fg, unset);
      --nsh-paginator-btn-radius: var(--nsh-paginator-btn-radius, unset);
      --nsh-paginator-focus-ring: var(--nsh-paginator-focus-ring, unset);

      --_p-height: var(--nsh-paginator-height, var(--nsh-density-control-height));
      --_p-gap: var(--nsh-paginator-gap, var(--nsh-space-md));
      --_p-pad-x: var(--nsh-paginator-padding-x, var(--nsh-density-padding-inline));

      --_p-text: var(--nsh-paginator-text-color, var(--nsh-color-text));
      --_p-muted: var(--nsh-paginator-muted-color, var(--nsh-color-text-muted));

      --_p-btn-bg: var(--nsh-paginator-btn-bg, transparent);
      --_p-btn-bg-hover: var(
        --nsh-paginator-btn-bg-hover,
        color-mix(in srgb, var(--nsh-color-surface-2) 55%, transparent)
      );
      --_p-btn-fg: var(--nsh-paginator-btn-fg, var(--nsh-color-text));
      --_p-btn-radius: var(--nsh-paginator-btn-radius, var(--nsh-radius-md));

      --_p-focus-ring: var(
        --nsh-paginator-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 65%, transparent)
      );
    }

    .nsh-paginator {
      min-height: var(--_p-height);
      padding-inline: var(--_p-pad-x);

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--_p-gap);

      color: var(--_p-text);
      font-family: var(--nsh-font-family);
      font-size: var(--nsh-font-size-sm);
      line-height: var(--nsh-line-height-tight);
    }

    .nsh-paginator__left {
      display: inline-flex;
      align-items: center;
      gap: var(--nsh-space-sm);
      min-width: 0;
    }

    .nsh-paginator__label {
      color: var(--_p-muted);
      white-space: nowrap;
    }

    .nsh-paginator__select {
      min-height: calc(var(--_p-height) - var(--nsh-space-sm));
      padding-inline: var(--nsh-space-sm);
      border-radius: var(--nsh-radius-md);
      border: 1px solid var(--nsh-color-outline);
      background: var(--nsh-color-surface);
      color: var(--_p-text);
      font: inherit;
    }

    .nsh-paginator__select:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--nsh-space-xxs) var(--_p-focus-ring);
    }

    .nsh-paginator__range {
      color: var(--_p-muted);
      white-space: nowrap;
    }

    .nsh-paginator__buttons {
      display: inline-flex;
      align-items: center;
      gap: var(--nsh-space-xs);
    }

    .nsh-paginator__btn {
      appearance: none;
      border: 0;
      background: var(--_p-btn-bg);
      color: var(--_p-btn-fg);
      border-radius: var(--_p-btn-radius);

      min-height: calc(var(--_p-height) - var(--nsh-space-sm));
      min-width: calc(var(--_p-height) - var(--nsh-space-sm));
      padding-inline: var(--nsh-space-sm);

      display: inline-flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      user-select: none;

      transition:
        background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-paginator__btn:hover {
      background: var(--_p-btn-bg-hover);
    }

    .nsh-paginator__btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--nsh-space-xxs) var(--_p-focus-ring);
    }

    .nsh-paginator__btn:disabled,
    :host(.nsh-paginator-host--disabled) .nsh-paginator__btn {
      cursor: default;
      opacity: 0.6;
    }

    :host(.nsh-paginator-host--disabled) {
      pointer-events: none;
    }
  `,
})
export class NshPaginatorComponent {
  readonly length = input.required<number>();
  readonly pageIndex = input(0);
  readonly pageSize = input(10);
  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  readonly showFirstLast = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>('Pagination');

  readonly pageChange = output<NshPageChangeEvent>();

  readonly pageSizeSelectId = `nsh-paginator-page-size-${nextPaginatorId++}`;

  readonly safePageSize = computed(() => {
    const size = this.pageSize();
    return Number.isFinite(size) && size > 0 ? Math.floor(size) : 1;
  });

  readonly totalPages = computed(() => {
    const length = Math.max(0, this.length());
    return Math.max(1, Math.ceil(length / this.safePageSize()));
  });

  readonly clampedPageIndex = computed(() => {
    const maxIndex = this.totalPages() - 1;
    return clampInt(this.pageIndex(), 0, maxIndex);
  });

  readonly isAtStart = computed(() => this.disabled() || this.clampedPageIndex() <= 0);
  readonly isAtEnd = computed(() => this.disabled() || this.clampedPageIndex() >= this.totalPages() - 1);

  readonly rangeStart = computed(() => {
    const length = Math.max(0, this.length());
    if (length === 0) {
      return 0;
    }
    return this.clampedPageIndex() * this.safePageSize() + 1;
  });

  readonly rangeEnd = computed(() => {
    const length = Math.max(0, this.length());
    if (length === 0) {
      return 0;
    }
    return Math.min(length, (this.clampedPageIndex() + 1) * this.safePageSize());
  });

  readonly rangeText = computed(() => `${this.rangeStart()}–${this.rangeEnd()} of ${Math.max(0, this.length())}`);

  goFirst() {
    if (this.isAtStart()) {
      return;
    }
    this.emitPage(0, this.safePageSize());
  }

  goPrev() {
    if (this.isAtStart()) {
      return;
    }
    this.emitPage(this.clampedPageIndex() - 1, this.safePageSize());
  }

  goNext() {
    if (this.isAtEnd()) {
      return;
    }
    this.emitPage(this.clampedPageIndex() + 1, this.safePageSize());
  }

  goLast() {
    if (this.isAtEnd()) {
      return;
    }
    this.emitPage(this.totalPages() - 1, this.safePageSize());
  }

  onPageSizeChange(event: Event) {
    if (this.disabled()) {
      return;
    }

    const select = event.target as HTMLSelectElement | null;
    const nextSize = select ? Number.parseInt(select.value, 10) : NaN;
    if (!Number.isFinite(nextSize) || nextSize <= 0) {
      return;
    }

    this.emitPage(0, nextSize);
  }

  private emitPage(pageIndex: number, pageSize: number) {
    const totalPages = Math.max(1, Math.ceil(Math.max(0, this.length()) / Math.max(1, pageSize)));
    const clamped = clampInt(pageIndex, 0, totalPages - 1);

    this.pageChange.emit({
      pageIndex: clamped,
      pageSize,
      length: Math.max(0, this.length()),
    });
  }
}
