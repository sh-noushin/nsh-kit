import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  QueryList,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NshColumnDefDirective } from './table-column-def.directive';
import { NshSortDirective, type NshSortChange, type NshSortDirection } from '../sort/sort.directive';
import { NshSortHeaderDirective } from '../sort/sort-header.directive';
import { NshPaginatorComponent, type NshPageChangeEvent } from '../paginator/paginator.component';

export type NshTableTrackByFn<T> = (index: number, item: T) => unknown;
export type NshTableSortAccessorFn<T> = (row: T, sortId: string) => unknown;

function compareValues(a: unknown, b: unknown): number {
  if (a === b) {
    return 0;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  // Fallback for comparable primitives.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aa = a as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bb = b as any;

  return aa > bb ? 1 : aa < bb ? -1 : 0;
}

@Component({
  selector: 'nsh-table',
  standalone: true,
  imports: [NgTemplateOutlet, NshSortDirective, NshSortHeaderDirective, NshPaginatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-table-host]': 'true',
    '[class.nsh-table-host--sticky]': 'stickyHeader()',
  },
  template: `
    @if (columns().length === 0) {
      <div class="nsh-table__fallback">No columns</div>
    } @else {
      @if (showPaginator() && (paginatorPosition() === 'top' || paginatorPosition() === 'both')) {
        <div class="nsh-table__paginator nsh-table__paginator--top">
          <nsh-paginator
            [length]="length()"
            [pageIndex]="clampedPageIndex()"
            [pageSize]="safePageSize()"
            [pageSizeOptions]="pageSizeOptions()"
            [disabled]="disabled()"
            [ariaLabel]="paginatorAriaLabel()"
            (pageChange)="onPaginatorChange($event)"
          />
        </div>
      }

      <table
        class="nsh-table"
        [attr.aria-label]="ariaLabel()"
        nshSort
        [active]="sortActive()"
        [direction]="sortDirection()"
        [disableClear]="disableClear()"
        (sortChange)="onSortChange($event)"
      >
        <thead class="nsh-table__thead" [class.nsh-table__thead--sticky]="stickyHeader()">
          <tr class="nsh-table__tr nsh-table__tr--header">
            @for (col of columns(); track col.name()) {
              @if (col.sortable()) {
                <th
                  class="nsh-table__th nsh-table__th--sortable"
                  scope="col"
                  nshSortHeader
                  [disabled]="disabled()"
                  id="{{ col.getEffectiveSortId() }}"
                >
                  @if (col.getHeaderTemplateRef()) {
                    <ng-container [ngTemplateOutlet]="col.getHeaderTemplateRef()" />
                  } @else {
                    {{ col.name() }}
                  }
                </th>
              } @else {
                <th class="nsh-table__th" scope="col">
                  @if (col.getHeaderTemplateRef()) {
                    <ng-container [ngTemplateOutlet]="col.getHeaderTemplateRef()" />
                  } @else {
                    {{ col.name() }}
                  }
                </th>
              }
            }
          </tr>
        </thead>

        <tbody class="nsh-table__tbody">
          @if (data().length === 0) {
            <tr class="nsh-table__tr nsh-table__tr--empty">
              <td class="nsh-table__td nsh-table__td--empty" [attr.colspan]="columns().length">No data</td>
            </tr>
          } @else {
            @for (row of pagedData(); track trackRow($index, row)) {
              <tr class="nsh-table__tr nsh-table__tr--body">
                @for (col of columns(); track col.name()) {
                  <td class="nsh-table__td">
                    @if (col.getCellTemplateRef()) {
                      <ng-container
                        [ngTemplateOutlet]="col.getCellTemplateRef()"
                        [ngTemplateOutletContext]="{ $implicit: row, row: row }"
                      />
                    }
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>

      @if (showPaginator() && (paginatorPosition() === 'bottom' || paginatorPosition() === 'both')) {
        <div class="nsh-table__paginator nsh-table__paginator--bottom">
          <nsh-paginator
            [length]="length()"
            [pageIndex]="clampedPageIndex()"
            [pageSize]="safePageSize()"
            [pageSizeOptions]="pageSizeOptions()"
            [disabled]="disabled()"
            [ariaLabel]="paginatorAriaLabel()"
            (pageChange)="onPaginatorChange($event)"
          />
        </div>
      }
    }
  `,
  styles: `
    :host {
      display: block;

      --_nsh-table-border: var(--nsh-table-border-color, var(--nsh-color-outline));
      --_nsh-table-header-bg: var(--nsh-table-header-bg, var(--nsh-color-surface-2));
      --_nsh-table-hover-bg: var(
        --nsh-table-row-hover-bg,
        color-mix(in srgb, var(--nsh-color-surface-2) 55%, transparent)
      );
      --_nsh-table-cell-pad: var(--nsh-table-cell-padding, var(--nsh-space-sm));
      --_nsh-table-font-size: var(--nsh-table-font-size, var(--nsh-font-size-sm));

      --_nsh-table-sort-indicator-color: var(
        --nsh-table-sort-indicator-color,
        var(--nsh-sort-indicator-color, var(--nsh-color-text-muted))
      );
      --_nsh-table-sort-indicator-size: var(
        --nsh-table-sort-indicator-size,
        var(--nsh-sort-indicator-size, var(--nsh-font-size-xs))
      );

      --_nsh-table-paginator-gap: var(--nsh-table-paginator-gap, var(--nsh-space-md));
      --_nsh-table-paginator-pad-y: var(--nsh-table-paginator-padding-y, var(--nsh-space-sm));
    }

    .nsh-table__fallback {
      padding: var(--_nsh-table-cell-pad);
      color: var(--nsh-color-text-muted);
      font-family: var(--nsh-font-family);
      font-size: var(--_nsh-table-font-size);
    }

    .nsh-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--nsh-font-family);
      font-size: var(--_nsh-table-font-size);
      color: var(--nsh-color-text);
    }

    .nsh-table__th,
    .nsh-table__td {
      padding: var(--_nsh-table-cell-pad);
      border-bottom: 1px solid var(--_nsh-table-border);
      vertical-align: middle;
      text-align: start;
    }

    .nsh-table__thead .nsh-table__th {
      background: var(--_nsh-table-header-bg);
      color: var(--nsh-color-text);
      font-weight: var(--nsh-font-weight-semibold);
    }

    .nsh-table__th--sortable {
      cursor: pointer;
      user-select: none;
    }

    .nsh-table__th--sortable.nsh-sort-header {
      display: inline-flex;
      align-items: center;
      gap: var(--nsh-space-xs);
    }

    .nsh-table__th--sortable.nsh-sort-header::after {
      content: '';
      width: 0;
      height: 0;
      opacity: 0;
      border-left: calc(var(--_nsh-table-sort-indicator-size) / 2) solid transparent;
      border-right: calc(var(--_nsh-table-sort-indicator-size) / 2) solid transparent;
    }

    .nsh-table__th--sortable.nsh-sort-active::after {
      opacity: 1;
    }

    .nsh-table__th--sortable.nsh-sort-active.nsh-sort-asc::after {
      border-bottom: var(--_nsh-table-sort-indicator-size) solid var(--_nsh-table-sort-indicator-color);
    }

    .nsh-table__th--sortable.nsh-sort-active.nsh-sort-desc::after {
      border-top: var(--_nsh-table-sort-indicator-size) solid var(--_nsh-table-sort-indicator-color);
    }

    .nsh-table__thead--sticky .nsh-table__th {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .nsh-table__tr--body:hover .nsh-table__td {
      background: var(--_nsh-table-hover-bg);
    }

    .nsh-table__td--empty {
      color: var(--nsh-color-text-muted);
    }

    .nsh-table__paginator {
      display: block;
      padding-block: var(--_nsh-table-paginator-pad-y);
    }

    .nsh-table__paginator--top {
      margin-bottom: var(--_nsh-table-paginator-gap);
    }

    .nsh-table__paginator--bottom {
      margin-top: var(--_nsh-table-paginator-gap);
    }
  `,
})
export class NshTableComponent<T = unknown> {
  readonly data = input<T[]>([]);
  readonly trackBy = input<NshTableTrackByFn<T> | null>(null);
  readonly stickyHeader = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>('Table');

