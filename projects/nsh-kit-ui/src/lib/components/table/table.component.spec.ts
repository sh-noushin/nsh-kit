import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshTableComponent } from './table.component';
import { NshColumnDefDirective } from './table-column-def.directive';
import { NshCellDefDirective, NshHeaderCellDefDirective } from './table-cell-def.directive';
import type { NshSortChange, NshSortDirection } from '../sort/sort.directive';
import type { NshPageChangeEvent } from '../paginator/paginator.component';

interface RowData {
  id: number;
  name: string;
  age: number;
}

@Component({
  standalone: true,
  imports: [NshTableComponent, NshColumnDefDirective, NshHeaderCellDefDirective, NshCellDefDirective],
  template: `
    <nsh-table [data]="data" [trackBy]="trackBy" [ariaLabel]="ariaLabel">
      <ng-container nshColumnDef [name]="'name'">
        <ng-template nshHeaderCell>Name</ng-template>
        <ng-template nshCell let-row>{{ row.name }}</ng-template>
      </ng-container>

      <ng-container nshColumnDef [name]="'age'">
        <ng-template nshHeaderCell>Age</ng-template>
        <ng-template nshCell let-row>{{ row.age }}</ng-template>
      </ng-container>
    </nsh-table>
  `,
})
class HostComponent {
  ariaLabel = 'People';
  data: RowData[] = [
    { id: 1, name: 'Ada', age: 36 },
    { id: 2, name: 'Linus', age: 55 },
  ];

  trackBy: ((index: number, item: RowData) => unknown) | null = null;
}

@Component({
  standalone: true,
  imports: [NshTableComponent, NshColumnDefDirective, NshHeaderCellDefDirective, NshCellDefDirective],
  template: `
    <nsh-table
      [data]="data"
      [sortActive]="sortActive"
      [sortDirection]="sortDirection"
      [disableClear]="disableClear"
      (sortChange)="onSortChange($event)"
    >
      <ng-container nshColumnDef [name]="'name'" [sortable]="true">
        <ng-template nshHeaderCell>Name</ng-template>
        <ng-template nshCell let-row>{{ row.name }}</ng-template>
      </ng-container>

      <ng-container nshColumnDef [name]="'age'" [sortable]="true">
        <ng-template nshHeaderCell>Age</ng-template>
        <ng-template nshCell let-row>{{ row.age }}</ng-template>
      </ng-container>

      <ng-container nshColumnDef [name]="'id'">
        <ng-template nshHeaderCell>Id</ng-template>
        <ng-template nshCell let-row>{{ row.id }}</ng-template>
      </ng-container>
    </nsh-table>
  `,
})
class SortHostComponent {
  data: Array<{ id: number; name: string; age: number | null }> = [
    { id: 1, name: 'B', age: 10 },
    { id: 2, name: 'A', age: 10 },
    { id: 3, name: 'C', age: 5 },
    { id: 4, name: 'D', age: null },
  ];

  sortActive: string | null = null;
  sortDirection: NshSortDirection = '';
  disableClear = false;

  events: NshSortChange[] = [];

  onSortChange(ev: NshSortChange) {
    this.events.push(ev);
    this.sortActive = ev.active;
    this.sortDirection = ev.direction;
  }
}

@Component({
  standalone: true,
  imports: [NshTableComponent, NshColumnDefDirective, NshHeaderCellDefDirective, NshCellDefDirective],
  template: `
    <nsh-table
      [data]="data"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      [showPaginator]="showPaginator"
      [paginatorPosition]="paginatorPosition"
      (pageChange)="onPageChange($event)"
      [sortActive]="sortActive"
      [sortDirection]="sortDirection"
    >
      <ng-container nshColumnDef [name]="'name'" [sortable]="true">
        <ng-template nshHeaderCell>Name</ng-template>
        <ng-template nshCell let-row>{{ row.name }}</ng-template>
      </ng-container>
    </nsh-table>
  `,
})
class PageHostComponent {
  data: Array<{ name: string }> = Array.from({ length: 25 }, (_v, i) => ({ name: `Item ${i + 1}` }));
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];
  showPaginator = true;
  paginatorPosition: 'top' | 'bottom' | 'both' = 'bottom';

  sortActive: string | null = null;
  sortDirection: NshSortDirection = '';

  events: NshPageChangeEvent[] = [];

  onPageChange(ev: NshPageChangeEvent) {
    this.events.push(ev);
  }
}

function getBodyFirstColumnText(fixture: any): string[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('tbody tr td:first-child') as NodeListOf<HTMLElement>,
  ).map((el) => (el.textContent ?? '').trim());
}

function getHeaderByText(fixture: any, text: string): HTMLElement {
  const headers = Array.from(fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>);
  const header = headers.find((h) => (h.textContent ?? '').trim() === text);
  if (!header) {
    throw new Error(`Header not found: ${text}`);
  }
  return header;
}

