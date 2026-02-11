import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshPaginatorComponent, type NshPageChangeEvent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-paginator-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshPaginatorComponent],
  template: `
    <div class="example-stack">
      <nsh-paginator
        [length]="length()"
        [pageIndex]="pageIndex()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[5, 10, 20]"
        (pageChange)="onPageChange($event)"
      ></nsh-paginator>
      <div class="example-meta">Page {{ pageIndex() + 1 }} of {{ totalPages() }}</div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-sm);
      }

      .example-meta {
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class PaginatorBasicExampleComponent {
  readonly length = signal(42);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  readonly totalPages = signal(9);

  onPageChange(event: NshPageChangeEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.totalPages.set(Math.ceil(event.length / event.pageSize));
  }
}

export const paginatorBasicHtml = `<nsh-paginator
  [length]="length"
  [pageIndex]="pageIndex"
  [pageSize]="pageSize"
  [pageSizeOptions]="[5, 10, 20]"
  (pageChange)="onPageChange($event)"
></nsh-paginator>`;

export const paginatorBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshPaginatorComponent, type NshPageChangeEvent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-paginator-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshPaginatorComponent],
  templateUrl: './paginator-basic.example.html'
})
export class PaginatorBasicExampleComponent {
  length = 42;
  pageIndex = 0;
  pageSize = 5;

  onPageChange(event: NshPageChangeEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}`;