  readonly sortActive = input<string | null>(null);
  readonly sortDirection = input<NshSortDirection>('');
  readonly disableClear = input(false, { transform: booleanAttribute });
  readonly sortAccessor = input<NshTableSortAccessorFn<T> | null>(null);

  readonly sortChange = output<NshSortChange>();

  readonly pageIndex = input(0);
  readonly pageSize = input(10);
  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  readonly showPaginator = input(true, { transform: booleanAttribute });
  readonly paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaPaginatorLabel = input<string | null>(null);

  readonly pageChange = output<NshPageChangeEvent>();

  private columnDefsQuery?: QueryList<NshColumnDefDirective<T>>;
  private columnsSubscribed = false;

  private readonly destroyRef = inject(DestroyRef);

  private readonly _columns = signal<NshColumnDefDirective<T>[]>([]);
  readonly columns = computed(() => this._columns());

  readonly safePageSize = computed(() => {
    const size = this.pageSize();
    return Number.isFinite(size) && size > 0 ? Math.floor(size) : 1;
  });

  readonly length = computed(() => this.sortedData().length);

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.length() / this.safePageSize()));
  });

  readonly clampedPageIndex = computed(() => {
    const requested = this.pageIndex();
    const maxIndex = this.totalPages() - 1;
    const clamped = Number.isFinite(requested) ? Math.floor(requested) : 0;
    return Math.min(Math.max(clamped, 0), maxIndex);
  });

  readonly paginatorAriaLabel = computed(() => this.ariaPaginatorLabel() ?? 'Pagination');

  readonly sortedData = computed(() => {
    const data = this.data();
    const active = this.sortActive();
    const direction = this.sortDirection();

    if (!active || direction === '') {
      return data;
    }

    const accessor = this.sortAccessor();
    const getValue = (row: T) => (accessor ? accessor(row, active) : (row as any)?.[active]);

    const dirFactor = direction === 'asc' ? 1 : -1;
    const withIndex = data.map((row, index) => ({ row, index, value: getValue(row) }));

    withIndex.sort((a, b) => {
      const av = a.value;
      const bv = b.value;

      const aNull = av === null || av === undefined;
      const bNull = bv === null || bv === undefined;

      if (aNull && bNull) {
        return a.index - b.index;
      }
      if (aNull) {
        // Nulls last in asc, first in desc
        return direction === 'asc' ? 1 : -1;
      }
      if (bNull) {
        return direction === 'asc' ? -1 : 1;
      }

      const cmp = compareValues(av, bv);
      if (cmp !== 0) {
        return cmp * dirFactor;
      }
      return a.index - b.index;
    });

    return withIndex.map((x) => x.row);
  });

  readonly pagedData = computed(() => {
    const data = this.sortedData();
    if (data.length === 0) {
      return data;
    }

    const size = this.safePageSize();
    const start = this.clampedPageIndex() * size;
    const end = start + size;
    return data.slice(start, end);
  });

  @ContentChildren(NshColumnDefDirective)
  set columnDefsQueryList(value: QueryList<NshColumnDefDirective<T>> | undefined) {
    this.columnDefsQuery = value;
    this._columns.set(value?.toArray() ?? []);

    if (!value || this.columnsSubscribed) {
      return;
    }

    this.columnsSubscribed = true;
    value.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this._columns.set(value.toArray());
    });
  }

  trackRow(index: number, row: T): unknown {
    const fn = this.trackBy();
    return fn ? fn(index, row) : row;
  }

  onSortChange(ev: NshSortChange) {
    this.sortChange.emit(ev);
  }

  onPaginatorChange(ev: NshPageChangeEvent) {
    this.pageChange.emit(ev);
  }
}