function getBodySingleColumnText(fixture: any): string[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('tbody tr td') as NodeListOf<HTMLElement>,
  ).map((el) => (el.textContent ?? '').trim());
}



describe('NshTableComponent', () => {
  it('renders headers for given column defs', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const headers = Array.from(
      fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>,
    ).map((el) => (el.textContent ?? '').trim());
    expect(headers).toEqual(['Name', 'Age']);
  });

  it('renders cell templates with row context', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const firstRowCells = Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr:first-child td') as NodeListOf<HTMLElement>,
    ).map((el) => (el.textContent ?? '').trim());
    expect(firstRowCells).toEqual(['Ada', '36']);
  });

  it('empty data shows "No data" row', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.data = [];
    fixture.detectChanges();

    const emptyCell = fixture.nativeElement.querySelector('tbody td.nsh-table__td--empty') as HTMLElement;
    expect((emptyCell.textContent ?? '').trim()).toBe('No data');

    const colspan = emptyCell.getAttribute('colspan');
    expect(colspan).toBe('2');
  });

  it('trackBy is applied when provided', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    const calls: Array<{ index: number; id: number }> = [];
    fixture.componentInstance.trackBy = (index, item) => {
      calls.push({ index, id: item.id });
      return item.id;
    };
    fixture.detectChanges();

    expect(calls.length).toBeGreaterThan(0);
    expect(calls.some((c) => c.index === 0 && c.id === 1)).toBe(true);
  });

  it('aria-label is set', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    expect(table.getAttribute('aria-label')).toBe('People');
  });

  it('clicking a sortable header emits sortChange and cycles direction when disableClear=false', async () => {
    await TestBed.configureTestingModule({ imports: [SortHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(SortHostComponent);
    fixture.detectChanges();

    const nameHeader = getHeaderByText(fixture, 'Name');

    nameHeader.click();
    fixture.detectChanges();
    nameHeader.click();
    fixture.detectChanges();
    nameHeader.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events).toEqual([
      { active: 'name', direction: 'asc' },
      { active: 'name', direction: 'desc' },
      { active: 'name', direction: '' },
    ]);
  });

  it('clicking a sortable header cycles direction when disableClear=true (asc <-> desc)', async () => {
    await TestBed.configureTestingModule({ imports: [SortHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(SortHostComponent);
    fixture.componentInstance.disableClear = true;
    fixture.detectChanges();

    const ageHeader = getHeaderByText(fixture, 'Age');

    ageHeader.click();
    fixture.detectChanges();
    ageHeader.click();
    fixture.detectChanges();
    ageHeader.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.map((e) => e.direction)).toEqual(['asc', 'desc', 'asc']);
  });

  it('data is sorted correctly for asc and desc (nulls last in asc, first in desc)', async () => {
    await TestBed.configureTestingModule({ imports: [SortHostComponent] }).compileComponents();

    const ascFixture = TestBed.createComponent(SortHostComponent);
    ascFixture.componentInstance.sortActive = 'age';
    ascFixture.componentInstance.sortDirection = 'asc';
    ascFixture.detectChanges();

    // First column is name
    expect(getBodyFirstColumnText(ascFixture)).toEqual(['C', 'B', 'A', 'D']);

    const descFixture = TestBed.createComponent(SortHostComponent);
    descFixture.componentInstance.sortActive = 'age';
    descFixture.componentInstance.sortDirection = 'desc';
    descFixture.detectChanges();
    expect(getBodyFirstColumnText(descFixture)).toEqual(['D', 'B', 'A', 'C']);
  });

  it('stable sorting keeps original order for equal values', async () => {
    await TestBed.configureTestingModule({ imports: [SortHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(SortHostComponent);
    fixture.componentInstance.sortActive = 'age';
    fixture.componentInstance.sortDirection = 'asc';
    fixture.detectChanges();

    // Rows with age=10 are B then A in the original input; they should stay B then A.
    const names = getBodyFirstColumnText(fixture);
    const bIndex = names.indexOf('B');
    const aIndex = names.indexOf('A');
    expect(bIndex).toBeGreaterThan(-1);
    expect(aIndex).toBeGreaterThan(-1);
    expect(bIndex).toBeLessThan(aIndex);
  });

  it('non-sortable columns do not trigger sortChange', async () => {
    await TestBed.configureTestingModule({ imports: [SortHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(SortHostComponent);
    fixture.detectChanges();

    const idHeader = getHeaderByText(fixture, 'Id');
    idHeader.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.events.length).toBe(0);
  });

  it('aria-sort updates on active header', async () => {
    await TestBed.configureTestingModule({ imports: [SortHostComponent] }).compileComponents();

    const ascFixture = TestBed.createComponent(SortHostComponent);
    ascFixture.componentInstance.sortActive = 'name';
    ascFixture.componentInstance.sortDirection = 'asc';
    ascFixture.detectChanges();

    const ascNameHeader = getHeaderByText(ascFixture, 'Name');
    const ascAgeHeader = getHeaderByText(ascFixture, 'Age');
    expect(ascNameHeader.getAttribute('aria-sort')).toBe('ascending');
    expect(ascAgeHeader.hasAttribute('aria-sort')).toBe(false);

    const descFixture = TestBed.createComponent(SortHostComponent);
    descFixture.componentInstance.sortActive = 'name';
    descFixture.componentInstance.sortDirection = 'desc';
    descFixture.detectChanges();

    const descNameHeader = getHeaderByText(descFixture, 'Name');
    expect(descNameHeader.getAttribute('aria-sort')).toBe('descending');
  });

  it('renders correct slice of data for given pageIndex/pageSize', async () => {
    await TestBed.configureTestingModule({ imports: [PageHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(PageHostComponent);
    fixture.componentInstance.pageSize = 5;
    fixture.componentInstance.pageIndex = 2;
    fixture.detectChanges();

    expect(getBodySingleColumnText(fixture)).toEqual(['Item 11', 'Item 12', 'Item 13', 'Item 14', 'Item 15']);
  });

  it('sorting + pagination together: sort then slice', async () => {
    await TestBed.configureTestingModule({ imports: [PageHostComponent] }).compileComponents();

    const page0 = TestBed.createComponent(PageHostComponent);
    page0.componentInstance.data = [{ name: 'C' }, { name: 'A' }, { name: 'B' }, { name: 'D' }];
    page0.componentInstance.sortActive = 'name';
    page0.componentInstance.sortDirection = 'asc';
    page0.componentInstance.pageSize = 2;
    page0.componentInstance.pageIndex = 0;
    page0.detectChanges(false);
    expect(getBodySingleColumnText(page0)).toEqual(['A', 'B']);

    const page1 = TestBed.createComponent(PageHostComponent);
    page1.componentInstance.data = [{ name: 'C' }, { name: 'A' }, { name: 'B' }, { name: 'D' }];
    page1.componentInstance.sortActive = 'name';
    page1.componentInstance.sortDirection = 'asc';
    page1.componentInstance.pageSize = 2;
    page1.componentInstance.pageIndex = 1;
    page1.detectChanges(false);
    expect(getBodySingleColumnText(page1)).toEqual(['C', 'D']);
  });

  it('pageChange emitted when paginator emits', async () => {
    await TestBed.configureTestingModule({ imports: [PageHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(PageHostComponent);
    fixture.detectChanges();

    const next = fixture.nativeElement.querySelector('button[aria-label="Next page"]') as HTMLButtonElement;
    next.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.at(-1)).toEqual({ pageIndex: 1, pageSize: 10, length: 25 });
  });

  it('pageSize change resets pageIndex to 0 and emits pageChange', async () => {
    await TestBed.configureTestingModule({ imports: [PageHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(PageHostComponent);
    fixture.componentInstance.pageIndex = 2;
    fixture.componentInstance.pageSize = 10;
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-paginator__select') as HTMLSelectElement;
    select.value = '25';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.events.at(-1)).toEqual({ pageIndex: 0, pageSize: 25, length: 25 });
  });

  it('paginator shows/hides based on showPaginator and position', async () => {
    await TestBed.configureTestingModule({ imports: [PageHostComponent] }).compileComponents();

    const hidden = TestBed.createComponent(PageHostComponent);
    hidden.componentInstance.showPaginator = false;
    hidden.detectChanges(false);
    expect(hidden.nativeElement.querySelectorAll('nsh-paginator').length).toBe(0);

    const top = TestBed.createComponent(PageHostComponent);
    top.componentInstance.showPaginator = true;
    top.componentInstance.paginatorPosition = 'top';
    top.detectChanges(false);
    expect(top.nativeElement.querySelectorAll('nsh-paginator').length).toBe(1);

    const both = TestBed.createComponent(PageHostComponent);
    both.componentInstance.showPaginator = true;
    both.componentInstance.paginatorPosition = 'both';
    both.detectChanges(false);
    expect(both.nativeElement.querySelectorAll('nsh-paginator').length).toBe(2);
  });

  it('clamps pageIndex when length decreases and current page becomes invalid', async () => {
    await TestBed.configureTestingModule({ imports: [PageHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(PageHostComponent);
    fixture.componentInstance.pageSize = 10;
    fixture.componentInstance.pageIndex = 2;
    // With 15 items and pageSize=10, totalPages=2 => clamped pageIndex should be 1.
    fixture.componentInstance.data = Array.from({ length: 15 }, (_v, i) => ({ name: `Item ${i + 1}` }));
    fixture.detectChanges(false);

    expect(getBodySingleColumnText(fixture)).toEqual(['Item 11', 'Item 12', 'Item 13', 'Item 14', 'Item 15']);
  });
});
